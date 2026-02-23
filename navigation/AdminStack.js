import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AdminTabs from './AdminTabs';
import DetalleParticipante from '../screens/DetalleParticipante';
import DetalleCupon from '../screens/DetalleCupon';
import DetalleAccion from '../screens/DetalleAccion';
import DetallePadrino from '../screens/DetallePadrino';
import CrearCupon from '../screens/CrearCupon';
import EditarCupon from '../screens/EditarCupon';
import CrearAccion from '../screens/CrearAccion';
import EditarAccion from '../screens/EditarAccion';
import AdminNoticiaScreen from '../screens/AdminNoticiaScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
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
        console.log('Error cargando usuario admin:', e);
      }
    };

    loadUser();
  }, []);

  // 🛡️ Evita render hasta tener usuario (sin spinner, sin crash)
  if (!user) {
    return null;
  }

  return (
    <Stack.Navigator>
      {/* Tabs de Admin */}
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />

      {/* Detalles accesibles desde cualquier pestaña */}
      <Stack.Screen
        name="DetalleParticipante"
        component={DetalleParticipante}
        options={{ title: 'Detalle Participante' }}
      />
      <Stack.Screen
        name="DetalleCupon"
        component={DetalleCupon}
        options={{ title: 'Detalle Cupón' }}
      />
      <Stack.Screen
        name="DetalleAccion"
        component={DetalleAccion}
        options={{ title: 'Detalle Acción' }}
      />
      <Stack.Screen
        name="DetallePadrino"
        component={DetallePadrino}
        options={{ title: 'Detalle Padrino' }}
      />

      <Stack.Screen
        name="CrearCupon"
        component={CrearCupon}
        options={{ title: 'Crear Cupón' }}
      />
      <Stack.Screen
        name="EditarCupon"
        component={EditarCupon}
        options={{ title: 'Editar Cupón' }}
      />
      <Stack.Screen
        name="CrearAccion"
        component={CrearAccion}
        options={{ title: 'Crear Acción' }}
      />
      <Stack.Screen
        name="EditarAccion"
        component={EditarAccion}
        options={{ title: 'Editar Acción' }}
      />

      <Stack.Screen
        name="AdminNoticia"
        component={AdminNoticiaScreen}
        options={{ title: 'Administrar Noticias' }}
      />
    </Stack.Navigator>
  );
}
