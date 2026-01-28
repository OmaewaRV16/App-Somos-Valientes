import React, { useState, useCallback } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function AccionesScreen({ route }) {
  const { user } = route.params;
  const [acciones, setAcciones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAcciones = async () => {
    try {
      const response = await fetch(`${API_URL}/api/acciones`);
      if (!response.ok) throw new Error();

      const data = await response.json();
      setAcciones(Array.isArray(data) ? data : []);
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

  const seleccionarAccion = (id) => {
    Alert.alert(
      'Información',
      'Próximamente esta sección tendrá más funciones.'
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => seleccionarAccion(item._id)}
    >
      {/* CONTENIDO */}
      <View style={styles.cardContent}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
      </View>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ccff34"
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay acciones disponibles por ahora.
            {'\n'}
            Pronto se agregarán nuevas iniciativas.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

/* =======================
   ESTILOS
======================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  container: {
    padding: 20,
    paddingBottom: 80,
  },

  /* CARD */
  card: {
    backgroundColor: '#ccff34',
    borderRadius: 18,
    marginBottom: 16,
    padding: 20,

    shadowColor: '#ccff34',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  cardContent: {
    width: '100%',
  },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  descripcion: {
    fontSize: 14,
    color: '#000000cc',
    lineHeight: 20,
  },

  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    lineHeight: 22,
  },
});
