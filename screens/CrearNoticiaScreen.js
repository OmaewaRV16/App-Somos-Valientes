import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function CrearNoticiaScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [link, setLink] = useState('');

  const guardar = async () => {
    if (!titulo.trim() || !descripcion.trim() || !imagen.trim() || !link.trim()) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    try {
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        imagen: imagen.trim(),
        link: link.trim(),
      };

      const res = await fetch(`${API_URL}/api/noticias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      Alert.alert('Éxito', 'Noticia creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'No se pudo guardar la noticia');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Crear Noticia</Text>

        <View style={styles.logoContainer}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>SV</Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
          placeholder="Título de la noticia"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          style={[styles.input, { height: 120 }]}
          placeholder="Contenido de la noticia..."
          placeholderTextColor="#999"
          multiline
        />

        <Text style={styles.label}>URL de la Imagen *</Text>
        <TextInput
          value={imagen}
          onChangeText={setImagen}
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Link externo *</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.boton} onPress={guardar}>
          <Text style={styles.botonTexto}>Guardar Noticia</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ccff34',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 120,
    borderRadius: 10,
    borderColor: '#ccff34',
    borderWidth: 3,
    backgroundColor: '#fff',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#ccff34',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 22,
  },
  label: {
    fontSize: 16,
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
  },
  boton: {
    backgroundColor: '#ccff34',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});