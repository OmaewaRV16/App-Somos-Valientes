import React from 'react';
import { View, Text } from 'react-native';

export default function SponsorHome({ route }) {
  const { user } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido Padrino {user.nombres}</Text>
    </View>
  );
}
