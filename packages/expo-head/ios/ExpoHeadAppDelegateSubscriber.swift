// Copyright 2018-present 650 Industries. All rights reserved.

import ExpoModulesCore

public class ExpoHeadAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    launchedActivity = userActivity

    if let wellKnownHref = userActivity.userInfo?["href"] as? String {
      NotificationCenter.default.post(
        name: NSNotification.Name(rawValue: "RCTOpenURLNotification"),
        object: self,
        userInfo: ["url": wellKnownHref]);
    }

    return false
  }
}
