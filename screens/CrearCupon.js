import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function CrearCupon({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');

  const guardar = async () => {
    if (!nombre || !descripcion || !codigo) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch('http://192.168.2.205:3000/api/cupones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, codigo }),
      });
      if (!res.ok) throw new Error('Error al crear cupón');
      Alert.alert('Éxito', 'Cupón creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'No se pudo guardar el cupón');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Nuevo Cupón</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput value={nombre} onChangeText={setNombre} style={styles.input} placeholder="Nombre del cupón" placeholderTextColor="#999" />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, { height: 80 }]}
        placeholder="Descripción del cupón"
        placeholderTextColor="#999"
        multiline
      />

      <Text style={styles.label}>Código</Text>
      <TextInput value={codigo} onChangeText={setCodigo} style={styles.input} placeholder="Código del cupón" placeholderTextColor="#999" />

      <TouchableOpacity style={styles.boton} onPress={guardar}>
        <Text style={styles.botonTexto}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#000000ff', textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  boton: { backgroundColor: '#ccff34', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  botonTexto: { color: '#000000ff', fontSize: 18, fontWeight: 'bold' },
});
