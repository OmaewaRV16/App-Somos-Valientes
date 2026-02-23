import React, { useEffect, useState } from 'react';
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

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function NoticiasScreen() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNoticias(data);
    } catch (error) {
      console.log("Error cargando noticias:", error);
      Alert.alert("Error", "No se pudieron cargar las noticias");
    } finally {
      setLoading(false);
    }
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
        <ActivityIndicator size="large" color="#ccff34" />
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
      />
    </SafeAreaView>
  );
}