import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ URL PRODUCCIÓN (Railway)
const API_URL = "https://app-somos-valientes-production.up.railway.app";

export default function LoginScreen({ navigation }) {
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');

  const formatCelular = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 10);
    setCelular(numbers);
  };

  const handleLogin = async () => {
    if (!celular || !password) {
      Alert.alert('Error', 'Por favor ingresa número de celular y contraseña');
      return;
    }

    if (celular.length < 10) {
      Alert.alert('Error', 'El número celular debe tener 10 dígitos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ celular, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Número de celular o contraseña incorrectos');
        return;
      }

      await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
      const user = data.user;

      switch (user.rol) {
        case 'participante':
          navigation.reset({
            index: 0,
            routes: [{ name: 'ParticipantHome', params: { user } }],
          });
          break;

        case 'padrino':
          navigation.reset({
            index: 0,
            routes: [{ name: 'SponsorHome', params: { user } }],
          });
          break;

        case 'admin':
          navigation.reset({
            index: 0,
            routes: [{ name: 'AdminHome', params: { user } }],
          });
          break;

        default:
          Alert.alert('Error', 'Rol no reconocido');
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: Platform.OS === 'android' ? 120 : 80 },
      ]}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bienvenido a SV</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Número de celular"
          value={celular}
          onChangeText={formatCelular}
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
          outlineColor="#333"
          textColor="#000"
          placeholder="Ingresa tu número celular"
          placeholderTextColor="#999"
          left={<TextInput.Icon icon="phone" />}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          outlineColor="#333"
          textColor="#000"
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#999"
          left={<TextInput.Icon icon="lock" />}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Iniciar Sesión
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccff3495',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    marginHorizontal: 20,
    backgroundColor: '#ccff34',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  button: {
    marginTop: 5,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 15,
  },
  buttonLabel: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 15,
    color: '#333',
  },
  registerLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});
