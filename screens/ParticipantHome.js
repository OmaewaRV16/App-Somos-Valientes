import React from 'react';
import { View, Text } from 'react-native';

export default function ParticipantHome({ route }) {
  const { user } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido Participante {user.nombres}</Text>
    </View>
  );
}
