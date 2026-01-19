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

export default function CrearCupon({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [logo, setLogo] = useState('');

  const guardar = async () => {
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      !codigo.trim() ||
      !logo.trim()
    ) {
      Alert.alert('Error', 'Completa todos los campos, incluido el logo');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/cupones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          codigo,
          logo
        }),
      });

      if (!res.ok) throw new Error();

      Alert.alert(
        'Éxito',
        'Cupón creado correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      console.log(e);
      Alert.alert(
        'Error',
        'No se pudo guardar el cupón. Intenta más tarde.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Nuevo Cupón</Text>

      <TextInput
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        placeholder="Nombre del cupón"
        placeholderTextColor="#999"
      />

      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, { height: 80 }]}
        placeholder="Descripción del cupón"
        placeholderTextColor="#999"
        multiline
      />

      <TextInput
        value={codigo}
        onChangeText={setCodigo}
        style={styles.input}
        placeholder="Código del cupón"
        placeholderTextColor="#999"
      />

      {/* ✅ LOGO DEL NEGOCIO */}
      <TextInput
        value={logo}
        onChangeText={setLogo}
        style={styles.input}
        placeholder="URL del logo del negocio"
        placeholderTextColor="#999"
        autoCapitalize="none"
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
    backgroundColor: '#000000',
    flexGrow: 1
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ccff34',
    textAlign: 'center'
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
    backgroundColor: '#ccff34',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3
  },
  botonTexto: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold'
  },
});
