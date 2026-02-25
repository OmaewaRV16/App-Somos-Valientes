import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AdminParticipantesScreen from '../screens/AdminParticipantesScreen';
import AdminPadrinosScreen from '../screens/AdminPadrinosScreen';
import AdminCuponesScreen from '../screens/AdminCuponesScreen';
import AdminAccionesScreen from '../screens/AdminAccionesScreen';
import AdminPerfilScreen from '../screens/AdminPerfilScreen';
import AdminComentariosScreen from '../screens/AdminComentariosScreen';
import AdminNoticiaScreen from '../screens/AdminNoticiaScreen';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem('currentUser');
        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (e) {
        console.log('Error cargando usuario admin:', e);
      }
    };

    loadUser();
  }, []);

  if (!user) return null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#ccff34',
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Participantes':
              iconName = 'people';
              break;
            case 'Padrinos':
              iconName = 'account-circle';
              break;
            case 'Cupones':
              iconName = 'card-giftcard';
              break;
            case 'Acciones':
              iconName = 'check-circle';
              break;
            case 'Comentarios':
              iconName = 'feedback';
              break;
            case 'Noticias':
              iconName = 'article';
              break;
            case 'Perfil':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return <MaterialIcons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Participantes"
        component={AdminParticipantesScreen}
        initialParams={{ user }}
      />

      <Tab.Screen
        name="Padrinos"
        component={AdminPadrinosScreen}
        initialParams={{ user }}
      />

      <Tab.Screen
        name="Cupones"
        component={AdminCuponesScreen}
        initialParams={{ user }}
      />

      <Tab.Screen
        name="Acciones"
        component={AdminAccionesScreen}
        initialParams={{ user }}
      />

      <Tab.Screen
        name="Comentarios"
        component={AdminComentariosScreen}
        initialParams={{ user }}
      />

      {user?.rol === "admin" && (
        <Tab.Screen
          name="Noticias"
          component={AdminNoticiaScreen}
          initialParams={{ user }}
        />
      )}

      <Tab.Screen
        name="Perfil"
        component={AdminPerfilScreen}
        initialParams={{ user }}
      />
    </Tab.Navigator>
  );
}