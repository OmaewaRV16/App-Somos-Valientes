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

  const telefono = '9991234567'; // 🔥 CAMBIA ESTE NUMERO
  const mensaje =
    'Hola, quiero apoyar la difusión de Sociedad Valiente con una barda o lona.';

  const abrirWhats = () => {
    const url = `https://wa.me/52${telefono}?text=${encodeURIComponent(
      mensaje
    )}`;
    Linking.openURL(url);
  };

  const llamar = () => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* TITULO */}
        <Text style={styles.mainTitle}>
          ¿Quieres ayudar a la difusión de este mensaje
          con una barda o lona?
        </Text>

        <Text style={styles.subTitle}>
          Tu apoyo permite que más personas conozcan y se sumen
          a Sociedad Valiente.
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
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },

  subTitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },

  imagesContainer: {
    gap: 10,
  },

  image: {
    width: '100%',
    height: width * 0.55,
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 60,
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