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

let hideAsync: () => Promise<boolean> | undefined;
try {
    hideAsync =
        (require("expo-splash-screen") as typeof import("expo-splash-screen")).hideAsync;
    // Automatically handle hiding the splash screen if expo-splash-screen is installed.
} catch { }


/** react-navigation `NavigationContainer` with automatic `linking` prop generated from the routes context. */
export const ContextNavigationContainer = React.forwardRef(
    (props: NavigationContainerProps, ref: NavigationContainerProps["ref"]) => {
        const [state, setState] = React.useState<Partial<NavigationContainerProps>>({});

        const linking = useLinkingConfig();
        console.log('linking', linking);
        const onReady = useCallback(() => {
            props.onReady?.();
            if (hideAsync) {
                hideAsync();
            }
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
            // @ts-expect-error: children are required
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