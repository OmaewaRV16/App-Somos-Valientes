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
  const { user } = route.params || {};
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.indicator} />
        <Text style={styles.titulo}>{item.titulo}</Text>
      </View>

      {/* 👇 Ahora muestra TODO el texto */}
      <Text style={styles.descripcion}>
        {item.descripcion}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Actividades para ayudar a nuestra comunidad.
        </Text>
      </View>

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
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#ccff3490',
    marginTop: 6,
  },

  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    borderBottomWidth: 3,
    borderBottomColor: '#ccff34',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

/*   indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 10,
  }, */

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccff34',
    flex: 1,
  },

  descripcion: {
    fontSize: 15,
    color: '#e7ff9f',
    lineHeight: 24,
  },

  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
  },

});