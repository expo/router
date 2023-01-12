import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Text, Pressable } from "@bacons/react-views";
import { useNotes } from "../../context/notes";

export default function App() {
  const { notes } = useNotes();

  if (!notes) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Index />;
}

function Index() {
  return (
    <>
      <NotesList />
      <Footer />
    </>
  );
}

function useQueriedNotes() {
  const notes = useNotes();
  const { q } = useSearchParams();

  return useMemo(
    () =>
      notes.notes.filter((item) => {
        if (!q) {
          return true;
        }
        return item.text.toLowerCase().includes(q.toLowerCase());
      }),
    [q, notes.notes]
  );
}

function NotesList() {
  const notes = useQueriedNotes();

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 20,
      }}
      ListEmptyComponent={ListEmptyComponent}
      data={notes}
      renderItem={({ item }) => (
        <Link
          style={{ marginBottom: 20 }}
          key={item.id}
          href={{
            pathname: "/(app)/note/[note]",
            params: {
              note: item.id,
            },
          }}
          asChild
        >
          <Pressable>
            {({ hovered, pressed }) => (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <View
                  style={[
                    {
                      flex: 1,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      transitionDuration: "200ms",
                    },
                    hovered && { backgroundColor: "rgba(0,0,0,0.1)" },
                    pressed && { backgroundColor: "rgba(0,0,0,0.2)" },
                  ]}
                >
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        </Link>
      )}
    />
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 48 + bottom,
        paddingBottom: bottom,
        padding: 8,
        alignItems: "flex-start",
        paddingHorizontal: 24,
        backgroundColor: "white",
        borderTopColor: "#ccc",
        borderTopWidth: StyleSheet.hairlineWidth,
      }}
    >
      <Link href="/compose" asChild>
        <Pressable>
          {({ hovered, pressed }) => (
            <View
              style={[
                {
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                },
                hovered && { backgroundColor: "rgba(0,0,0,0.1)" },
                pressed && { backgroundColor: "rgba(0,0,0,0.2)" },
              ]}
            >
              <FontAwesome
                style={{ marginRight: 8 }}
                name="plus-circle"
                size={32}
                color="black"
              />
              <Text
                style={{ color: "black", fontSize: 16, fontWeight: "bold" }}
              >
                Press me
              </Text>
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

function ListEmptyComponent() {
  const { q } = useSearchParams();

  const message = React.useMemo(() => {
    return q != null ? "No items found: " + q : "Create an item to get started";
  }, [q]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 16, textAlign: "center" }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  tasksWrapper: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},
});
