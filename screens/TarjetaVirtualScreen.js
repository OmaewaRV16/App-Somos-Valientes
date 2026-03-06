import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

const API_URL =
  'https://app-somos-valientes-production.up.railway.app/api/noticias';

export default function NoticiasScreen() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchNoticias = useCallback(async () => {
    try {
      const resp = await fetch(API_URL);
      const data = await resp.json();
      setNoticias(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las noticias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchNoticias();
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchNoticias();
    } finally {
      setRefreshing(false);
    }
  };

  const abrirLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
  };

  // 🔥 FORMATEAR FECHA
  const formatearFecha = (fecha) => {
    if (!fecha) return '';

    const date = new Date(fecha);

    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: item.imagen }}
        style={styles.imagen}
        imageStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.25)', 'transparent']}
          style={styles.topImageShadow}
        />

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo-verde.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']}
          style={styles.overlay}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SOCIEDAD VALIENTE</Text>
          </View>

          <Text style={styles.titulo}>{item.titulo}</Text>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <Text numberOfLines={3} style={styles.descripcion}>
          {item.descripcion}
        </Text>

        {/* 🔥 FOOTER CON BOTÓN Y FECHA */}
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => abrirLink(item.link)}
          >
            <Text style={styles.buttonText}>Leer más</Text>
          </TouchableOpacity>

          <Text style={styles.fechaText}>
            {formatearFecha(item.fechaPublicacion || item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );

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
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bottomShadow,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 120],
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

      <Animated.FlatList
        data={noticias}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  container: {
    padding: 20,
    paddingBottom: 100,
    paddingRight: 10,
  },

  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 10,
  },

  card: {
    backgroundColor: '#121212',
    borderRadius: 28,
    marginBottom: 30,
    overflow: 'hidden',
    borderBottomColor: '#ccff34',
    borderBottomWidth: 2,
  },

  imagen: {
    width: '100%',
    height: 270,
    justifyContent: 'flex-end',
  },

  topImageShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },

  logoContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 50,
  },

  logo: {
    width: 48,
    height: 48,
  },

  overlay: {
    padding: 22,
  },

  badge: {
    backgroundColor: '#ccff34',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },

  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  titulo: {
    color: '#ccff34',
    fontSize: 23,
    fontWeight: 'bold',
  },

  content: {
    padding: 24,
  },

  descripcion: {
    color: '#bdbdbd',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fechaText: {
    color: '#888',
    fontSize: 12,
  },

  buttonContainer: {
    backgroundColor: '#ccff34',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 40,
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});