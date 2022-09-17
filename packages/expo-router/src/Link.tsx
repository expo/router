// Fork of @react-navigation/native Link.tsx
import type { NavigationAction } from '@react-navigation/core';
import * as React from 'react';
import { GestureResponderEvent, Platform } from 'react-native';
import { Text, TextProps } from '@bacons/react-views'
import { useLinkProps, } from '@react-navigation/native';
import { Slot } from '@radix-ui/react-slot'
import type { To } from '@react-navigation/native/src/useLinkTo';

type Props<ParamList extends ReactNavigation.RootParamList> = {
    asChild?: boolean;
    href?: string;
    to?: To<ParamList>;
    action?: NavigationAction;
    target?: string;
    onPress?: (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
    ) => void;
} & (TextProps & { children: React.ReactNode });

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.href Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export const Link = React.forwardRef(BaseLink);

function BaseLink<ParamList extends ReactNavigation.RootParamList>({
    to,
    href,
    action,
    asChild,
    ...rest
}: Props<ParamList>, ref: React.ForwardedRef<Text>) {
    // TODO: Auto use router's client-side event.
    const resolvedTo = React.useMemo(() => {
        const resolved = href ? href : to;
        if (resolved == null) {
            throw new Error(
                `You must specify either 'href' or 'to' prop in a <Link />.`
            );
        }
        if (typeof resolved === 'string' && !resolved.startsWith('/')) {
            // TODO: Auto delegate out external links
            return '/'
        }
        return resolved;
    }, [href, to]);
    const props = useLinkProps<ParamList>({ to: resolvedTo, action });

    const onPress = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
    ) => {
        if ('onPress' in rest) {
            rest.onPress?.(e);
        }

        props.onPress(e);
    };

    return React.createElement(
        // @ts-expect-error: slot is not type-safe
        asChild ? Slot : Text,
        {
            ref,
            ...props,
            ...rest,
            ...Platform.select({
                web: { onClick: onPress } as any,
                default: { onPress },
            }),
        });
}
