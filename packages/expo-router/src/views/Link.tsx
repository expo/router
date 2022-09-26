// Fork of @react-navigation/native Link.tsx
import { Text, TextProps } from '@bacons/react-views';
import { Slot } from '@radix-ui/react-slot';
import { useLinkProps } from '@react-navigation/native';
import * as React from 'react';
import { GestureResponderEvent, Platform } from 'react-native';

import type { NavigationAction } from '@react-navigation/core';
import type { To } from '@react-navigation/native/src/useLinkTo';

type Props<ParamList extends ReactNavigation.RootParamList> = {
    /** Add a property which is familiar to  */
    href?: string | { pathname?: string; query?: Record<string, any> };

    /** Forward props to child component. Useful for custom buttons. */
    asChild?: boolean;


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


const parseHrefProps = (href: { pathname?: string; query?: Record<string, any> } | string) => {
    if (typeof href === 'string') {
        return href ?? '';
    }
    const path = href.pathname ?? '';
    if (!href?.query) {
        return path
    }
    const { pathname, query } = createQualifiedPathname(path, { ...href.query });
    return pathname + (Object.keys(query).length ? `?${createQuery(query)}` : '')
}

function createQualifiedPathname(pathname: string, query: Record<string, any>) {
    for (const [key, value = ''] of Object.entries(query)) {
        const dynamicKey = `[${key}]`;
        const deepDynamicKey = `[...${key}]`;
        if (pathname.includes(dynamicKey)) {
            pathname = pathname.replace(dynamicKey, Array.isArray(value) ? value.join('/') : value)
        } else if (pathname.includes(deepDynamicKey)) {
            pathname = pathname.replace(deepDynamicKey, Array.isArray(value) ? value.join('/') : value)
        } else {
            continue;
        }

        delete query[key]
    }
    return { pathname, query }
}

function createQuery(query: Record<string, any>) {
    return Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join('&');
}

function useResolvedHref<ParamList extends ReactNavigation.RootParamList>({ href, to }: Pick<Props<ParamList>, 'href' | "to">) {
    // TODO: Auto use router's client-side event.
    return React.useMemo(() => {
        if (href) {
            return parseHrefProps(href);
        }

        if (to == null) {
            throw new Error(
                `You must specify either 'href' or 'to' prop in a <Link />.`
            );
        }
        if (typeof to === 'string' && !to.startsWith('/')) {
            // TODO: Auto delegate out external links
            return '/'
        }
        return to;
    }, [href, to]);
}


function BaseLink<ParamList extends ReactNavigation.RootParamList>({
    to,
    href,
    action,
    asChild,
    ...rest
}: Props<ParamList>, ref: React.ForwardedRef<Text>) {
    // TODO: Auto use router's client-side event.
    const resolvedTo = useResolvedHref({ href, to });

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
