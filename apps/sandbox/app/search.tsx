import { useRouter, useSearchParams } from "expo-router";
import Head from "expo-router/head";
import React, { useEffect } from "react";
import { AppState, Platform, StyleSheet, TextInput, View } from "react-native";

function useAppState() {
  const [state, setState] = React.useState({
    appState: Platform.OS === "web" ? "active" : "inactive",
  });

  React.useEffect(() => {
    if (Platform.OS === "web") {
      document.addEventListener("visibilitychange", () => {
        setState((s) => ({
          ...s,
          appState:
            document.visibilityState === "visible" ? "active" : "inactive",
        }));
      });
    } else {
      const listener = (state: any) => {
        setState((s) => ({
          ...s,
          appState: state,
        }));
      };
      const ref = AppState.addEventListener("change", listener);
      return () => ref?.remove();
    }
  }, []);

  return state;
}

export default function Page() {
  const { appState } = useAppState();
  const params = useSearchParams<{ q?: string }>();

  const router = useRouter();
  const [search, setSearch] = React.useState(params.q);

  useEffect(() => {
    // alert(params.q);
    if (params.q && params.q !== search) {
      setSearch(params.q);
    }
  }, [appState]);

  return (
    <View style={styles.container}>
      <Head>
        <title>Other | Expo Router</title>
      </Head>
      <View style={styles.main}>
        <SearchBox
          onChange={(value) => {
            setSearch(value);
            router.setParams({ q: value });
          }}
          value={search ?? params.q}
        />
      </View>
    </View>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: any }) {
  return (
    <View
      style={{
        backgroundColor: "#F2F2F2",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#A0A0A0"
        placeholder="Explore..."
        style={{
          borderRadius: 12,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },

          fontSize: 24,
          textAlign: "center",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 3,

          color: "#000",
          margin: 12,
          padding: 16,
          ...Platform.select({
            web: {
              outline: "none",
            },
          }),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
