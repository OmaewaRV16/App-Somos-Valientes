import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from 'react-native';

// ✅ URL PRODUCCIÓN
const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function EditarCupon({ route, navigation }) {
  const { cupon } = route.params || {};

  const [nombre, setNombre] = useState(cupon?.nombre || '');
  const [descripcion, setDescripcion] = useState(cupon?.descripcion || '');
  const [codigo, setCodigo] = useState(cupon?.codigo || '');
  const [logo, setLogo] = useState(
    cupon?.logo || cupon?.logoUrl || cupon?.imagen || ''
  );

  const guardarCambios = async () => {
    if (!nombre.trim() || !descripcion.trim() || !codigo.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        codigo: codigo.trim(),
        logo: logo.trim(),
        logoUrl: logo.trim(),
        imagen: logo.trim(),
      };

      const res = await fetch(
        `${API_URL}/api/cupones/${cupon._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Error al actualizar cupón');

      Alert.alert('Éxito', 'Cupón actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo actualizar el cupón');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar Cupón</Text>

      {/* PREVIEW LOGO */}
      <View style={styles.logoContainer}>
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>SV</Text>
          </View>
        )}
      </View>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        placeholder="Nombre del cupón"
        placeholderTextColor="#999"
      />

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
      <TextInput
        value={codigo}
        onChangeText={setCodigo}
        style={styles.input}
        placeholder="Código del cupón"
        placeholderTextColor="#999"
        autoCapitalize="characters"
      />

      <Text style={styles.label}>URL del logo</Text>
      <TextInput
        value={logo}
        onChangeText={setLogo}
        style={styles.input}
        placeholder="https://..."
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
        <Text style={styles.botonTexto}>Guardar Cambios</Text>
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
    marginBottom: 20,
    color: '#ccff34',
    textAlign: 'center',
  },

  /* LOGO */
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: '#ccff34',
    borderWidth: 5,
    backgroundColor: '#fff',
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 18,
  },

  label: {
    fontSize: 20,
    marginBottom: 5,
    color: '#ccff34',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  boton: {
    backgroundColor: '#ccff34',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  botonTexto: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
