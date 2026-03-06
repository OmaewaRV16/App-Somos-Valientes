import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function CuponesPorNegocio({ route }) {
  const { negocio } = route.params;
  const [cupones, setCupones] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    cargarCupones();
  }, []);

  const cargarCupones = async () => {
    try {
      const resp = await fetch(`${API_URL}/api/cupones`);
      const data = await resp.json();
      const filtrados = data.filter(c => c.nombre === negocio.nombre);
      setCupones(filtrados);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar los cupones');
    }
  };

  const abrirLink = (url) => {
    if (!url) return;
    Linking.openURL(url);
  };

  const abrirWhatsApp = (whatsapp) => {
    if (!whatsapp) return;
    const mensaje = `Hola 😊 vengo desde Sociedad Valiente para hacer válido mi cupón en ${negocio.nombre}. ¿Podrían brindarme información sobre cómo aplicarlo?`;
    const numero = whatsapp.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);
  };

  const llamarTelefono = (numero) => {
    if (!numero) return;
    Linking.openURL(`tel:${numero}`);
  };

  const renderItem = ({ item, index }) => {
    const lineas = item.descripcion?.split('\n') || [];
    const esUltimo = index === cupones.length - 1;
    const cardStyle = esUltimo ? styles.cardNormal : styles.cardGrande;

    return (
      <View>
        <View style={cardStyle}>

          {/* ICONO SUPERIOR */}
          <Image
            source={require('../assets/Formas-Color-Verde_06.png')}
            style={styles.iconoSuperiorImg}
          />

          {/* ICONO INFERIOR */}
          <Image
            source={require('../assets/Formas-Color-Verde_03.png')}
            style={styles.iconoInferiorImg}
          />

          <Text style={styles.tituloDescuento}>
            Descuento válido {"\n"} en los siguientes servicios:
          </Text>

          {lineas.map((linea, i) => (
            <Text
              key={i}
              style={[
                styles.descripcion,
                i < 2 ? styles.descripcionBold : styles.descripcionItalic
              ]}
            >
              {linea}
            </Text>
          ))}

          {esUltimo && item.whatsapp && (
            <View style={styles.botonesContainer}>
              <Text style={styles.textoBotonContainer}>
                Canjea tu cupón por WhatsApp o Llamada:
              </Text>

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={styles.whatsButton}
                  onPress={() => abrirWhatsApp(item.whatsapp)}
                >
                  <Ionicons name="logo-whatsapp" size={18} color="#000" />
                  <Text style={styles.buttonText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => llamarTelefono(item.whatsapp)}
                >
                  <Ionicons name="call" size={16} color="#ccff34" />
                  <Text style={styles.callText}>Llamar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['bottom']}>
      <FlatList
        data={cupones}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40 + insets.bottom,
        }}

        /* HEADER NEGOCIO */
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>{negocio.nombre}</Text>

            <View style={styles.negocioCard}>
              <View style={styles.logoSection}>
                <Image
                  source={{ uri: negocio.logo }}
                  style={styles.logo}
                />

                {cupones[0]?.facebookNegocio && (
                  <TouchableOpacity
                    style={styles.facebookNegocioIcon}
                    onPress={() => abrirLink(cupones[0].facebookNegocio)}
                  >
                    <Image
                      source={require('../assets/facebook.png')}
                      style={styles.iconoFacebookNegocio}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.descripcionSection}>
                <Text style={styles.descripcionNegocio}>
                  {cupones[0]?.descripcionNegocio}
                </Text>
              </View>
            </View>
          </View>
        }

        /* REDES SERGIO */
        ListFooterComponent={
          cupones.length > 0 ? (
            <View style={{ marginTop: 25 }}>
              <View style={styles.redesSergioBox}>
                <Text style={styles.redesTituloBox}>
                  Sigue nuestras redes sociales:
                </Text>

                <View style={styles.redesRow}>
                  {cupones[0]?.facebookSergio && (
                    <TouchableOpacity onPress={() => abrirLink(cupones[0].facebookSergio)}>
                      <Image source={require('../assets/facebook.png')} style={styles.iconoRed}/>
                    </TouchableOpacity>
                  )}

                  {cupones[0]?.instagramSergio && (
                    <TouchableOpacity onPress={() => abrirLink(cupones[0].instagramSergio)}>
                      <Image source={require('../assets/instagram.png')} style={styles.iconoRed}/>
                    </TouchableOpacity>
                  )}

                  {cupones[0]?.tiktokSergio && (
                    <TouchableOpacity 
                      style={styles.iconoRedContainer}
                      onPress={() => abrirLink(cupones[0].tiktokSergio)}
                    >
                      <Image 
                        source={require('../assets/tiktok.png')} 
                        style={styles.iconoRed}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
    marginVertical: 25,
  },

  negocioCard: {
    backgroundColor: '#121212',
    flexDirection: 'row',
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    borderRadius: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#ccff34',
  },

  logoSection: {
    position: 'relative',
    marginRight: 15,
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#ccff34',
  },

  facebookNegocioIcon: {
    position: 'absolute',
    bottom: -6,
    right: -6,
  },

  iconoFacebookNegocio: {
    width: 36,
    height: 36,
  },

  descripcionSection: {
    flex: 1,
  },

  descripcionNegocio: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },

  cardGrande: {
    backgroundColor: '#121212',
    padding: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#ccff34',
  },

  cardNormal: {
    backgroundColor: '#121212',
    padding: 22,
    borderBottomWidth: 2,
    borderBottomColor: '#ccff34',
  },

  tituloDescuento: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 14,
    color: '#ccff34',
  },

  descripcion: {
    fontSize: 15,
    lineHeight: 24,
    color: '#e0e0e0',
  },

  descripcionBold: {
    fontWeight: 'bold',
    color: '#ffffff',
  },

  descripcionItalic: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#bdbdbd',
  },

  botonesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  textoBotonContainer: {
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
    color: '#ccff34',
    fontSize: 14,
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  whatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccff34',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 8,
  },

  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccff34',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 13,
  },

  callText: {
    color: '#ccff34',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 13,
  },

  redesSergioBox: {
    backgroundColor: '#121212',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccff34',
  },

  redesTituloBox: {
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#ccff34',
    fontSize: 15,
  },

  redesRow: {
    flexDirection: 'row',
    gap: 30,
  },

  iconoRed: {
    width: 28,
    height: 28,
  },

  iconoRedContainer: {
    backgroundColor: '#ccff34',
    borderRadius: 20,
  },

  iconoSuperiorImg: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  iconoInferiorImg: {
    position: 'absolute',
    bottom: 10,
    right: -15,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

});