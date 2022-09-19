import { View, Text } from 'react-native';

import { Exception } from 'expo-router';

export const ErrorBoundary = Exception

// Learn more: TODO
export default function App({ foobar }) {

  // throw new Error('ded')

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 36 }}>Entry file {foobar} 👋</Text>
    </View>
  );
}