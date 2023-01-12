import {
  Link,
  Stack,
  useNavigation,
  usePathname,
  useSearchParams,
} from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Task from "../../components/task";
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
  const notes = useNotes();
  const { q } = useSearchParams();
  const { bottom } = useSafeAreaInsets();

  const queriedNotes = useMemo(
    () =>
      notes.notes.filter((item) => {
        if (!q) {
          return true;
        }
        return item.text.toLowerCase().includes(q.toLowerCase());
      }),
    [q, notes.notes]
  );

  console.log("q", q, queriedNotes);

  const noResults = !queriedNotes.length && !!q.length;

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.tasksWrapper}>
            <View style={styles.items}>
              {queriedNotes.map((item) => (
                <Link
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
                    <Task text={item.text} />
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 48 + bottom,
            paddingBottom: bottom,
            padding: 8,
            paddingHorizontal: 24,

            backgroundColor: "white",
            borderTopColor: "#ccc",
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        >
          <Link href="/compose" asChild>
            <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
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
            </Pressable>
          </Link>
        </View>

        {/* Write a task */}
        {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder="Write a task"
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView> */}
      </View>
    </>
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
