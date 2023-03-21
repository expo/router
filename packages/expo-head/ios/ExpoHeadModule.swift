import ExpoModulesCore
import CoreSpotlight
import MobileCoreServices
// https://developer.apple.com/documentation/foundation/nsuseractivity/3552239-shortcutavailability
//import Intents

struct ShortcutOptions: Record {

  @Field
  var id: String!
  @Field
  var title: String!
  @Field
  var subtitle: String?
  @Field
  var info: [String: NSSecureCoding]?
  @Field
  var icon: String?
}


struct MetadataOptions: Record {
  @Field
  var activityType: String!
  @Field
  var id: String!
  @Field
  var isEligibleForHandoff: Bool = true
  @Field
  var isEligibleForPrediction: Bool = true
  @Field
  var isEligibleForPublicIndexing: Bool = false
  @Field
  var isEligibleForSearch: Bool = true
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

func stringToUIApplicationShortcutIcon(_ str: String?) -> UIApplicationShortcutIcon? {
  guard let stringType = str else {
    return nil
  }
  if let type = stringToUIApplicationShortcutIconType(stringType) {
    return UIApplicationShortcutIcon(type: type)
  }
  return nil

}

func stringToUIApplicationShortcutIconType(_ str: String) -> UIApplicationShortcutIcon.IconType? {
  switch str {
  case "compose":
    return .compose
  case "play":
    return .play
  case "pause":
    return .pause
  case "add":
    return .add
  case "location":
    return .location
  case "search":
    return .search
  case "share":
    return .share
  case "prohibit":
    return .prohibit
  case "contact":
    return .contact
  case "home":
    return .home
  case "markLocation":
    return .markLocation
  case "favorite":
    return .favorite
  case "love":
    return .love
  case "cloud":
    return .cloud
  case "invitation":
    return .invitation
  case "confirmation":
    return .confirmation
  case "mail":
    return .mail
  case "message":
    return .message
  case "date":
    return .date
  case "time":
    return .time
  case "capturePhoto":
    return .capturePhoto
  case "captureVideo":
    return .captureVideo
  case "task":
    return .task
  case "taskCompleted":
    return .taskCompleted
  case "alarm":
    return .alarm
  case "bookmark":
    return .bookmark
  case "shuffle":
    return .shuffle
  case "audio":
    return .audio
  case "update":
    return .update
  default:
    return nil
  }
}


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
          "isEligibleForHandoff": activity.isEligibleForHandoff,
          "isEligibleForPrediction": activity.isEligibleForPrediction,
          "isEligibleForPublicIndexing": activity.isEligibleForPublicIndexing,
          "isEligibleForSearch": activity.isEligibleForSearch,
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

    AsyncFunction("defineShortcuts") { (items: [ShortcutOptions]) in

      var shortcuts: [UIApplicationShortcutItem] = []
      for value in items {
        shortcuts.append(UIApplicationShortcutItem(
          type: value.id,
          localizedTitle: value.title,
          localizedSubtitle: value.subtitle,
          icon: stringToUIApplicationShortcutIcon(value.icon),
          userInfo: value.info
        ))
      }

      DispatchQueue.main.async {
        UIApplication.shared.shortcutItems = shortcuts
      }
    }


    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("createActivity") { (value: MetadataOptions) in
      let att = CSSearchableItemAttributeSet(itemContentType: kUTTypeText as String)
      let activity = self.activities.first(where: { $0.persistentIdentifier == value.id }) ?? NSUserActivity(activityType: value.activityType)

    // TODO: https://gist.github.com/alexruperez/ea81aa3e371f7d0d7ea5e594d7e9ad08
//         let activity = NSUserActivity(activityType: value.activityType)
      activity.persistentIdentifier = value.id
      activity.isEligibleForHandoff = value.isEligibleForHandoff
      activity.isEligibleForPrediction = value.isEligibleForPrediction;
      activity.isEligibleForPublicIndexing = value.isEligibleForPublicIndexing
      activity.isEligibleForSearch = value.isEligibleForSearch
      activity.title = value.title

      if let keywords = value.keywords {
        activity.keywords = Set(keywords)
      }

      activity.userInfo = value.userInfo
      // Required for handling incoming requests
      activity.requiredUserInfoKeys = ["href"]
      activity.expirationDate = value.expirationDate

      if (value.webpageURL != nil) {
        // If you’re using all three APIs, it works well to use the URL of the relevant webpage as the value for uniqueIdentifier, relatedUniqueIdentifier, and webpageURL.
        // https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/CombiningAPIs.html#//apple_ref/doc/uid/TP40016308-CH10-SW1
        activity.webpageURL = value.webpageURL
        // activity.uniqueIdentifier = value.webpageURL?.absoluteString
//        att.relatedUniqueIdentifier = value.webpageURL?.absoluteString
      }

      att.title = value.title
      att.metadataModificationDate = value.dateModified
      // Make all indexed routes deletable
      att.domainIdentifier = INDEXED_ROUTE

      if let localUrl = value.imageUrl?.path {
        att.thumbnailURL = value.imageUrl
        // let img = UIImage(contentsOfFile: localUrl)
        // if let data = img?.pngData() {
        //   activity.contentAttributeSet?.thumbnailData = data
        // }
      }
      if let darkImageUrl = value.darkImageUrl {
        att.darkThumbnailURL = darkImageUrl
      }

      if let description = value.description {
        att.contentDescription = description
      }

      activity.contentAttributeSet = att;

      self.activities.insert(activity)

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
