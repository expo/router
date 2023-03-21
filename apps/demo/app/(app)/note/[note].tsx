import { Stack, useRouter, useSearchParams } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import { useNotes } from "../../../context/notes";
import { Button } from "../../../etc/button";

export default function Note() {
  const { note } = useSearchParams();
  const data = useNotes();
  const router = useRouter();

  const selected = data.notes?.find((item) => item.id === note);

  if (!selected) {
    return (
      <>
        <Stack.Screen options={{ title: "Not Found!" }} />
        <View style={styles.container}>
          <View style={styles.main}>
            <Text style={{ fontSize: 24 }}>
              Cannot find note for ID: {note}
            </Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: selected.id }} />
      <View style={styles.container}>
        <View style={styles.main}>
          <Item title="Note">{selected.text}</Item>
          <Item title="Created">{selected.date}</Item>
          <Item title="Priority">
            {["Low", "Medium", "High"][selected.priority ?? 0]}
          </Item>

          <Button
            style={{ marginTop: 16 }}
            onPress={() => {
              data.deleteNote(selected.id);
              router.back();
            }}
            buttonStyle={{ backgroundColor: "crimson" }}
          >
            Delete
          </Button>
        </View>
      </View>
    </>
  );
}

function Item({ title, children }) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={{ fontSize: 16 }}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 36,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
});
