import { Stack, useSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useNotes } from "../../../context/notes";

export default function Note() {
  const { note } = useSearchParams();
  const data = useNotes();

  const selected = data.notes?.find((item) => item.id === note);

  if (!selected) {
    return (
      <>
        <Stack.Screen options={{ title: "Not Found!" }} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Cannot find note for ID: {note}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: selected.id }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{selected.text}</Text>
      </View>
    </>
  );
}
