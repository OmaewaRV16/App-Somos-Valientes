import React, { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import CuponeraScreen from '../screens/CuponeraScreen';
import AccionesScreen from '../screens/AccionesScreen';
import TarjetaVirtualScreen from '../screens/TarjetaVirtualScreen';
import ComentariosScreen from '../screens/ComentariosScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function ParticipantTabs({ route }) {
  const { user } = route.params;

  // Manejo del botón atrás
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp(); // cierra la app
        return true; // evita navegación hacia atrás
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove(); // remover correctamente
    }, [])
  );

  return (
    <Tab.Navigator
      initialRouteName="Cuponera"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Cuponera') iconName = 'pricetag';
          else if (route.name === 'Acciones') iconName = 'flash';
          else if (route.name === 'TarjetaVirtual') iconName = 'card';
          else if (route.name === 'Comentarios') iconName = 'chatbubbles';
          else if (route.name === 'Perfil') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#ccff34',
      tabBarStyle: {
        backgroundColor: '#000000ff',
        borderTopWidth: 0,
        elevation: 0,
    },
      })}
    >
      <Tab.Screen name="Cuponera" component={CuponeraScreen} initialParams={{ user }} />
      <Tab.Screen name="Acciones" component={AccionesScreen} initialParams={{ user }} />
      <Tab.Screen name="TarjetaVirtual" component={TarjetaVirtualScreen} initialParams={{ user }} />
      <Tab.Screen name="Comentarios" component={ComentariosScreen} initialParams={{ user }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} initialParams={{ user }} />
    </Tab.Navigator>
  );
}
