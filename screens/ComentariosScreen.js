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
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ URL PRODUCCIÓN
const API_URL = "https://app-somos-valientes-production.up.railway.app/api/comentarios";

export default function ComentariosScreen({ route }) {
  const { user } = route.params;
  const [texto, setTexto] = useState('');

  const enviarComentario = async () => {
    if (!texto.trim()) {
      Alert.alert('Error', 'Por favor escribe un comentario.');
      return;
    }

    const nuevo = {
      usuario: user.celular, // enviamos el celular
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
      Alert.alert('Gracias', 'Tu comentario ha sido enviado.');
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Ocurrió un problema al enviar tu comentario. Intenta más tarde.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>
            Envía tu opinión o sugerencia
          </Text>

          <TextInput
            placeholder="Escribe aquí..."
            placeholderTextColor="#ccff34"
            style={styles.input}
            multiline
            numberOfLines={5}
            value={texto}
            onChangeText={setTexto}
          />

          <TouchableOpacity
            style={styles.boton}
            onPress={enviarComentario}
          >
            <Text style={styles.botonTexto}>Enviar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff'
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#ccff34'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccff34',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#ccff34'
  },
  boton: {
    backgroundColor: '#ccff34',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#000000ff',
    fontWeight: 'bold',
  },
});
