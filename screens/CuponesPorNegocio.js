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

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function CuponesPorNegocio({ route }) {
  const { negocio } = route.params;
  const [cupones, setCupones] = useState([]);

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
    const mensaje = `Hola 😊 vengo desde Sociedad Valiente para hacer válido mi cupón en ${negocio.nombre}.`;
    const numero = whatsapp.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);
  };

  const llamarTelefono = (numero) => {
    if (!numero) return;
    Linking.openURL(`tel:${numero}`);
  };

  const renderItem = ({ item }) => {
    const lineas = item.descripcion?.split('\n') || [];

    return (
      <View style={{ marginBottom: 30 }}>
        <View style={styles.card}>

          <Image
            source={require('../assets/Formas-Color-Negro_06.png')}
            style={styles.iconoSuperiorImg}
          />

          <Image
            source={require('../assets/Formas-Color-Negro_03.png')}
            style={styles.iconoInferiorImg}
          />

          <Text style={styles.tituloDescuento}>
            Descuento válido {"\n"} en los siguientes servicios:
          </Text>

          {lineas.map((linea, index) => (
            <Text
              key={index}
              style={[
                styles.descripcion,
                index < 2 ? styles.descripcionBold : styles.descripcionItalic
              ]}
            >
              {linea}
            </Text>
          ))}

          {item.whatsapp && (
            <View style={styles.contactoContainer}>
              <Text style={styles.contactoTitulo}>
                Canjea tu cupón al:
              </Text>

              <View style={styles.iconosContactoRow}>

                <TouchableOpacity
                  style={styles.contactoSimple}
                  onPress={() => abrirWhatsApp(item.whatsapp)}
                >
                  <Image
                    source={require('../assets/whatsapp.png')}
                    style={styles.iconoContactoImg}
                  />
                  <Text style={styles.textoContacto}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.contactoSimple}
                  onPress={() => llamarTelefono(item.whatsapp)}
                >
                  <Text style={styles.textoContacto}>Llamar</Text>
                </TouchableOpacity>

              </View>
            </View>
          )}

        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>{negocio.nombre}</Text>

        <View style={styles.requisitoCard}>

          {negocio.logo && (
            <Image
              source={{ uri: negocio.logo }}
              style={styles.logoValidacion}
            />
          )}

          <View style={styles.redesContainer}>

            {/* REDES SERGIO */}
            <Text style={styles.requisitoTitulo}>
              Sigue las redes de Sergio para validar tu cupón:
            </Text>

            <View style={styles.redesRow}>

              {cupones[0]?.facebookSergio && (
                <TouchableOpacity onPress={() => abrirLink(cupones[0].facebookSergio)}>
                  <Image
                    source={require('../assets/facebook.png')}
                    style={styles.iconoRed}
                  />
                </TouchableOpacity>
              )}

              {cupones[0]?.instagramSergio && (
                <TouchableOpacity onPress={() => abrirLink(cupones[0].instagramSergio)}>
                  <Image
                    source={require('../assets/instagram.png')}
                    style={styles.iconoRed}
                  />
                </TouchableOpacity>
              )}

              {cupones[0]?.tiktokSergio && (
                <TouchableOpacity onPress={() => abrirLink(cupones[0].tiktokSergio)}>
                  <Image
                    source={require('../assets/tiktok.png')}
                    style={styles.iconoRed}
                  />
                </TouchableOpacity>
              )}

            </View>

            {/* REDES NEGOCIO */}
            {cupones[0]?.facebookNegocio && (
              <>
                <Text style={[styles.requisitoTitulo, { marginTop: 12 }]}>
                  También sigue a {negocio.nombre}:
                </Text>

                <View style={styles.redesRow}>
                  <TouchableOpacity
                    onPress={() => abrirLink(cupones[0].facebookNegocio)}
                  >
                    <Image
                      source={require('../assets/facebook.png')}
                      style={styles.iconoRed}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>

        </View>
      </View>

      <FlatList
        data={cupones}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },

  headerContainer: {
    marginBottom: 25,
    marginTop: 10,
  },

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 20,
    textAlign: 'center',
  },

  requisitoCard: {
    backgroundColor: '#ccff34',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoValidacion: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginRight: 15,
  },

  redesContainer: {
    flex: 1,
    flexShrink: 1,
  },

  requisitoTitulo: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 8,
    flexWrap: 'wrap',
    flexShrink: 1,
  },

  redesRow: {
    flexDirection: 'row',
    gap: 20,
  },

  iconoRed: {
    width: 28,
    height: 28,
  },

  card: {
    backgroundColor: '#ccff34',
    paddingVertical: 18,
    paddingHorizontal: 15,
    position: 'relative',
  },

  iconoSuperiorImg: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  iconoInferiorImg: {
    position: 'absolute',
    bottom: 0,
    right: -15,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  tituloDescuento: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    paddingVertical: 10,
  },

  descripcion: {
    fontSize: 13,
    color: '#111',
    lineHeight: 20,
    textAlign: 'left',
  },

  descripcionBold: {
    fontWeight: 'bold',
  },

  descripcionItalic: {
    fontStyle: 'italic',
    fontSize: 12,
  },

  contactoContainer: {
    marginTop: 15,
    alignItems: 'center',
  },

  contactoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  iconosContactoRow: {
    flexDirection: 'row',
    gap: 25,
  },

  contactoSimple: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconoContactoImg: {
    width: 20,
    height: 20,
    marginRight: 6,
  },

  textoContacto: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },

});