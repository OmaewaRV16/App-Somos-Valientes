import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  ActivityIndicator,
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

  const fetchNoticias = useCallback(async () => {
    try {
      const resp = await fetch(API_URL);

      if (!resp.ok) {
        Alert.alert('Error', 'No se pudieron cargar las noticias');
        return;
      }

      const data = await resp.json();
      setNoticias(data);
    } catch (error) {
      console.log(error);
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
    await fetchNoticias();
    setRefreshing(false);
  };

  const abrirLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) Linking.openURL(url);
    else Alert.alert('Error', 'No se pudo abrir la noticia');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: item.imagen }}
        style={styles.imagen}
        imageStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo-verde.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.95)']}
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

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => abrirLink(item.link)}
        >
          <Text style={styles.buttonText}>Leer más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ccff34" />
          <Text style={{ color: '#ccff34', marginTop: 10 }}>
            Cargando noticias...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={noticias}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#121212',
    borderRadius: 28,
    marginBottom: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
    borderBottomColor: '#ccff34',
    borderBottomWidth: 3,
  },

  imagen: {
    width: '100%',
    height: 270,
    justifyContent: 'flex-end',
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
    color: '#ffffff',
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

  buttonContainer: {
    alignSelf: 'flex-start',
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
});