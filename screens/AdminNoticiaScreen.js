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

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function AdminNoticiaScreen({ navigation }) {
  const [noticias, setNoticias] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  const loadNoticias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/noticias`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNoticias(data);
      setFiltered(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar las noticias');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNoticias();
    }, [])
  );

  const eliminarNoticia = (id) => {
    Alert.alert(
      'Eliminar Noticia',
      '¿Deseas eliminar esta noticia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(
                `${API_URL}/api/noticias/${id}`,
                { method: 'DELETE' }
              );
              if (!res.ok) throw new Error();
              loadNoticias();
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'No se pudo eliminar la noticia');
            }
          },
        },
      ]
    );
  };

  const editarNoticia = (noticia) => {
    navigation.navigate('EditarNoticia', { noticia });
  };

  const crearNoticia = () => navigation.navigate('CrearNoticia');

  // 🔎 BUSCADOR
  const buscar = (text) => {
    setSearch(text);
    const filtro = noticias.filter(n =>
      `${n.titulo} ${n.descripcion}`
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFiltered(filtro);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <View style={styles.row}>

        {/* IMAGEN */}
        {item.imagen ? (
          <Image source={{ uri: item.imagen }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>SV</Text>
          </View>
        )}

        {/* INFO */}
        <View style={styles.info}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.descripcion} numberOfLines={2}>
            {item.descripcion}
          </Text>
        </View>

      </View>

      {/* BOTONES */}
      <View style={styles.botones}>
        <TouchableOpacity
          style={styles.editarBoton}
          onPress={() => editarNoticia(item)}
        >
          <Text style={styles.botonTextoEditar}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.eliminarBoton}
          onPress={() => eliminarNoticia(item._id)}
        >
          <Text style={styles.botonTextoEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* BUSCADOR */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar noticia por título o descripción..."
          placeholderTextColor="#9aa09f"
          value={search}
          onChangeText={buscar}
        />
      </View>

      {/* BOTÓN CREAR */}
      <View style={styles.botonContainer}>
        <TouchableOpacity style={styles.boton} onPress={crearNoticia}>
          <Text style={styles.botonTexto}>Crear Nueva Noticia</Text>
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
    backgroundColor: '#000',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + 10
        : 0,
  },

  container: {
    padding: 20,
    paddingBottom: 100,
  },

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
    color: '#000',
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
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  botonTextoEditar: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },

  botonTextoEliminar: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 14,
  },

});