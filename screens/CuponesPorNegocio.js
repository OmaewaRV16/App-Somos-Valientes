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
            <View style={styles.botonesContainer}>

              <Text style={styles.textoBotonContainer}>
                Canjea tu cupón por WhatsApp o Llamada:
              </Text>

              <View style={styles.filaBotones}>

                <TouchableOpacity
                  style={styles.botonWhatsapp}
                  onPress={() => abrirWhatsApp(item.whatsapp)}
                >
                  <Image
                    source={require('../assets/whatsapp.png')}
                    style={styles.iconoBoton}
                  />
                  <Text style={styles.textoBoton}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonLlamar}
                  onPress={() => llamarTelefono(item.whatsapp)}
                >
                  <Image
                    source={require('../assets/telefono.png')}
                    style={styles.iconoBotonTelefono}
                  />
                  <Text style={styles.textoBoton}>Llamar</Text>
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

    <FlatList
      data={cupones}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}

      ListFooterComponent={
        cupones.length > 0 ? (
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
                <TouchableOpacity onPress={() => abrirLink(cupones[0].tiktokSergio)}>
                  <Image source={require('../assets/tiktok.png')} style={styles.iconoRed}/>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null
      }
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

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
    marginVertical: 20,
  },

  negocioCard: {
    backgroundColor: '#ccff34',
    flexDirection: 'row',
    padding: 20,
    marginBottom: 25,
    alignItems: 'center',
  },

  logoSection: {
    position: 'relative',
    marginRight: 15,
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  facebookNegocioIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
  },

  iconoFacebookNegocio: {
    width: 40,
    height: 40,
  },

  descripcionSection: {
    flex: 1,
  },

  descripcionNegocio: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },

  card: {
    backgroundColor: '#ccff34',
    padding: 20,
    position: 'relative',
  },

  tituloDescuento: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },

  descripcion: {
    fontSize: 13,
    lineHeight: 20,
  },

  descripcionBold: {
    fontWeight: 'bold',
  },

  descripcionItalic: {
    fontStyle: 'italic',
    fontSize: 12,
  },

  botonesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  textoBotonContainer: {
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
  },

  filaBotones: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  botonWhatsapp: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  botonLlamar: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  iconoBoton: {
    width: 22,
    height: 22,
    marginRight: 8,
    resizeMode: 'contain',
  },

  iconoBotonTelefono: {
    width: 22,
    height: 22,
    marginRight: 8,
    resizeMode: 'contain',
    backgroundColor: '#00ccff',
    borderRadius: 12,
    padding: 4,
  },

  textoBoton: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  redesSergioBox: {
    backgroundColor: '#ccff34',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 0,
  },

  redesTituloBox: {
    fontWeight: 'bold',
    marginBottom: 12,
  },

  redesRow: {
    flexDirection: 'row',
    gap: 25,
  },

  iconoRed: {
    width: 36,
    height: 36,
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

});