import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import AdminParticipantesScreen from '../screens/AdminParticipantesScreen';
import AdminPadrinosScreen from '../screens/AdminPadrinosScreen';
import AdminCuponesScreen from '../screens/AdminCuponesScreen';
import AdminAccionesScreen from '../screens/AdminAccionesScreen';
import AdminPerfilScreen from '../screens/AdminPerfilScreen';
import AdminComentariosScreen from '../screens/AdminComentariosScreen'; // nuevo

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
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
      switch(route.name){
        case 'Participantes': iconName='people'; break;
        case 'Padrinos': iconName='account-circle'; break;
        case 'Cupones': iconName='card-giftcard'; break;
        case 'Acciones': iconName='check-circle'; break;
        case 'Perfil': iconName='person'; break;
        case 'Comentarios': iconName='feedback'; break;
        default: iconName='circle';
      }
      return <MaterialIcons name={iconName} size={30} color={color} />;
    }
  })}
>

      <Tab.Screen name="Participantes" component={AdminParticipantesScreen} />
      <Tab.Screen name="Padrinos" component={AdminPadrinosScreen} />
      <Tab.Screen name="Cupones" component={AdminCuponesScreen} />
      <Tab.Screen name="Acciones" component={AdminAccionesScreen} />
      <Tab.Screen name="Comentarios" component={AdminComentariosScreen} />
      <Tab.Screen name="Perfil" component={AdminPerfilScreen} />
    </Tab.Navigator>
  );
}
