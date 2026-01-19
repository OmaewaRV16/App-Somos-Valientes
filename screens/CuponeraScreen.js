import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  Image
} from 'react-native';
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
      const resp = await fetch(
        'https://app-somos-valientes-production.up.railway.app/api/cupones'
      );
      const data = await resp.json();

      if (!resp.ok) {
        Alert.alert('Error', data.message || 'No se pudieron cargar los cupones');
        return;
      }

      setCupones(data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar los cupones.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCupones().finally(() => setLoading(false));
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCupones();
    setRefreshing(false);
  };

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
    const logoUrl = item.logo || item.logoUrl || item.imagen;

    return (
      <TouchableOpacity
        style={[styles.cupon, usado && styles.canjeado]}
        onPress={() => handleVerDetalle(item)}
        disabled={usado}
      >
        {/* LOGO IZQUIERDA */}
        <View style={styles.logoWrapper}>
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={styles.logo}
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>SV</Text>
            </View>
          )}
        </View>

        {/* INFO DERECHA */}
        <View style={styles.info}>
          <Text style={[styles.titulo, usado && styles.tituloCanjeado]}>
            {item.nombre}
          </Text>
          <Text
            style={[
              styles.descripcion,
              usado && styles.descripcionCanjeado,
            ]}
            numberOfLines={2}
          >
            {item.descripcion}
          </Text>

          {usado && <Text style={styles.usado}>✅ Canjeado</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
          <Text>Cargando cupones...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={cupones}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* TARJETA */
  cupon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccff34',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
  },

  /* LOGO */
  logoWrapper: {
    marginRight: 15,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50, // 👈 circular
    backgroundColor: '#ffffff',
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  /* TEXTO */
  info: {
    flex: 1,
  },
  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#0000008b',
  },
  usado: {
    marginTop: 6,
    fontWeight: 'bold',
    color: '#000',
  },

  canjeado: {
    opacity: 0.7,
  },
  tituloCanjeado: {
    color: '#777',
  },
  descripcionCanjeado: {
    color: '#777',
  },
});
