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
import CrearNoticiaScreen from '../screens/CrearNoticiaScreen';
import EditarNoticiaScreen from '../screens/EditarNoticiaScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
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
    <Stack.Navigator>

      {/* Tabs principales */}
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />

      {/* Detalles */}
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

      {/* Cupones */}
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

      {/* Acciones */}
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

      {/* Noticias */}
      <Stack.Screen
        name="AdminNoticia"
        component={AdminNoticiaScreen}
        options={{ title: 'Administrar Noticias' }}
      />
      <Stack.Screen
        name="CrearNoticia"
        component={CrearNoticiaScreen}
        options={{ title: 'Crear Noticia' }}
      />
      <Stack.Screen
        name="EditarNoticia"
        component={EditarNoticiaScreen}
        options={{ title: 'Editar Noticia' }}
      />

    </Stack.Navigator>
  );
}