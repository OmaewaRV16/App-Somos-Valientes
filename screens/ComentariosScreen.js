import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ URL PRODUCCIÓN
const API_URL =
  'https://app-somos-valientes-production.up.railway.app/api/comentarios';

export default function ComentariosScreen({ route }) {
  const { user } = route.params;
  const [texto, setTexto] = useState('');

  const enviarComentario = async () => {
    if (!texto.trim()) {
      Alert.alert('Campo vacío', 'Por favor escribe tu mensaje antes de enviarlo.');
      return;
    }

    const nuevo = {
      usuario: user.celular,
      mensaje: texto,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo),
      });

      if (!response.ok) throw new Error();

      setTexto('');
      Alert.alert(
        'Gracias por tu opinión',
        'Tu mensaje nos ayuda a mejorar Sociedad Valiente.'
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Ocurrió un problema al enviar tu mensaje. Intenta más tarde.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* CONTENEDOR CENTRADO */}
          <View style={styles.contentWrapper}>

            {/* LOGO */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* TÍTULO */}
            <Text style={styles.titulo}>Tu opinión es importante</Text>

            {/* DESCRIPCIÓN */}
            <Text style={styles.descripcion}>
              En Sociedad Valiente creemos en construir comunidad escuchándonos.
              Tu experiencia, ideas y sugerencias nos ayudan a seguir mejorando
              este proyecto pensado para todas y todos.
            </Text>

            {/* CAJA DE TEXTO */}
            <View style={styles.textAreaContainer}>
              <TextInput
                placeholder="Escribe aquí tu mensaje con total confianza..."
                placeholderTextColor="#ccff34"
                style={styles.input}
                multiline
                value={texto}
                onChangeText={setTexto}
                textAlignVertical="top"
              />
            </View>

            {/* BOTÓN */}
            <TouchableOpacity
              style={styles.boton}
              onPress={enviarComentario}
            >
              <Text style={styles.botonTexto}>Enviar mensaje</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =======================
   ESTILOS
======================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  container: {
    flexGrow: 1,
    padding: 24,
  },

  contentWrapper: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },

  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#000',
    borderWidth: 4,
    borderColor: '#ccff34',
    shadowColor: '#ccff34',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 14,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#ccff34',
  },

  descripcion: {
    fontSize: 15,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  textAreaContainer: {
    borderWidth: 2,
    borderColor: '#ccff34',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#0d0d0d',
    marginBottom: 25,
  },

  input: {
    minHeight: 100,
    fontSize: 16,
    color: '#ccff34',
  },

  boton: {
    backgroundColor: '#ccff34',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
  },

  botonTexto: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
