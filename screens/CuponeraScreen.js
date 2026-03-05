import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

const agruparPorCategoria = (cupones) => {
  const categorias = {};
  cupones.forEach((cupon) => {
    const categoria = cupon.categoria || 'Otros';
    const nombre = cupon.nombre?.trim() || 'Sin nombre';

    if (!categorias[categoria]) categorias[categoria] = {};

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

  const scrollY = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  const fetchCupones = useCallback(async () => {
    try {
      const resp = await fetch(
        'https://app-somos-valientes-production.up.railway.app/api/cupones'
      );
      const data = await resp.json();
      const agrupados = agruparPorCategoria(data);
      setCategorias(agrupados);
      setFiltered(agrupados);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los cupones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCupones();
  }, [isFocused]);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ccff34" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* 🔥 Sombra inferior dinámica */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bottomShadow,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 80],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar negocio..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={buscar}
        />
      </View>

      <Animated.FlatList
        contentContainerStyle={styles.container}
        data={filtered}
        keyExtractor={(item) => item.categoria}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.categoriaTitulo}>
              {item.categoria.toUpperCase()}
            </Text>

            {item.negocios.map((negocio) => (
              <TouchableOpacity
                key={negocio.nombre}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('CuponesPorNegocio', {
                    negocio,
                    user,
                  })
                }
              >
                {negocio.logo ? (
                  <Image
                    source={{ uri: negocio.logo }}
                    style={styles.logo}
                  />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={{ color: '#ccff34' }}>SV</Text>
                  </View>
                )}

                <View style={styles.info}>
                  <Text style={styles.titulo}>
                    {negocio.nombre}
                  </Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },

  searchBox: {
    padding: 20,
  },

  searchInput: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#222',
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  categoriaTitulo: {
    fontSize: 14,
    color: '#ccff34',
    marginTop: 15,
    marginBottom: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 16,
    borderRadius: 18,
    marginBottom: 18,
    borderBottomColor: '#ccff34',
    borderBottomWidth: 2,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },

  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  info: {
    flex: 1,
  },

  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 6,
  },

  badge: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccff34',
    alignSelf: 'flex-start',
  },

  badgeText: {
    color: '#ccff34',
    fontSize: 12,
    fontWeight: 'bold',
  },

  arrow: {
    fontSize: 26,
    color: '#ccff34',
    marginLeft: 10,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});