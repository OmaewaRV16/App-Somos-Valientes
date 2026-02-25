import React, { useState, useCallback } from 'react';
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

const API_URL = "https://app-somos-valientes-production.up.railway.app";

export default function AdminAccionesScreen({ navigation }) {
  const [acciones, setAcciones] = useState([]);
  const [filteredAcciones, setFilteredAcciones] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadAcciones = async () => {
    try {
      const response = await fetch(`${API_URL}/api/acciones`);
      const data = await response.json();
      setAcciones(data);
      setFilteredAcciones(data);
    } catch {
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

  const cambiarEstado = async (accion) => {
    const nuevoEstado =
      accion.estado === 'finalizada'
        ? 'en_curso'
        : 'finalizada';

    try {
      await fetch(`${API_URL}/api/acciones/${accion._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      loadAcciones();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado');
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
              await fetch(`${API_URL}/api/acciones/${id}`, {
                method: 'DELETE',
              });
              loadAcciones();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar la acción');
            }
          },
        },
      ]
    );
  };

  const editarAccion = (accion) =>
    navigation.navigate('EditarAccion', { accion });

  const crearAccion = () =>
    navigation.navigate('CrearAccion');

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* 🔍 BUSCADOR */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar acción..."
          placeholderTextColor="#9aa09f"
          value={search}
          onChangeText={buscarAcciones}
        />
      </View>

      {/* ➕ BOTÓN CREAR */}
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
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay acciones coincidentes
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* 🔥 BADGE ESTADO */}
            <View style={[
              styles.badge,
              item.estado === 'finalizada'
                ? styles.finalizada
                : styles.enCurso
            ]}>
              <Text style={styles.badgeText}>
                {item.estado === 'finalizada'
                  ? 'FINALIZADA'
                  : 'EN CURSO'}
              </Text>
            </View>

            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>

            {/* BOTONES */}
            <View style={styles.botones}>

              <TouchableOpacity
                style={styles.estadoBtn}
                onPress={() => cambiarEstado(item)}
              >
                <Text style={styles.estadoTexto}>
                  Cambiar Estado
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editarBtn}
                onPress={() => editarAccion(item)}
              >
                <Text style={styles.editarTexto}>
                  Editar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.eliminarBtn}
                onPress={() => eliminarAccion(item._id)}
              >
                <Text style={styles.eliminarTexto}>
                  Eliminar
                </Text>
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

  /* BUSCADOR */
  searchBox: {
    paddingHorizontal: 20,
    paddingTop: 10,
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

  /* BOTÓN CREAR */
  botonContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
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
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  descripcion: {
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 8,
  },

  enCurso: {
    backgroundColor: '#000',
  },

  finalizada: {
    backgroundColor: '#ff4d4d',
  },

  badgeText: {
    color: '#ccff34',
    fontSize: 11,
    fontWeight: 'bold',
  },

  botones: {
    marginTop: 15,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },

  estadoBtn: {
    marginBottom: 8,
  },

  estadoTexto: {
    fontWeight: 'bold',
    color: '#000',
  },

  editarBtn: {
    marginBottom: 8,
  },

  editarTexto: {
    fontWeight: 'bold',
    color: '#000',
  },

  eliminarTexto: {
    fontWeight: 'bold',
    color: '#ff0000',
  },

  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold'
  },
});