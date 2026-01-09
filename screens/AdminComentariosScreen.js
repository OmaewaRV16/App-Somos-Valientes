import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  RefreshControl,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminComentariosScreen() {
  const [comentarios, setComentarios] = useState([]);
  const [filteredComentarios, setFilteredComentarios] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = 'http://192.168.2.205:3000/api/comentarios';

  const loadComentarios = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar comentarios');
      const data = await response.json();
      setComentarios(data);
      setFilteredComentarios(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar los comentarios');
    }
  };

  useEffect(() => {
    loadComentarios();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadComentarios();
    setRefreshing(false);
  };

  // ✅ Filtrar comentarios por número de celular
  const buscarComentarios = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredComentarios(comentarios);
    } else {
      const resultados = comentarios.filter((item) =>
        item.usuario.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredComentarios(resultados);
    }
  };

  const eliminarComentario = async (id) => {
    Alert.alert('Eliminar Comentario', '¿Deseas eliminar este comentario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar comentario');
            loadComentarios();
          } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo eliminar el comentario');
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ✅ Barra de búsqueda */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por número de celular..."
          placeholderTextColor="#9aa09f"
          value={search}
          onChangeText={buscarComentarios}
        />
      </View>

      <FlatList
        contentContainerStyle={styles.container}
        data={filteredComentarios}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ccff34" colors={['#ccff34']} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay comentarios coincidentes</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.usuario}>{item.usuario}</Text>
            <Text style={styles.fecha}>{new Date(item.fecha).toLocaleString()}</Text>
            <Text style={styles.mensaje}>{item.mensaje}</Text>
            <TouchableOpacity style={styles.eliminarBoton} onPress={() => eliminarComentario(item._id)}>
              <Text style={styles.botonTexto}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },

  // ✅ Barra de búsqueda estilo uniforme
  searchBox: {
    paddingHorizontal: 20,
    paddingBottom: 10,
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
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#ccff34',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  usuario: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  fecha: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  mensaje: {
    fontSize: 14,
    marginBottom: 10,
  },
  eliminarBoton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
