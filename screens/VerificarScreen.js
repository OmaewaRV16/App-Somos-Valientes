import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function VerificarScreen({ route, navigation }) {
  const { celular, codigoBackend } = route.params;
  const [codigo, setCodigo] = useState('');

  const handleVerificar = async () => {
    if (!codigo || codigo.length < 6) {
      Alert.alert('Error', 'Ingresa el código de verificación');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/verificar`, { // ✅ CORREGIDO
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ celular, codigo }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Código incorrecto');
        return;
      }

      Alert.alert('Éxito', 'Cuenta verificada correctamente', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: Platform.OS === 'android' ? 120 : 80 },
          ]}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >

          {/* Header */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Verificación de Cuenta</Text>
            <Text style={styles.subtitle}>Ingresa el código recibido</Text>
          </View>

          {/* Card */}
          <View style={styles.cardContainer}>
            <TextInput
              label="Código"
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              textColor="#000"
              placeholder="Ingresa tu código"
            />

            {/* Mostrar código temporal solo para pruebas */}
            {codigoBackend && (
              <Text style={styles.simulatedCode}>
                Código temporal: {codigoBackend}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleVerificar}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Verificar
            </Button>

            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={styles.backText}>
                Volver a iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>

        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
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
    marginBottom: 20,
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
  cardContainer: {
    marginHorizontal: 20,
    backgroundColor: '#ccff34',
    borderRadius: 20,
    padding: 25,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  simulatedCode: {
    fontSize: 16,
    marginBottom: 15,
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
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
  backText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#000',
    fontWeight: 'bold',
  },
});