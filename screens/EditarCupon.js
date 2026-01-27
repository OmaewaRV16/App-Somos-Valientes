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

// ✅ URL PRODUCCIÓN
const API_URL = 'https://app-somos-valientes-production.up.railway.app';

// 🔹 CATEGORÍAS DISPONIBLES
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
  const [codigo, setCodigo] = useState(cupon?.codigo || '');
  const [logo, setLogo] = useState(
    cupon?.logo || cupon?.logoUrl || cupon?.imagen || ''
  );
  const [categoria, setCategoria] = useState(cupon?.categoria || '');

  const guardarCambios = async () => {
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      !codigo.trim() ||
      !logo.trim() ||
      !categoria
    ) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        codigo: codigo.trim(),
        logo: logo.trim(),
        categoria, // 👈 IMPORTANTE
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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

        {/* NOMBRE */}
        <Text style={styles.label}>Nombre del negocio</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          placeholder="Ej. Pizza Valiente"
          placeholderTextColor="#999"
        />

        {/* DESCRIPCIÓN */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          style={[styles.input, { height: 90 }]}
          placeholder="Descripción del cupón"
          placeholderTextColor="#999"
          multiline
        />

        {/* CÓDIGO */}
        <Text style={styles.label}>Código</Text>
        <TextInput
          value={codigo}
          onChangeText={setCodigo}
          style={styles.input}
          placeholder="SV2025"
          placeholderTextColor="#999"
          autoCapitalize="characters"
        />

        {/* LOGO */}
        <Text style={styles.label}>URL del logo</Text>
        <TextInput
          value={logo}
          onChangeText={setLogo}
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="url"
        />

        {/* CATEGORÍA */}
        <Text style={styles.label}>Categoría</Text>
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

        {/* GUARDAR */}
        <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
          <Text style={styles.botonTexto}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* =======================
   ESTILOS
======================= */
const styles = StyleSheet.create({
  container: {
    padding: 20,
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

  /* LOGO */
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
    fontSize: 18,
    marginBottom: 8,
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

  /* CATEGORÍAS */
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
