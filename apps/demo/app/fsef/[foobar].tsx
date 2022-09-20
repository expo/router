import { View, Text } from 'react-native';

export { ErrorBoundary } from 'expo-router';
import { ContextContainer } from 'expo-router';
import { DarkTheme } from '@react-navigation/native';
import { useEffect } from 'react';

// Learn more: TODO
export default function App({ foobar }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ContextContainer theme={DarkTheme} />
      <Text style={{ fontSize: 36 }}>Entry file {foobar} 👋</Text>
    </View>
  );
}