import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { crearAdmin } from './utils/crearAdmin';

export default function App() {
  React.useEffect(() => {
    crearAdmin().catch(() => {});
  }, []);

  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}
