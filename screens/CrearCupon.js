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

const CATEGORIAS = [
  'Restaurantes',
  'Salud',
  'Servicios',
  'Educación',
  'Tiendas',
  'Belleza',
  'Entretenimiento',
  'Deportes',
  'Otros',
];

export default function CrearCupon({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [logo, setLogo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // 🔥 REDES DEFINITIVAS
  const [facebookSergio, setFacebookSergio] = useState('');
  const [instagramSergio, setInstagramSergio] = useState('');
  const [facebookNegocio, setFacebookNegocio] = useState('');

  const guardar = async () => {
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      !codigo.trim() ||
      !categoria
    ) {
      Alert.alert('Error', 'Completa los campos obligatorios');
      return;
    }

    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        codigo: codigo.trim(),
        categoria,
        logo: logo.trim() || "",
        whatsapp: whatsapp.trim() || "",

        // 🔥 REDES
        facebookSergio: facebookSergio.trim() || "",
        instagramSergio: instagramSergio.trim() || "",
        facebookNegocio: facebookNegocio.trim() || "",
      };

      const res = await fetch(`${API_URL}/api/cupones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      Alert.alert('Éxito', 'Cupón creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'No se pudo guardar el cupón');
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
        <Text style={styles.titulo}>Crear Cupón</Text>

        <View style={styles.logoContainer}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>SV</Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Nombre del negocio *</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          placeholder="Ej. Pizza Valiente"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          style={[styles.input, { height: 90 }]}
          placeholder="Primera línea como título y luego la descripción"
          placeholderTextColor="#999"
          multiline
        />

        <Text style={styles.label}>Código *</Text>
        <TextInput
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
          placeholder="SV2025"
          placeholderTextColor="#999"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>URL del logo (opcional)</Text>
        <TextInput
          value={logo}
          onChangeText={setLogo}
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={styles.label}>WhatsApp del negocio (opcional)</Text>
        <TextInput
          value={whatsapp}
          onChangeText={setWhatsapp}
          style={styles.input}
          placeholder="9991234567"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        {/* 🔵 REDES */}
        <Text style={styles.label}>Facebook de Sergio (opcional)</Text>
        <TextInput
          value={facebookSergio}
          onChangeText={setFacebookSergio}
          style={styles.input}
          placeholder="https://facebook.com/..."
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Instagram de Sergio (opcional)</Text>
        <TextInput
          value={instagramSergio}
          onChangeText={setInstagramSergio}
          style={styles.input}
          placeholder="https://instagram.com/..."
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Facebook del Negocio (opcional)</Text>
        <TextInput
          value={facebookNegocio}
          onChangeText={setFacebookNegocio}
          style={styles.input}
          placeholder="https://facebook.com/..."
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Categoría *</Text>
        <View style={styles.categoriasContainer}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoriaBtn,
                categoria === cat && styles.categoriaActiva,
              ]}
              onPress={() => setCategoria(cat)}
            >
              <Text
                style={[
                  styles.categoriaTexto,
                  categoria === cat && styles.categoriaTextoActivo,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.boton} onPress={guardar}>
          <Text style={styles.botonTexto}>Guardar Cupón</Text>
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
    width: 160,
    height: 160,
    borderRadius: 80,
    borderColor: '#ccff34',
    borderWidth: 5,
    backgroundColor: '#fff',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoriaBtn: {
    borderWidth: 1,
    borderColor: '#ccff34',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  categoriaActiva: {
    backgroundColor: '#ccff34',
  },
  categoriaTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  },
  categoriaTextoActivo: {
    color: '#000',
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