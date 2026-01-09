import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminTabs from './AdminTabs';
import DetalleParticipante from '../screens/DetalleParticipante';
import DetalleCupon from '../screens/DetalleCupon';
import DetalleAccion from '../screens/DetalleAccion';
import { StackScreen } from 'react-native-screens';
import DetallePadrino from '../screens/DetallePadrino';
import CrearCupon from '../screens/CrearCupon';
import EditarCupon from '../screens/EditarCupon';
import CrearAccion from '../screens/CrearAccion';
import EditarAccion from '../screens/EditarAccion';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      {/* Tabs de Admin */}
      <Stack.Screen 
        name="AdminTabs" 
        component={AdminTabs} 
        options={{ headerShown: false }} 
      />
      {/* Detalles que se muestran desde cualquier pestaña */}
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
        options={{ title: 'Crear Cupon' }}
      />

      <Stack.Screen
        name="EditarCupon"
        component={EditarCupon}
        options={{ title: 'Editar Cupon' }}
      />

      <Stack.Screen
        name="CrearAccion"
        component={CrearAccion}
        options={{ title: 'Crear Accion' }}
      />

      <Stack.Screen
        name="EditarAccion"
        component={EditarAccion}
        options={{ title: 'Editar Accion' }}
      />
    </Stack.Navigator>
  );
}
