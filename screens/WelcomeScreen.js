import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // ⏱ 1) Tiempo mínimo visible del Welcome
    const timer = setTimeout(() => {
      if (isMounted) setEnabled(true);
    }, 1200); // 1.2 segundos (ideal)

    // 🔐 2) Revisar sesión guardada en background
    const checkSession = async () => {
      try {
        const data = await AsyncStorage.getItem('currentUser');
        if (!data) return;

        const user = JSON.parse(data);

        // Si hay usuario, entrar directo según rol
        if (user?.rol === 'participante') {
          navigation.reset({ index: 0, routes: [{ name: 'ParticipantHome' }] });
        } else if (user?.rol === 'padrino') {
          navigation.reset({ index: 0, routes: [{ name: 'SponsorHome' }] });
        } else if (user?.rol === 'admin') {
          navigation.reset({ index: 0, routes: [{ name: 'AdminHome' }] });
        }
      } catch (e) {
        // Si algo falla, se queda en Welcome sin romper nada
        console.log('Error leyendo sesión:', e);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Imagen superior */}
      <Image
        source={require('../assets/Logotipo_Negro-01.png')}
        style={styles.topImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>¿Quieres unirte a SV?</Text>

      <Button
        mode="contained"
        onPress={() => enabled && navigation.navigate('Register')}
        style={[styles.button, !enabled && styles.disabled]}
        labelStyle={styles.buttonLabel}
        disabled={!enabled}
      >
        ¡Unirme Ahora!
      </Button>

      <TouchableOpacity
        disabled={!enabled}
        onPress={() => enabled && navigation.navigate('Login')}
      >
        <Text style={[styles.link, !enabled && styles.disabled]}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccff34',
    padding: 20,
  },
  topImage: {
    width: 400,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#000000ff',
    paddingHorizontal: 30,
  },
  buttonLabel: {
    color: '#ccff34',
  },
  link: {
    color: '#0000008c',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  disabled: {
    opacity: 0.6,
  },
});
