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

export default function EditarNoticiaScreen({ route, navigation }) {
  const { noticia } = route.params || {};

  const [titulo, setTitulo] = useState(noticia?.titulo || '');
  const [descripcion, setDescripcion] = useState(noticia?.descripcion || '');
  const [imagen, setImagen] = useState(noticia?.imagen || '');
  const [link, setLink] = useState(noticia?.link || '');

  const guardarCambios = async () => {
    if (!titulo.trim() || !descripcion.trim() || !imagen.trim() || !link.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/noticias/${noticia._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            imagen: imagen.trim(),
            link: link.trim(),
          }),
        }
      );

      if (!res.ok) throw new Error();

      Alert.alert('Éxito', 'Noticia actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo actualizar la noticia');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.tituloScreen}>Editar Noticia</Text>

        <View style={styles.imagenContainer}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.imagenPreview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Sin Imagen</Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          style={[styles.input, { height: 100 }]}
          multiline
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>URL Imagen *</Text>
        <TextInput
          value={imagen}
          onChangeText={setImagen}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="url"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Link de la noticia *</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="url"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
          <Text style={styles.botonTexto}>Guardar Cambios</Text>
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
  tituloScreen: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ccff34',
    textAlign: 'center',
  },
  imagenContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagenPreview: {
    width: 180,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  placeholder: {
    width: 180,
    height: 120,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    color: '#ccff34',
    fontWeight: 'bold',
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