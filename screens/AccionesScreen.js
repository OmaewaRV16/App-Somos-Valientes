import React, { useState, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function AccionesScreen({ route }) {
  const { user } = route.params || {};
  const [accionesEnCurso, setAccionesEnCurso] = useState([]);
  const [accionesFinalizadas, setAccionesFinalizadas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAcciones = async () => {
    try {
      const response = await fetch(`${API_URL}/api/acciones`);
      if (!response.ok) throw new Error();
      const data = await response.json();

      const enCurso = data.filter(a => a.estado === 'en_curso');
      const finalizadas = data.filter(a => a.estado === 'finalizada');

      setAccionesEnCurso(enCurso);
      setAccionesFinalizadas(finalizadas);
    } catch (error) {
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

  const renderCard = (item, esFinalizada = false) => (
    <View
      key={item._id}   // 🔥 FIX DEL ERROR
      style={[
        styles.card,
        esFinalizada && styles.cardFinalizada
      ]}
    >
      <Text
        style={[
          styles.titulo,
          esFinalizada && styles.tituloFinalizado
        ]}
      >
        {item.titulo}
      </Text>

      <Text
        style={[
          styles.descripcion,
          esFinalizada && styles.descripcionFinalizada
        ]}
      >
        {item.descripcion}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ccff34"
          />
        }
      >

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Actividades Sociedad Valiente
          </Text>
        </View>

        {/* 🟢 EN CURSO */}
        {accionesEnCurso.length > 0 && (
          <>
            <Text style={styles.seccionTitulo}>
              EN CURSO
            </Text>
            {accionesEnCurso.map(item =>
              renderCard(item, false)
            )}
          </>
        )}

        {/* 🔴 FINALIZADAS */}
        {accionesFinalizadas.length > 0 && (
          <>
            <Text style={[styles.seccionTitulo, styles.finalizadasTitulo]}>
              FINALIZADOS
            </Text>
            {accionesFinalizadas.map(item =>
              renderCard(item, true)
            )}
          </>
        )}

      </ScrollView>
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
    paddingTop: 30,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
  },

  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccff34',
    marginTop: 25,
    marginBottom: 10,
  },

  finalizadasTitulo: {
    color: '#ff4d4d',
  },

  card: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },

  cardFinalizada: {
    opacity: 0.6,
  },

  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 6,
  },

  tituloFinalizado: {
    textDecorationLine: 'line-through',
  },

  descripcion: {
    fontSize: 15,
    color: '#e7ff9f',
    lineHeight: 22,
  },

  descripcionFinalizada: {
    color: '#aaa',
  },

});