import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { SunEditor } from 'react-native-suneditor';

export default function App() {
  return (
    <View style={styles.container}>
      <SunEditor defaultValue="<p>test</p>" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
