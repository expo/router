## React Navigation limitations

- Screen options are static and not updated with Fast Refresh.
- ~~React Navigation does not support nested screens with the same name.~~ Just need to suppress the warning.
- React Navigation `Link` does not support full static paths. i.e. `/blog/post/1` is not supported.
- Web support in React Navigation is not as mature as `react-router`, but it does support server-side rendering and history API.
- Custom navigators are very difficult to implement. Making some basic web example won't really be possible.
- Navigation views (tab bar, navigation bar, drawer) use generated views based on the router, when the router is automatically generated the user has no control over certain parts of the views. The two most notable issues are ordering the screens, and setting the initial screen. If the user were to create a tab bar for an automated router, they could decide that the order in which the tabs appear and could also choose to omit certain routes from showing up in the tab bar.
