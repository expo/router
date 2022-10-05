import ExpoModulesCore
import CoreSpotlight
import MobileCoreServices
// https://developer.apple.com/documentation/foundation/nsuseractivity/3552239-shortcutavailability
//import Intents

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
  @Field
  var description: String?

  @Field
  var phrase: String?


}

let INDEXED_ROUTE = Bundle.main.bundleIdentifier! + ".expo.index_route"

var launchedActivity: NSUserActivity?

public class ExpoHeadModule: Module {
  private var activities = Set<NSUserActivity>()

  public required init(appContext: AppContext) {
    super.init(appContext: appContext)
  }


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

    Function("getLaunchActivity") { () -> [String: Any]? in
      if let activity = launchedActivity {
//        let metadata = MetadataOptions(activityType: activity.activityType, id: activity.persistentIdentifier, eligibleForSearch: activity.isEligibleForSearch, title: activity.title, webpageURL: activity.webpageURL, imageData: activity.contentAttributeSet?.thumbnailData, imageUrl: activity.contentAttributeSet?.thumbnailURL, darkImageUrl: activity.contentAttributeSet?.darkThumbnailURL, keywords: activity.keywords, dateModified: activity.contentAttributeSet?.metadataModificationDate, expirationDate: activity.expirationDate, userInfo: activity.user)


        return [
          "activityType": activity.activityType,
          "description": activity.contentAttributeSet?.contentDescription,
          "id": activity.persistentIdentifier, 
          "eligibleForSearch": activity.isEligibleForSearch, 
          "title": activity.title, 
          "webpageURL": activity.webpageURL, 
//          "imageData": activity.contentAttributeSet?.thumbnailData,
          "imageUrl": activity.contentAttributeSet?.thumbnailURL, 
          "darkImageUrl": activity.contentAttributeSet?.darkThumbnailURL, 
          "keywords": activity.keywords, 
          "dateModified": activity.contentAttributeSet?.metadataModificationDate, 
          "expirationDate": activity.expirationDate, 
          "userInfo": activity.userInfo,
//          "phrase": activity.suggestedInvocationPhrase,
        ]
      }
      return nil
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("createActivity") { (value: MetadataOptions) in

      let activity = self.activities.first(where: { $0.persistentIdentifier == value.id }) ?? NSUserActivity(activityType: value.activityType)

    // TODO: https://gist.github.com/alexruperez/ea81aa3e371f7d0d7ea5e594d7e9ad08
//         let activity = NSUserActivity(activityType: value.activityType)
          activity.persistentIdentifier = value.id
         activity.isEligibleForHandoff = true
         activity.isEligibleForPublicIndexing = true
         activity.isEligibleForSearch = value.eligibleForSearch
         activity.isEligibleForPrediction = true;
      // Make all indexed routes deletable
      activity.contentAttributeSet?.domainIdentifier = INDEXED_ROUTE

      activity.userInfo = value.userInfo

//      let att = CSSearchableItemAttributeSet(
//           itemContentType: kUTTypeText as String)
      let att = CSSearchableItemAttributeSet(
           itemContentType: kUTTypeContent as String)
//      kUTTypeItem
      activity.contentAttributeSet = att;
      activity.contentAttributeSet?.metadataModificationDate = value.dateModified

      // Required for handling incoming requests
      activity.requiredUserInfoKeys = ["href"]

//        activity.contentAttributeSet?.thumbnailURL = value.imageUrl
      if let localUrl = value.imageUrl?.path {
        let img = UIImage(contentsOfFile: localUrl)
        if let data = img?.pngData() {
          activity.contentAttributeSet?.thumbnailData = data
        }
      }

        activity.contentAttributeSet?.darkThumbnailURL = value.darkImageUrl

      activity.contentAttributeSet?.contentDescription = value.description

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

    AsyncFunction("clearActivities") { (ids: [String], promise: Promise) in

      ids.forEach { id in
        self.revokeActivity(id: id)
      }

      CSSearchableIndex.default().deleteSearchableItems(withIdentifiers: ids, completionHandler: { error in
        if (error != nil) {
          promise.reject(error as! Exception)
        } else {
          promise.resolve()
        }
      })
    }

    AsyncFunction("suspendActivity") { (id: String) in
      let activity = self.activities.first(where: { $0.persistentIdentifier == id })
      activity?.resignCurrent()
    }

    AsyncFunction("revokeActivity") { (id: String) in
      self.revokeActivity(id: id)
    }
  }

  @discardableResult
  func revokeActivity(id: String) -> NSUserActivity? {
    let activity = self.activities.first(where: { $0.persistentIdentifier == id })
    activity?.invalidate()
    if let activity = activity {
      self.activities.remove(activity)
    }
    return activity
  }
}
