import React, { useEffect, useState, useCallback } from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function AccionesScreen({ route }) {
  const { user } = route.params;
  const [acciones, setAcciones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar acciones desde la API
  const loadAcciones = async () => {
    try {
      const response = await fetch('http://192.168.2.205:3000/api/acciones');
      if (!response.ok) throw new Error('Error al cargar las acciones');
      const data = await response.json();
      setAcciones(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar las acciones');
    }
  };

  // Recarga cada vez que la pantalla se enfoque
  useFocusEffect(
    useCallback(() => {
      loadAcciones();
    }, [])
  );

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAcciones();
    setRefreshing(false);
  };

  // Función al tocar acción
  const seleccionarAccion = (id) => {
    console.log('Acción seleccionada:', id);
    // Aquí puedes ejecutar lo que quieras al seleccionar la acción
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.accion}
      onPress={() => seleccionarAccion(item._id)}
      activeOpacity={0.7}
    >
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.descripcion}> {item.descripcion}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.container}
        data={acciones}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000ff' },
  container: { padding: 20, paddingBottom: 80 },
  accion: {
    backgroundColor: '#ccff34',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  titulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#000000ff' },
  descripcion: {
    color: '#000000ff',
  },
});
