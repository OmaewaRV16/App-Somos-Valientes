import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CuponeraScreen from '../screens/CuponeraScreen';
import AccionesScreen from '../screens/AccionesScreen';
import ApoyarScreen from '../screens/ApoyarScreen';
import SumateScreen from '../screens/SumateScreen';
import PerfilScreen from '../screens/PerfilScreen';
import TarjetaVirtualScreen from '../screens/TarjetaVirtualScreen';

const Tab = createBottomTabNavigator();

export default function SponsorTabs() {
  const [user, setUser] = useState(null);

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

  if (!user) return null;

  return (
    <Tab.Navigator
      initialRouteName="Cuponera"
      screenOptions={({ route }) => {
        let iconName;

        if (route.name === 'Cuponera') iconName = 'pricetag';
        else if (route.name === 'Actividades') iconName = 'flash';
        else if (route.name === 'Apoyar') iconName = 'card';
        else if (route.name === 'Noticias') iconName = 'newspaper';
        else if (route.name === 'Sumate') iconName = 'people';
        else if (route.name === 'Perfil') iconName = 'person';

        return {
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#ccff34',
          tabBarStyle: {
            backgroundColor: '#000',
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
        name="Apoyar"
        component={ApoyarScreen}
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