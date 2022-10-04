import ExpoModulesCore
import CoreSpotlight
import MobileCoreServices
// https://developer.apple.com/documentation/foundation/nsuseractivity/3552239-shortcutavailability
import Intents

struct MetadataOptions: Record {
  @Field
  var activityType: String!
  @Field
  var id: String!
  @Field
  var eligibleForSearch: Bool = true
  @Field
  var title: String?
  @Field
  var webpageURL: URL?
  @Field
  var imageData: Data?
  @Field
  var imageUrl: URL?
  @Field
  var darkImageUrl: URL?
  @Field
  var keywords: [String]?
  @Field
  var dateModified: Date?
  @Field
  var expirationDate: Date?
  @Field
  var userInfo: [String: AnyHashable]?
}

let INDEXED_ROUTE = Bundle.main.bundleIdentifier! + ".expo.index_route"

var launchedActivity: NSUserActivity?

let onActivityChanged = "onActivityChanged"

extension UIApplication {
    var icon: UIImage? {
        guard let iconsDictionary = Bundle.main.infoDictionary?["CFBundleIcons"] as? NSDictionary,
            let primaryIconsDictionary = iconsDictionary["CFBundlePrimaryIcon"] as? NSDictionary,
            let iconFiles = primaryIconsDictionary["CFBundleIconFiles"] as? NSArray,
            // First will be smallest for the device class, last will be the largest for device class
            let lastIcon = iconFiles.lastObject as? String,
            let icon = UIImage(named: lastIcon) else {
                return nil
        }

        return icon
    }
}


public class ExpoHeadModule: Module {
  private var activities = Set<NSUserActivity>()

  static var _sendEvent: ((_ eventName: String, _ body: [String: Any?]) -> Void)?

  public static func sendEvent(_ eventName: String, _ body: [String: Any?] = [:]) {
    ExpoHeadModule._sendEvent?(eventName, body)
  }

  public required init(appContext: AppContext) {
    super.init(appContext: appContext)
    ExpoHeadModule._sendEvent = sendEvent
  }

//  @objc
//  func onActivityChangedFunc() {
//     sendEvent(onActivityChanged, [:])
//   }


  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoHead')` in JavaScript.
    Name("ExpoHead")

    Constants([
      "activities": [
        "INDEXED_ROUTE": INDEXED_ROUTE
      ]
    ])

    Events(onActivityChanged)


    OnStartObserving {
//         NotificationCenter.default.removeObserver(self, name: UIPasteboard.changedNotification, object: nil)
//         NotificationCenter.default.addObserver(
//           self,
//           selector: #selector(self.clipboardChangedListener),
//           name: UIPasteboard.changedNotification,
//           object: nil
//         )
       }

       OnStopObserving {
//         NotificationCenter.default.removeObserver(self, name: UIPasteboard.changedNotification, object: nil)
       }


    Function("getLaunchActivity") { () -> [String: Any]? in
      if let activity = launchedActivity {
//        let metadata = MetadataOptions(activityType: activity.activityType, id: activity.persistentIdentifier, eligibleForSearch: activity.isEligibleForSearch, title: activity.title, webpageURL: activity.webpageURL, imageData: activity.contentAttributeSet?.thumbnailData, imageUrl: activity.contentAttributeSet?.thumbnailURL, darkImageUrl: activity.contentAttributeSet?.darkThumbnailURL, keywords: activity.keywords, dateModified: activity.contentAttributeSet?.metadataModificationDate, expirationDate: activity.expirationDate, userInfo: activity.user)


        return [
          "activityType": activity.activityType, 
          "id": activity.persistentIdentifier, 
          "eligibleForSearch": activity.isEligibleForSearch, 
          "title": activity.title, 
          "webpageURL": activity.webpageURL, 
          "imageData": activity.contentAttributeSet?.thumbnailData, 
          "imageUrl": activity.contentAttributeSet?.thumbnailURL, 
          "darkImageUrl": activity.contentAttributeSet?.darkThumbnailURL, 
          "keywords": activity.keywords, 
          "dateModified": activity.contentAttributeSet?.metadataModificationDate, 
          "expirationDate": activity.expirationDate, 
          "userInfo": activity.userInfo
        ]
      }
      return nil
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("createActivity") { (value: MetadataOptions) in
    // TODO: https://gist.github.com/alexruperez/ea81aa3e371f7d0d7ea5e594d7e9ad08
         let activity = NSUserActivity(activityType: value.activityType)
          activity.persistentIdentifier = value.id
         activity.isEligibleForHandoff = true
         activity.isEligibleForPublicIndexing = true
         activity.isEligibleForSearch = value.eligibleForSearch
         activity.isEligibleForPrediction = true;

      activity.userInfo = value.userInfo

      let att = CSSearchableItemAttributeSet(
           itemContentType: kUTTypeText as String)
      activity.contentAttributeSet = att;
      activity.contentAttributeSet?.metadataModificationDate = value.dateModified

      if (value.imageData == nil && value.imageUrl == nil) {

        // Default to using the app icon as the thumbnail
        att.thumbnailData = UIApplication.shared.icon?.pngData()
      }
      
        activity.contentAttributeSet?.thumbnailData = value.imageData
        activity.contentAttributeSet?.thumbnailURL = value.imageUrl
        activity.contentAttributeSet?.darkThumbnailURL = value.darkImageUrl

      activity.title = value.title
      activity.contentAttributeSet?.title = value.title

      activity.expirationDate = value.expirationDate
      

      if (value.webpageURL != nil) {
        activity.webpageURL = value.webpageURL
      }
      self.activities.insert(activity)

       // activity.userInfo = [self.userActivityType.userInfoKey: self.userActivityUniqueIdentifier]
       // activity.keywords = UserActivityType.keywords
       // activity.contentAttributeSet = attributeSet
//         activity.needsSave = true
         activity.becomeCurrent()

        // TODO: Fallback on using app icon as thumbnail image.

    }
    AsyncFunction("suspendActivity") { (id: String) in
      let activity = self.activities.first(where: { $0.persistentIdentifier == id })
      activity?.resignCurrent()
    }

    AsyncFunction("revokeActivity") { (id: String) in
      let activity = self.activities.first(where: { $0.persistentIdentifier == id })
      activity?.invalidate()
      if let activity = activity {
        self.activities.remove(activity)
      }
    }

//    OnAppEntersForeground {
//         if !self.activities.isEmpty {
//           setActivated(true)
//         }
//       }
//
//       OnAppEntersBackground {
//         if !self.activeTags.isEmpty {
//           setActivated(false)
//         }
//       }

  }
}
