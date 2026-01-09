import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
  StatusBar,
  Platform,
  TextInput,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminAccionesScreen({ navigation }) {
  const [acciones, setAcciones] = useState([]);
  const [filteredAcciones, setFilteredAcciones] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadAcciones = async () => {
    try {
      const response = await fetch('http://192.168.2.205:3000/api/acciones');
      const data = await response.json();
      setAcciones(data);
      setFilteredAcciones(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar las acciones');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAcciones();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAcciones();
    setRefreshing(false);
  };

  const buscarAcciones = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredAcciones(acciones);
    } else {
      const resultado = acciones.filter((item) =>
        item.titulo.toLowerCase().includes(text.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAcciones(resultado);
    }
  };

  const eliminarAccion = (id) => {
    Alert.alert(
      'Eliminar Acción',
      '¿Estás seguro que quieres eliminar esta acción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`http://192.168.2.205:3000/api/acciones/${id}`, {
                method: 'DELETE'
              });
              loadAcciones();
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'No se pudo eliminar la acción');
            }
          }
        }
      ]
    );
  };

  const editarAccion = (accion) => navigation.navigate('EditarAccion', { accion });
  const crearAccion = () => navigation.navigate('CrearAccion');

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ✅ Barra de búsqueda arriba del botón */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar acción..."
          placeholderTextColor="#9aa09f"
          value={search}
          onChangeText={buscarAcciones}
        />
      </View>

      {/* ✅ Botón Crear */}
      <View style={styles.botonContainer}>
        <TouchableOpacity style={styles.boton} onPress={crearAccion}>
          <Text style={styles.botonTexto}>Crear Nueva Acción</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={styles.container}
        data={filteredAcciones}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ccff34"
            colors={['#ccff34']}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay acciones coincidentes</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.accion}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text>{item.descripcion}</Text>
            <View style={styles.botones}>
              <TouchableOpacity style={styles.editarBoton} onPress={() => editarAccion(item)}>
                <Text style={styles.botonTextoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.eliminarBoton} onPress={() => eliminarAccion(item._id)}>
                <Text style={styles.botonTextoEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
  container: { padding: 30, paddingBottom: 100 },

  botonContainer: { paddingHorizontal: 30, marginBottom: 10, marginTop: 10 },
  boton: {
    backgroundColor: '#ccff34',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  botonTexto: { color: '#000000ff', fontSize: 18, fontWeight: 'bold' },

  // ✅ Barra de búsqueda estilo Cupones
  searchBox: {
    paddingHorizontal: 20,
    paddingBottom: 15,
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

  accion: {
    backgroundColor: '#ccff34',
    padding: 25,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000' },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  editarBoton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  eliminarBoton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  botonTextoEditar: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14
  },
  botonTextoEliminar: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 14
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold'
  },
});
