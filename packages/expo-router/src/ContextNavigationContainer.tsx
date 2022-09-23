import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import React, { useMemo, useCallback } from "react";
import { useRoutesContext } from "./context";
import { getLinkingConfig } from "./getLinkingConfig";

type NavigationContainerProps = React.ComponentProps<
    typeof NavigationContainer
>;

function useLinkingConfig(): LinkingOptions<{}> {
    const routes = useRoutesContext();
    return useMemo(() => getLinkingConfig(routes), [routes]);
}

const NavigationContainerContext = React.createContext<[Partial<NavigationContainerProps>, (props: Partial<NavigationContainerProps>) => void]>([{}, function () { }]);

export function useNavigationContainerContext() {
    const context = React.useContext(NavigationContainerContext);
    if (!context) {
        throw new Error(
            "useNavigationContainerContext must be used within a NavigationContainerContext"
        );
    }
    return context;
}

/** react-navigation `NavigationContainer` with automatic `linking` prop generated from the routes context. */
export const ContextNavigationContainer = React.forwardRef(
    (props: NavigationContainerProps, ref: NavigationContainerProps["ref"]) => {
        const [state, setState] = React.useState<Partial<NavigationContainerProps>>({});

        const linking = useLinkingConfig();

        const onReady = useCallback(() => {
            props.onReady?.();
            try {
                const { hideAsync } =
                    require("expo-splash-screen") as typeof import("expo-splash-screen");
                // Automatically handle hiding the splash screen if expo-splash-screen is installed.
                hideAsync();
            } catch { }
        }, [props.onReady]);

        return (
            <NavigationContainerContext.Provider value={[
                {
                    ...props,
                    linking,
                    onReady,
                    ...state,
                },
                setState,
            ]}>
                <InternalContextNavigationContainer
                    ref={ref}
                />
            </NavigationContainerContext.Provider>
        );
    }
);

const InternalContextNavigationContainer = React.forwardRef(
    (props: {}, ref: NavigationContainerProps["ref"]) => {
        const [contextProps] = useNavigationContainerContext();
        return (
            // @ts-expect-error
            <NavigationContainer
                ref={ref}
                {...props}
                {...contextProps}
            />
        );
    }
);

export function RootContainer(props: Omit<NavigationContainerProps, 'children' | 'linking'>) {
    const [, setProps] = useNavigationContainerContext();

    React.useEffect(() => {
        setProps(props);
    }, [props]);

    return null;
}