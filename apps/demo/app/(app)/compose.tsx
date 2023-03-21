import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { useNotes } from "../../context/notes";
import { Button, ToggleButton } from "../../etc/button";

export default function Compose() {
  const { addNote } = useNotes();
  const textInput = React.useRef<TextInput>(null);
  const [task, setTask] = useState<string | undefined>();
  const [priority, setPriority] = useState(0);
  const { width } = useWindowDimensions();
  const router = useRouter();
  const handleAddTask = () => {
    addNote({ text: task, priority });
    router.back();
    setTask(null);
  };

  React.useEffect(() => {
    textInput.current?.focus();
  }, [textInput.current]);

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.main}>
          <TextInput
            ref={textInput}
            style={{
              height: 40,
              backgroundColor: "#D1D1D6",
              borderRadius: 8,
              paddingHorizontal: 16,
              marginBottom: 16,
              minWidth: width / 2,
            }}
            placeholderTextColor="#38434D"
            placeholder="Write a task"
            value={task}
            onChangeText={(text) => setTask(text)}
          />

          <View>
            <Text style={{ fontSize: 16, marginBottom: 16 }}>Priority</Text>
            <View style={{ flexDirection: "row" }}>
              {["Low", "Medium", "High"].map((label, index) => (
                <ToggleButton
                  key={index}
                  selected={index === priority}
                  onPress={() => setPriority(index)}
                >
                  {label}
                </ToggleButton>
              ))}
            </View>
          </View>
          <Button
            onPress={() => handleAddTask()}
            style={{ marginTop: 16 }}
            buttonStyle={{ backgroundColor: "#0033cc" }}
          >
            Save
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  tasksWrapper: {
    paddingTop: 80,
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
