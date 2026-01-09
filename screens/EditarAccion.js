import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function EditarAccion({ route, navigation }) {
  const { accion } = route.params || {};

  const [titulo, setTitulo] = useState(accion?.titulo || '');
  const [descripcion, setDescripcion] = useState(accion?.descripcion || '');

  const guardarCambios = async () => {
    if (!titulo || !descripcion) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`http://192.168.2.205:3000/api/acciones/${accion._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!res.ok) throw new Error('Error al actualizar la acción');

      Alert.alert('Éxito', 'Acción actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo actualizar la acción');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar Acción</Text>

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

      <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
        <Text style={styles.botonTexto}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#ff6f00', textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  boton: { backgroundColor: '#ff6f00', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  botonTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
