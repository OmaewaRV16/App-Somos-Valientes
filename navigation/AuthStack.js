import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import VerificarScreen from '../screens/VerificarScreen';
import ParticipantTabs from './ParticipantTabs';
import SponsorTabs from './SponsorTabs';
import AdminStack from './AdminStack';
import DetalleCupon from '../screens/DetalleCupon';
import CuponesPorNegocio from '../screens/CuponesPorNegocio';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      {/* Entrada inmediata */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* Auth */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Registro' }}
      />
      <Stack.Screen
        name="VerificarScreen"
        component={VerificarScreen}
        options={{ headerShown: true, title: 'Verificación de Cuenta' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true, title: 'Iniciar Sesión' }}
      />

      {/* App */}
      <Stack.Screen
        name="ParticipantHome"
        component={ParticipantTabs}
        options={{
        headerShown: false,
        title: 'Regresar',                 // 👈 ESTO ES LA CLAVE
        headerBackTitleVisible: false,
        headerBackTitle: '',
      }}
      />

      <Stack.Screen name="SponsorHome" component={SponsorTabs} />
      <Stack.Screen name="AdminHome" component={AdminStack} />



      <Stack.Screen
        name="CuponesPorNegocio"
        component={CuponesPorNegocio}
        options={{
        title: 'Cupones',
        headerShown: true,
        headerStyle: {
        backgroundColor: '#ccff34',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
        fontWeight: 'bold',
        },
        }}
      />


    </Stack.Navigator>
  );
}
