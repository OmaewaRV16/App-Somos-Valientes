import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminNoticiaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrar Noticias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#ccff34',
    fontSize: 22,
    fontWeight: 'bold',
  },
});