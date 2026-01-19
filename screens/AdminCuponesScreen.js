import React, { useState, useCallback } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  StatusBar,
  Platform,
  TextInput,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

// ✅ URL PRODUCCIÓN (Railway)
const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function AdminCuponesScreen({ navigation }) {
  const [cupones, setCupones] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  const loadCupones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cupones`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCupones(data);
      setFiltered(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar los cupones');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCupones();
    }, [])
  );

  const eliminarCupon = (id) => {
    Alert.alert(
      'Eliminar Cupón',
      '¿Deseas eliminar este cupón?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(
                `${API_URL}/api/cupones/${id}`,
                { method: 'DELETE' }
              );
              if (!res.ok) throw new Error();
              loadCupones();
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'No se pudo eliminar el cupón');
            }
          },
        },
      ]
    );
  };

  const editarCupon = (cupon) => {
    navigation.navigate('EditarCupon', { cupon });
  };

  const crearCupon = () => navigation.navigate('CrearCupon');

  // 🔎 Buscar cupón
  const buscar = (text) => {
    setSearch(text);
    const filtro = cupones.filter(c =>
      `${c.nombre} ${c.codigo}`
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFiltered(filtro);
  };

  const renderItem = ({ item }) => {
    const logoUrl = item.logo || item.logoUrl || item.imagen;

    return (
      <View style={styles.card}>
        {/* FILA SUPERIOR */}
        <View style={styles.row}>
          {/* LOGO */}
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>SV</Text>
            </View>
          )}

          {/* INFO */}
          <View style={styles.info}>
            <Text style={styles.titulo}>{item.nombre}</Text>
            <Text style={styles.descripcion} numberOfLines={2}>
              {item.descripcion}
            </Text>
            <Text style={styles.codigo}>{item.codigo}</Text>
          </View>
        </View>

        {/* BOTONES */}
        <View style={styles.botones}>
          <TouchableOpacity
            style={styles.editarBoton}
            onPress={() => editarCupon(item)}
          >
            <Text style={styles.botonTextoEditar}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eliminarBoton}
            onPress={() => eliminarCupon(item._id)}
          >
            <Text style={styles.botonTextoElimar}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Barra de búsqueda */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cupón por nombre o código..."
          placeholderTextColor="#9aa09f"
          value={search}
          onChangeText={buscar}
        />
      </View>

      <View style={styles.botonContainer}>
        <TouchableOpacity style={styles.boton} onPress={crearCupon}>
          <Text style={styles.botonTexto}>Crear Nuevo Cupón</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 10
        : 0,
  },

  container: { padding: 20, paddingBottom: 100 },

  searchBox: {
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: '#000',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#ccff34',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#ccff34',
    marginBottom: 10,
  },

  botonContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 5,
  },

  boton: {
    backgroundColor: '#ccff34',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  botonTexto: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* CARD */
  card: {
    backgroundColor: '#ccff34',
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* LOGO */
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    marginRight: 15,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  /* INFO */
  info: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  descripcion: {
    fontSize: 14,
    color: '#0000008b',
    marginVertical: 4,
  },
  codigo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  /* BOTONES */
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  editarBoton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  eliminarBoton: {
    backgroundColor: '#000000ff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  botonTextoEditar: {
    color: '#000000ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botonTextoElimar: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
