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
      <Stack.Screen name="ParticipantHome" component={ParticipantTabs} />
      <Stack.Screen name="SponsorHome" component={SponsorTabs} />
      <Stack.Screen name="AdminHome" component={AdminStack} />

      {/* Extras */}
      <Stack.Screen
        name="DetalleCupon"
        component={DetalleCupon}
        options={{ headerShown: true, title: 'Detalle del Cupón' }}
      />
    </Stack.Navigator>
  );
}
