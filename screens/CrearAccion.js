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
const API_URL = "https://app-somos-valientes-production.up.railway.app";

export default function CrearAccion({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const guardar = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/acciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!res.ok) throw new Error();

      Alert.alert(
        'Éxito',
        'Acción creada correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      console.log(e);
      Alert.alert(
        'Error',
        'No se pudo guardar la acción. Intenta más tarde.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Nueva Acción</Text>

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
        style={[styles.input, { height: 100 }]}
        placeholder="Descripción de la acción"
        placeholderTextColor="#999"
        multiline
      />

      <TouchableOpacity style={styles.boton} onPress={guardar}>
        <Text style={styles.botonTexto}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff6f00',
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  boton: {
    backgroundColor: '#ff6f00',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
});
