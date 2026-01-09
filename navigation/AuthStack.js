import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
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

function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('http://192.168.2.205:3000/api/currentUser');
        const data = await response.json();

        if (data.user) {
          const user = data.user;
          if (user.rol === 'participante') {
            navigation.reset({ index: 0, routes: [{ name: 'ParticipantHome', params: { user } }] });
          } else if (user.rol === 'padrino') {
            navigation.reset({ index: 0, routes: [{ name: 'SponsorHome', params: { user } }] });
          } else if (user.rol === 'admin') {
            navigation.reset({ index: 0, routes: [{ name: 'AdminHome', params: { user } }] });
          } else {
            Alert.alert('Error', 'Rol de usuario no reconocido');
            navigation.replace('Welcome');
          }
        } else {
          navigation.replace('Welcome');
        }
      } catch (error) {
        console.log('Error al consultar API:', error);
        navigation.replace('Welcome');
      }
    };
    checkUser();
  }, []);

  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <ActivityIndicator size="large" color="#ccff34" />
  </View>;
}

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
      <Stack.Screen name="VerificarScreen" component={VerificarScreen} options={{ title: 'Verificación de Cuenta' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="ParticipantHome" component={ParticipantTabs} options={{ headerShown: false }} />
      <Stack.Screen name="SponsorHome" component={SponsorTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AdminHome" component={AdminStack} options={{ headerShown: false }} />
      <Stack.Screen name="DetalleCupon" component={DetalleCupon} options={{ title: 'Detalle del Cupón' }} />
    </Stack.Navigator>
  );
}
