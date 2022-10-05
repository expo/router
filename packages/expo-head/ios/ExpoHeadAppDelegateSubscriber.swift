// Copyright 2018-present 650 Industries. All rights reserved.

import ExpoModulesCore
import CoreSpotlight

/// Represents the Info.plist.
public struct InfoPlist
{
    public init(){}

    /// Returns the custom URL schemes registered by the app ('CFBundleURLSchemes' array).
    public static func bundleURLSchemes() -> [String]
    {
        guard let path = Bundle.main.path(forResource: "Info", ofType: "plist") else {
            log.error("Can’t find path to Info.plist in the main bundle.")
            return []
        }
        guard
            let infoDict = NSDictionary(contentsOfFile: path) as? [String: AnyObject],
            let anyDictionary = (infoDict["CFBundleURLTypes"] as? [[String: Any]])?.first,
            let urlSchemes = anyDictionary["CFBundleURLSchemes"] as? [String]
        else {
            log.error("Can’t find path to CFBundleURLSchemes in the Info.plist.")
            return []
        }
        return urlSchemes
    }
}

public class ExpoHeadAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    launchedActivity = userActivity

    if let wellKnownHref = userActivity.userInfo?["href"] as? String {
      NotificationCenter.default.post(
        name: NSNotification.Name(rawValue: "RCTOpenURLNotification"),
        object: self,
        userInfo: ["url": wellKnownHref]);
    }

    if (userActivity.activityType == CSQueryContinuationActionType) {
      if let query = userActivity.userInfo?[CSSearchQueryString] as? String {
        let schemes = InfoPlist.bundleURLSchemes()
        let encodedQuery = query.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed) ?? query
        // TODO: Allow user to define the scheme using structured data or something.
        let url = "\(schemes[0])://search?q=\(encodedQuery)&ref=opensearch"

        // https://github.com/search?q=
        NotificationCenter.default.post(
          name: NSNotification.Name(rawValue: "RCTOpenURLNotification"),
          object: self,
          userInfo: ["url": url]);
      }
    }

    return false
  }
}
