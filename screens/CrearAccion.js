import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';

// ✅ URL PRODUCCIÓN
const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function CrearAccion({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const guardar = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
      };

      const res = await fetch(`${API_URL}/api/acciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      Alert.alert('Éxito', 'Acción creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'No se pudo guardar la acción');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Acción</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
        placeholder="Título de la acción"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, styles.textArea]}
        placeholder="Descripción de la acción"
        placeholderTextColor="#999"
        multiline
      />

      <TouchableOpacity style={styles.boton} onPress={guardar}>
        <Text style={styles.botonTexto}>Guardar Acción</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000000',
    flexGrow: 1,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#ccff34',
    textAlign: 'center',
  },

  label: {
    fontSize: 18,
    marginBottom: 6,
    color: '#ccff34',
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  boton: {
    backgroundColor: '#ccff34',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    elevation: 4,
  },

  botonTexto: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
