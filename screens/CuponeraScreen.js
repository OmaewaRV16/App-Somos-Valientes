import React, { useState, useEffect, useCallback } from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

export default function CuponeraScreen({ route, navigation }) {
  const { user } = route.params;
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const fetchCupones = useCallback(async () => {
    try {
      const resp = await fetch("https://app-somos-valientes-production.up.railway.app/api/cupones");
      const data = await resp.json();

      if (!resp.ok) {
        Alert.alert("Error", data.message || "No se pudieron cargar los cupones");
        return;
      }

      setCupones(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudieron cargar los cupones.\nRevisa que el backend esté corriendo y accesible desde este dispositivo.");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCupones().finally(() => setLoading(false));
  }, [isFocused]);

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCupones();
    setRefreshing(false);
  };

  // Actualiza el cupón canjeado inmediatamente
  const handleOnCanjear = (cuponActualizado) => {
    setCupones(prev =>
      prev.map(c => 
        c._id === cuponActualizado._id 
          ? { ...c, usado: { ...c.usado, [user.celular]: true } } 
          : c
      )
    );
  };

  const handleVerDetalle = (cupon) => {
    navigation.navigate('DetalleCupon', {
      cupon,
      user,
      onCanjear: handleOnCanjear,
    });
  };

  const renderItem = ({ item }) => {
    const usado = item.usado && item.usado[user.celular];

    return (
      <TouchableOpacity
        style={[styles.cupon, usado && styles.canjeado]}
        onPress={() => handleVerDetalle(item)}
        disabled={usado}
      >
        <Text style={[styles.titulo, usado && styles.tituloCanjeado]}>{item.nombre}</Text>
        <Text style={[styles.descripcion, usado && styles.descripcionCanjeado]}>{item.descripcion}</Text>
        {usado && <Text style={styles.usado}>✅ Canjeado</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text>Cargando cupones...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={cupones}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000ff' },
  container: { padding: 20, paddingBottom: 80 },
  cupon: {
    backgroundColor: '#ccff34',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#000000ff'},
  descripcion: { fontSize: 14, color: '#0000008b' },
  usado: { marginTop: 10, fontWeight: 'bold', color: '#000000ff' },
  canjeado: { backgroundColor: '#ccff34' },
  tituloCanjeado: { color: '#999' },
  descripcionCanjeado: { color: '#999' },
});
