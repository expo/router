import ExpoModulesCore
import CoreSpotlight
import MobileCoreServices
// https://developer.apple.com/documentation/foundation/nsuseractivity/3552239-shortcutavailability
import Intents

struct MetadataOptions: Record {
  @Field
  var activityType: String?
  @Field
  var eligibleForSearch: Bool = true
  @Field
  var title: String?
  @Field
  var webpageURL: String?
  @Field
  var keywords: [String]?
}

public class ExpoHeadModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoHead')` in JavaScript.
    Name("ExpoHead")

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("createActivity") { (value: MetadataOptions) in
    // TODO: https://gist.github.com/alexruperez/ea81aa3e371f7d0d7ea5e594d7e9ad08
        let activity = NSUserActivity(activityType: value.activityType)
        activity.eligibleForHandoff = true
        activity.eligibleForPublicIndexing = true
        activity.eligibleForSearch = value.eligibleForSearch
        activity.webpageURL = value.webpageURL
      // activity.userInfo = [self.userActivityType.userInfoKey: self.userActivityUniqueIdentifier]
      // activity.keywords = UserActivityType.keywords
      // activity.contentAttributeSet = attributeSet
        activity.needsSave = true
        activity.becomeCurrent()

        // TODO: Fallback on using app icon as thumbnail image.

    }
    AsyncFunction("suspendActivity") { (id: String) in
        // let activity = NSUserActivity(activityType: value.activityType)
      
      // id
        activity.resignCurrent()

    }
    AsyncFunction("revokeActivity") { (id: String) in
        // let activity = NSUserActivity(activityType: value.activityType)
      
      // id
        activity.invalidate()

    }
  }
}
