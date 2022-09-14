import Ionicons from '@expo/vector-icons/Ionicons'

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
export function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    focused?: boolean;
    color: string;
}) {

    let resolvedName = props.name;
    if (props.focused && resolvedName.endsWith('-outline')) {
        resolvedName = props.name.replace(/\-outline$/, "")
    }

    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} name={resolvedName} />;
}