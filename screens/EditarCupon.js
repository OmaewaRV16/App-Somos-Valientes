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

export default function EditarCupon({ route, navigation }) {
  const { cupon } = route.params || {};

  const [nombre, setNombre] = useState(cupon?.nombre || '');
  const [descripcion, setDescripcion] = useState(cupon?.descripcion || '');
  const [descripcionNegocio, setDescripcionNegocio] = useState(cupon?.descripcionNegocio || '');
  const [codigo, setCodigo] = useState(cupon?.codigo || '');
  const [logo, setLogo] = useState(cupon?.logo || '');
  const [categoria, setCategoria] = useState(cupon?.categoria || '');
  const [whatsapp, setWhatsapp] = useState(cupon?.whatsapp || '');

  const [facebookSergio, setFacebookSergio] = useState(cupon?.facebookSergio || '');
  const [instagramSergio, setInstagramSergio] = useState(cupon?.instagramSergio || '');
  const [tiktokSergio, setTiktokSergio] = useState(cupon?.tiktokSergio || '');
  const [facebookNegocio, setFacebookNegocio] = useState(cupon?.facebookNegocio || '');

  const guardarCambios = async () => {
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
        descripcionNegocio: descripcionNegocio.trim() || "",
        codigo: codigo.trim(),
        categoria,
        logo: logo.trim() || "",
        whatsapp: whatsapp.trim() || "",

        facebookSergio: facebookSergio.trim() || "",
        instagramSergio: instagramSergio.trim() || "",
        tiktokSergio: tiktokSergio.trim() || "",
        facebookNegocio: facebookNegocio.trim() || "",
      };

      const res = await fetch(
        `${API_URL}/api/cupones/${cupon._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      Alert.alert('Éxito', 'Cupón actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo actualizar el cupón');
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
        <Text style={styles.titulo}>Editar Cupón</Text>

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
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descripción del negocio (opcional)</Text>
        <TextInput
          value={descripcionNegocio}
          onChangeText={setDescripcionNegocio}
          style={[styles.input, { height: 80 }]}
          multiline
          placeholder="Breve descripción del negocio..."
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descripción del cupón *</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          style={[styles.input, { height: 90 }]}
          multiline
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Código *</Text>
        <TextInput
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
          autoCapitalize="characters"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>URL del logo (opcional)</Text>
        <TextInput
          value={logo}
          onChangeText={setLogo}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="url"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>WhatsApp del negocio (opcional)</Text>
        <TextInput
          value={whatsapp}
          onChangeText={setWhatsapp}
          style={styles.input}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Facebook de Sergio (opcional)</Text>
        <TextInput
          value={facebookSergio}
          onChangeText={setFacebookSergio}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Instagram de Sergio (opcional)</Text>
        <TextInput
          value={instagramSergio}
          onChangeText={setInstagramSergio}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>TikTok de Sergio (opcional)</Text>
        <TextInput
          value={tiktokSergio}
          onChangeText={setTiktokSergio}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Facebook del Negocio (opcional)</Text>
        <TextInput
          value={facebookNegocio}
          onChangeText={setFacebookNegocio}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#999"
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