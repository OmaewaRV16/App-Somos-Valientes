import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTICIAS = [
  {
    id: '1',
    titulo: 'Sociedad Valiente fortalece la vinculación ciudadana',
    descripcion:
      'Vecinas y vecinos se suman a una iniciativa que busca construir comunidad, conciencia social y apoyo mutuo.',
    imagen:
      'https://scontent.fcjs3-1.fna.fbcdn.net/v/t39.30808-6/626353161_1365305295611715_4420526009958455416_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH7J-PcElh5OUrppHGEQtxvrdZ9d5_mVyyt1n13n-ZXLFMM4pCtpDChonaEEgQhAUruPTnjmG9LMUwDrCk9K9Zd&_nc_ohc=tdL0tnK7tT4Q7kNvwFj7alo&_nc_oc=Admtuk-A8aeVWPq-wbRxJq83EwiPb98Bw437mQ3l1ELmSKd6q_aMN1aO2dWLkiCfnXA&_nc_zt=23&_nc_ht=scontent.fcjs3-1.fna&_nc_gid=p5u9ho7Fxx6l9QDzVTYCOA&oh=00_AfuclVopUkjCYkigWp7puRN9x0OVgl0CCQZ5zwO49Gqhvw&oe=698FEC6C', // ⬅️ cambia por la imagen real
    link: 'https://www.facebook.com/share/p/18L2Qtn2T3/',
  },
  {
    id: '2',
    titulo: 'Ser valiente es levantarte todos los días con ganas de crecer.',
    descripcion:
      'Cierre del Tercer Curso de Keratina y Alaciado nace de una mujer valiente para mujeres valientes, que creen en el poder de crear juntas una sociedad presente, solidaria y valiente.',
    imagen:
      'https://scontent.fisj3-3.fna.fbcdn.net/v/t39.30808-6/627899956_122278488074075881_3533193883339252838_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHcOLbsbauBjDv12vA-asDFbbuy0b0yhDJtu7LRvTKEMiran7uWK5Y5ODNJyeTiZn0KX4juk3rDXDVCZXbaT7Cz&_nc_ohc=epRHPxyFW-sQ7kNvwG1rzbj&_nc_oc=Adk3HCfdozke7BFD8Ld6jc93RWuOmQ7jOIICI1q5YmJXacQqEBIVJfzJ4dAh9qhXahg&_nc_zt=23&_nc_ht=scontent.fisj3-3.fna&_nc_gid=3lFolJCKMWilUysY3FnMug&oh=00_AfspP18y6uJcvfvLHugEdVRdGVg7d6PWsYQsEaUZXW_hQw&oe=69900A67', // ⬅️ cambia por la imagen real
    link: 'https://www.facebook.com/share/p/17q1mCNUrk/',
  },
];

export default function NoticiasScreen() {
  const abrirLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'No se pudo abrir la noticia');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => abrirLink(item.link)}
    >
      <Image
        source={{ uri: item.imagen }}
        style={styles.imagen}
        resizeMode="cover"
      />

      <View style={styles.contenido}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>

        <Text style={styles.verMas}>Ver noticia →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={NOTICIAS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
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

  container: {
    padding: 25,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#111',
    borderRadius: 18,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#ccff34',
  },

  imagen: {
    width: '100%',
    height: 200,
  },

  contenido: {
    padding: 16,
  },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 8,
  },

  descripcion: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 12,
  },

  verMas: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'right',
  },
});
