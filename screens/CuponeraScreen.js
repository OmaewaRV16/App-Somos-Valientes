import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

const agruparPorCategoria = (cupones) => {
  const categorias = {};

  cupones.forEach((cupon) => {
    const categoria = cupon.categoria || 'Otros';
    const nombre = cupon.nombre?.trim() || 'Sin nombre';

    if (!categorias[categoria]) {
      categorias[categoria] = {};
    }

    if (!categorias[categoria][nombre]) {
      categorias[categoria][nombre] = {
        nombre,
        logo: cupon.logo || cupon.logoUrl || cupon.imagen || null,
        cupones: [cupon],
      };
    } else {
      categorias[categoria][nombre].cupones.push(cupon);
    }
  });

  return Object.keys(categorias).map((categoria) => ({
    categoria,
    negocios: Object.values(categorias[categoria]),
  }));
};

export default function CuponeraScreen({ route, navigation }) {
  const { user } = route.params;

  const [categorias, setCategorias] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
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
        Alert.alert('Error', 'No se pudieron cargar los cupones');
        return;
      }

      const agrupados = agruparPorCategoria(data);
      setCategorias(agrupados);
      setFiltered(agrupados);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los cupones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCupones();
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCupones();
    setRefreshing(false);
  };

  const buscar = (text) => {
    setSearch(text);

    if (!text) {
      setFiltered(categorias);
      return;
    }

    const filtrado = categorias
      .map((cat) => ({
        ...cat,
        negocios: cat.negocios.filter((n) =>
          n.nombre.toLowerCase().includes(text.toLowerCase())
        ),
      }))
      .filter((cat) => cat.negocios.length > 0);

    setFiltered(filtrado);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ccff34" />
          <Text style={{ color: '#ccff34' }}>Cargando cupones...</Text>
        </View>
      ) : (
        <>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar negocio..."
              placeholderTextColor="#777"
              value={search}
              onChangeText={buscar}
            />
          </View>

          <FlatList
            contentContainerStyle={styles.container}
            data={filtered}
            keyExtractor={(item) => item.categoria}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <View>

                {/* CATEGORÍA */}
                <View style={styles.categoriaRow}>
                  <Text style={styles.categoriaTitulo}>
                    {item.categoria}
                  </Text>
                  <View style={styles.linea} />
                </View>

                {/* NEGOCIOS */}
                {item.negocios.map((negocio) => (
                  <TouchableOpacity
                    key={negocio.nombre}
                    style={styles.cupon}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate('CuponesPorNegocio', {
                        negocio,
                        user,
                      })
                    }
                  >
                    <View style={styles.logoWrapper}>
                      {negocio.logo ? (
                        <Image
                          source={{ uri: negocio.logo }}
                          style={styles.logo}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.logoPlaceholder}>
                          <Text style={styles.logoPlaceholderText}>SV</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.titulo}>{negocio.nombre}</Text>

                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {negocio.cupones.length} cupón(es)
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

/* ======================= */
/* NUEVOS ESTILOS PREMIUM */
/* ======================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  searchBox: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  searchInput: {
    backgroundColor: '#111',
    borderColor: '#ccff34',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#ccff34',
    marginBottom: 15,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoriaRow: {
    marginTop: 20,
    marginBottom: 10,
  },

  categoriaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 5,
  },

  linea: {
    height: 2,
    width: 40,
    backgroundColor: '#ccff34',
  },

  cupon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccff34',
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: '#ccff34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  logoWrapper: {
    marginRight: 15,
  },

  logo: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#fff',
  },

  logoPlaceholder: {
    width: 75,
    height: 75,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoPlaceholderText: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 20,
  },

  info: {
    flex: 1,
  },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  badge: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: '#ccff34',
    fontSize: 12,
    fontWeight: 'bold',
  },

  arrow: {
    fontSize: 26,
    color: '#000',
    marginLeft: 10,
  },
});