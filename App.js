import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { Provider as PaperProvider } from 'react-native-paper';
import { crearAdmin } from './utils/crearAdmin'; // Importa la función

export default function App() {
  React.useEffect(() => {
    crearAdmin(); // Crea el admin automáticamente al iniciar la app
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </PaperProvider>
  );
}
