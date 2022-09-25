import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import React, { useMemo, useCallback } from "react";
import { useRoutesContext } from "./context";
import { getLinkingConfig } from "./getLinkingConfig";
import SplashModule from "./splash";

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
        console.log('linking', linking);
        const onReady = useCallback(() => {
            props.onReady?.();
            SplashModule?.hideAsync();
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

export function RootContainer({ documentTitle, fallback, initialState, onStateChange, onUnhandledAction, theme }: Omit<NavigationContainerProps, 'independent' | 'onReady' | 'ref' | 'children' | 'linking'>) {
    const [, setProps] = useNavigationContainerContext();

    React.useEffect(() => {
        setProps({ documentTitle, fallback, initialState, onStateChange, onUnhandledAction, theme });
    }, [documentTitle, fallback, initialState, onStateChange, onUnhandledAction, theme]);

    return null;
}