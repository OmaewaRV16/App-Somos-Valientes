import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SerAportanteScreen() {

  const telefono = '9997478671'; // 🔥 CAMBIA ESTE NUMERO
  const mensaje =
  'Hola, me interesa formar parte de Sociedad Valiente como aportante con mi negocio o servicio. ¿Podrían brindarme información sobre cómo integrarme?';

  const abrirWhats = () => {
    const url = `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`;
    Linking.openURL(url);
  };

  const llamar = () => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 🔥 PARALELOGRAMO */}
        <View style={styles.paralelogramoContainer}>
          <Svg
            height="120"
            width="100%"
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
          >
            <Polygon
              points="40,0 400,0 360,120 0,120"
              fill="#ccff34"
            />
          </Svg>

          <Text style={styles.greenTitle}>
            ¿Tienes un {"\n"} negocio o {"\n"} servicio?
          </Text>
        </View>

        {/* CONTENIDO CENTRAL MÁS ANGOSTO */}
        <View style={styles.contentBox}>

          <Text style={styles.textWhite}>
            ¿Te gustaría darlos a conocer y{' '}
            <Text style={styles.textGreen}>
              Ayudar a la Sociedad
            </Text>
            ?
          </Text>

          <Text style={styles.contactTitle}>
            Contáctanos
          </Text>

          <Text style={styles.textWhiteSmall}>
            y forma parte de toda la difusión:
          </Text>

          <Text style={styles.listText}>
            Cuponera, redes sociales, WhatsApp y nuestra App.
          </Text>

          {/* LOGO MÁS GRANDE */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo-verde.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* BOTONES */}
          <View style={styles.buttonsRow}>

            <TouchableOpacity style={styles.whatsButton} onPress={abrirWhats}>
              <Ionicons name="logo-whatsapp" size={22} color="#000" />
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callButton} onPress={llamar}>
              <Ionicons name="call" size={20} color="#ccff34" />
              <Text style={styles.callText}>Llamar</Text>
            </TouchableOpacity>

          </View>

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
    paddingTop: 5,
    paddingBottom: 60,
  },

  paralelogramoContainer: {
    marginBottom: 35,
    justifyContent: 'center',
  },

  greenTitle: {
    position: 'absolute',
    alignSelf: 'center',
    top: -1,
    width: '90%',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },

  /* 🔥 CONTENIDO MÁS ANGOSTO */
  contentBox: {
    width: '88%',
    alignSelf: 'center',
  },

  textWhite: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
    lineHeight: 28,
  },

  textGreen: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  contactTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },

  textWhiteSmall: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },

  listText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
    lineHeight: 26,
  },

  logoContainer: {
    alignItems: 'center',

  },

  /* 🔥 LOGO MÁS GRANDE */
  logo: {
    width: width * 0.9,
    height: 180,
  },

  /* BOTONES */
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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