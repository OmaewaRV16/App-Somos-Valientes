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
      console.log(error);
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

  /* =======================
     BÚSQUEDA
  ======================= */
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
          {/* 🔍 BÚSQUEDA */}
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar negocio..."
              placeholderTextColor="#9aa09f"
              value={search}
              onChangeText={buscar}
            />
          </View>

          {/* LISTA POR CATEGORÍAS */}
          <FlatList
            contentContainerStyle={styles.container}
            data={filtered}
            keyExtractor={(item) => item.categoria}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <View>
                {/* CATEGORÍA */}
                <Text style={styles.categoriaTitulo}>{item.categoria}</Text>

                {/* NEGOCIOS */}
                {item.negocios.map((negocio) => (
                  <TouchableOpacity
                    key={negocio.nombre}
                    style={styles.cupon}
                    onPress={() =>
                      navigation.navigate('CuponesPorNegocio', {
                        negocio,
                        user,
                      })
                    }
                  >
                    {/* LOGO */}
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

                    {/* INFO */}
                    <View style={styles.info}>
                      <Text style={styles.titulo}>{negocio.nombre}</Text>
                      <Text style={styles.descripcion}>
                        {negocio.cupones.length} cupón(es) disponibles
                      </Text>
                    </View>
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

/* =======================
   ESTILOS
======================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  searchBox: {
    paddingHorizontal: 20,
    paddingTop: 15,
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

  container: {
    padding: 20,
    paddingBottom: 80,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoriaTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 10,
    marginTop: 20,
  },

  cupon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccff34',
    borderBottomColor: '#ffffff',
    borderBottomWidth: 3,
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
  },

  logoWrapper: {
    marginRight: 15,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
  },
  logoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ccff34',
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
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#0000008b',
  },
});
