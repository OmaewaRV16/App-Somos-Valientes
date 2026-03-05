import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import VerificarScreen from '../screens/VerificarScreen';

import ParticipantTabs from './ParticipantTabs';
import SponsorTabs from './SponsorTabs';
import AdminStack from './AdminStack';

import CuponesPorNegocio from '../screens/CuponesPorNegocio';
import DetalleCupon from '../screens/DetalleCupon';

// 🔥 NUEVAS PANTALLAS
import SerAportanteScreen from '../screens/SerAportanteScreen';
import DifusionScreen from '../screens/DifusionScreen';
import EnviarOpinionScreen from '../screens/EnviarOpinionScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      {/* =====================
          ENTRADA
      ====================== */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* =====================
          AUTH
      ====================== */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: 'Registro',
        }}
      />

      <Stack.Screen
        name="VerificarScreen"
        component={VerificarScreen}
        options={{
          headerShown: true,
          title: 'Verificación de Cuenta',
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: 'Iniciar Sesión',
        }}
      />

      {/* =====================
          APP PRINCIPAL
      ====================== */}
      <Stack.Screen
        name="ParticipantHome"
        component={ParticipantTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SponsorHome"
        component={SponsorTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AdminHome"
        component={AdminStack}
        options={{
          headerShown: false,
        }}
      />

      {/* =====================
          CUPONES
      ====================== */}
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

      <Stack.Screen
        name="DetalleCupon"
        component={DetalleCupon}
        options={{
          title: 'Detalle',
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

      {/* =====================
          NUEVAS SCREENS SUMATE
      ====================== */}

      <Stack.Screen
        name="SerAportanteScreen"
        component={SerAportanteScreen}
        options={{
          title: 'Ser Aportante',
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

      <Stack.Screen
        name="DifusionScreen"
        component={DifusionScreen}
        options={{
          title: 'Apoyar Difusión',
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

      <Stack.Screen
        name="EnviarOpinionScreen"
        component={EnviarOpinionScreen}
        options={{
          title: 'Tu Opinión',
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