import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CuponeraScreen from '../screens/CuponeraScreen';
import AccionesScreen from '../screens/AccionesScreen';
import TarjetaVirtualScreen from '../screens/TarjetaVirtualScreen';
import SumateScreen from '../screens/SumateScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function ParticipantTabs() {
  const [user, setUser] = useState(null);

  // 🔐 Cargar usuario desde AsyncStorage (sesión persistente)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem('currentUser');
        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (e) {
        console.log('Error cargando usuario:', e);
      }
    };

    loadUser();
  }, []);

  // ⬅️ Manejo del botón atrás (Android)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  // 🛡️ Evita render hasta tener usuario (no spinner, no crash)
  if (!user) {
    return null;
  }

  return (
    <Tab.Navigator
      initialRouteName="Noticias"
      screenOptions={({ route }) => {
        let iconName;

        if (route.name === 'Cuponera') iconName = 'pricetag';
        else if (route.name === 'Actividades') iconName = 'flash';
        else if (route.name === 'Noticias') iconName = 'newspaper';
        else if (route.name === 'Sumate') iconName = 'add-circle';
        else if (route.name === 'Perfil') iconName = 'person';

        return {
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#ccff34',
          tabBarStyle: {
            backgroundColor: '#000000ff',
            borderTopWidth: 0,
            elevation: 0,
          },
        };
      }}
    >
      <Tab.Screen
        name="Cuponera"
        component={CuponeraScreen}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Actividades"
        component={AccionesScreen}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Noticias"
        component={TarjetaVirtualScreen}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Sumate"
        component={SumateScreen}
        initialParams={{ user }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        initialParams={{ user }}
      />
    </Tab.Navigator>
  );
}
