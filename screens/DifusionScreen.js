import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DifusionScreen() {

  const telefono = '9997478671';

  const mensaje =
    'Hola, me interesa apoyar la difusión de Sociedad Valiente colocando una barda o lona. ¿Podrían brindarme información sobre cómo participar?';

  const abrirWhats = () => {
    const url = `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`;
    Linking.openURL(url);
  };

  const llamar = () => {
    Linking.openURL(`tel:+52${telefono}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 🔥 NUEVO TITULO */}
        <Text style={styles.mainTitle}>
            ¿Quieres ayudar a la difusión de este mensaje con una barda o lona?
        </Text>

        <Text style={styles.subTitle}>
            Haz que el mensaje llegue más lejos y más personas se sumen a Sociedad Valiente. ¡Juntos podemos lograr un cambio real!.
        </Text>

        {/* IMÁGENES */}
        <View style={styles.imagesContainer}>

          <Image
            source={require('../assets/barda-ejemplo.jpg')}
            style={styles.image}
            resizeMode="cover"
          />

          <Image
            source={require('../assets/lona-ejemplo.jpg')}
            style={styles.image}
            resizeMode="cover"
          />

        </View>

        {/* BOTONES */}
        <View style={styles.buttonsRow}>

          <TouchableOpacity
            style={styles.whatsButton}
            onPress={abrirWhats}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#000" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callButton}
            onPress={llamar}
          >
            <Ionicons name="call" size={20} color="#ccff34" />
            <Text style={styles.callText}>Llamar</Text>
          </TouchableOpacity>

        </View>

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
    paddingTop: 20,  // 🔥 controla el espacio superior
    paddingBottom: 30,
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 30,
  },

  subTitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },

  imagesContainer: {
    marginBottom: 20,
  },

  image: {
    width: '100%',
    height: width * 0.50,
    marginBottom: 5,
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
  },

  whatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccff34',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },

  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccff34',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
  },

  callText: {
    color: '#ccff34',
    fontWeight: 'bold',
    marginLeft: 8,
  },

});