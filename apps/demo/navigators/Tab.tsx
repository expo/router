import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { convertDynamicRouteToReactNavigation, Screen, useNavigationChildren, useRoutes } from 'expo-router';


const UpstreamNavigator = createBottomTabNavigator();

export const BuilderContext = React.createContext<any>(null);
export const TabContext = React.createContext<any>(null);

import { BottomTabBar, BottomTabBarProps, BottomTabView } from '@react-navigation/bottom-tabs'
import BottomTabItem from '@react-navigation/bottom-tabs/src/views/BottomTabItem'
import TabBarIcon from '@react-navigation/bottom-tabs/src/views/TabBarIcon'

const dev = process.env.NODE_ENV !== 'production'

export function Navigator({ ctx, children, ...props }) {
    // const [tabBarItems, setTabBarItems] = React.useState<any[]>([]);

    const tabBarChild = React.Children.toArray(children).find((child) => {
        // console.log('child:', child, child.type === Navigator.TabBar)
        return child.type === Navigator.TabBar
    });
    const tabBarItems = !tabBarChild ? null : React.Children.toArray(tabBarChild.props.children).filter((child) => {
        // console.log('child:', child, child.type === Navigator.TabBar.Item)
        return child.type === Navigator.TabBar.Item
    }).map(child => {
        const props = {
            to: child.props?.to,
        }

        const labels = React.Children.toArray(child.props.children).filter((child) => {
            return child.type === Navigator.TabBar.Item.Label
        })
        if (dev && labels.length > 1) {
            throw new Error(`TabBar.Item can only have one Label child`)
        }

        const icons = React.Children.toArray(child.props.children).filter((child) => {
            return child.type === Navigator.TabBar.Item.Icon
        })
        if (dev && icons.length > 1) {
            throw new Error(`TabBar.Item can only have one Icon child`)
        }

        if (labels.length) {
            props.labelStyle = labels[0].props?.style
            props.label = labels[0].props.children
        }
        if (icons.length) {
            props.iconStyle = icons[0].props?.style
            props.icon = icons[0].props.children
        }

        return props;
    });
    console.log('props:', tabBarItems)

    const routesAtPath = useRoutes();
    const screens = routesAtPath
        .map((value) => {
            const componentApi = tabBarItems.find((item) => item.to === value.route);

            console.log('value.route:', value.route, componentApi)
            return (
                <Screen
                    options={(props) => {
                        const staticOptions = typeof value.extras?.getNavOptions === 'function' ? value.extras.getNavOptions(props) : value.extras.getNavOptions;
                        return {
                            ...staticOptions,
                            title: componentApi?.label ?? staticOptions?.title,
                        }
                    }}
                    name={convertDynamicRouteToReactNavigation(value.route)}
                    key={value.route}
                    component={value.component}
                />
            )
        });

    return (
        <BuilderContext.Provider value={{ tabBarItems }}>
            <Upstream {...props} tabBarItems={tabBarItems} tabBarChild={tabBarChild} screens={screens} />
        </BuilderContext.Provider>
    );
}

function Upstream({ screens, tabBarItems, tabBarChild, ...props }) {
    // const ctx = React.useContext(BuilderContext);
    return (
        <UpstreamNavigator.Navigator  {...props} tabBar={(props: BottomTabBarProps) => {
            const { state, descriptors, navigation } = props;
            const { routes } = state;
            // const { tabBarItems } = React.useContext(BuilderContext);
            console.log('state:', tabBarItems, routes)

            const filteredRoutes = tabBarItems.map(value => {
                return routes.find(route => route.name === value.to)
            })

            return (<BottomTabBar {...props} state={{
                ...state,
                routes: filteredRoutes,
            }} />)
        }} children={screens} screenOptions={{
            tabBarStyle: tabBarChild?.props?.style,
            ...props.screenOptions,
        }} />
    )
}

Navigator.TabBar = function TabBar(props) {
    return props.children
}
Navigator.TabBar.Item = function Item(props) {
    return props.children
}
Navigator.TabBar.Item.Label = function ItemLabel(props) {
    return props.children
}
Navigator.TabBar.Item.Icon = function ItemIcon(props) {
    return props.children
}
Navigator.TabBar.Item.Badge = function ItemBadge(props) {
    return props.children
}


/**
 * Requirements:
 * - Add navigator `screenOptions`
 * - Add tab bar component with `style` prop
 * 
 * - Tab bar item component with link, order indicates position
 * - Tab bar label component with style (`tabBarLabelStyle`) and text -- absence of label indicates `tabBarShowLabel` for item.
 * - Tab bar icon component with style (`tabBarIconStyle`) and icon (`tabBarIcon`) -- props `{ focused: boolean, color: string, size: number }`
 * 
 * <Navigator>
 *   <Navigator.Content>
 * 
 *   <TabBar>
 *      <TabBar.Item to="/home">
 *         <TabBar.Label>Home</TabBarLabel>
 *        <TabBar.Icon />
 *     </TabBar.Item>
 *      <TabBar.Item to="/baconbrix">
 *         {({ focused }) => <>
 *           <TabBar.Label>Me</TabBarLabel>
 *            <TabBar.Icon icon={focused ? a : b} />
 *            </>}
 *     </TabBar.Item>
 *   </TabBar>
 * </Navigator>
 */