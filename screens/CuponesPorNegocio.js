import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Linking,
} from 'react-native';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function CuponesPorNegocio({ route }) {
  const { negocio, user } = route.params;
  const [cupones, setCupones] = useState([]);

  useEffect(() => {
    cargarCupones();
  }, []);

  const cargarCupones = async () => {
    try {
      const resp = await fetch(`${API_URL}/api/cupones`);
      const data = await resp.json();
      const filtrados = data.filter(
        (c) => c.nombre === negocio.nombre
      );
      setCupones(filtrados);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar los cupones');
    }
  };

  const abrirLink = (url) => {
    if (!url) return;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir el enlace')
    );
  };

  const abrirWhatsApp = (whatsapp) => {
    if (!whatsapp) return;
    const mensaje = 'Hola, vengo desde la app Sociedad Valiente 👋';
    const numero = whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    abrirLink(url);
  };

  const llamarTelefono = (numero) => {
    if (!numero) return;
    const telefono = numero.replace(/\D/g, '');
    abrirLink(`tel:${telefono}`);
  };

  const renderItem = ({ item }) => {
    const usado = item.usados?.includes(user.celular);
    const lineas = item.descripcion?.split('\n') || [];

    return (
      <View style={[styles.card, usado && styles.canjeado]}>

        {/* ENCABEZADO */}
        <Text style={styles.tituloDescuento}>
          🎁 Descuento exclusivo
        </Text>

        <Text style={styles.subtitulo}>
          Válido en los siguientes servicios
        </Text>

        <View style={styles.divider} />

        {/* DESCRIPCIÓN */}
        <Text style={styles.descripcionTitulo}>
          {lineas[0]}
        </Text>

        <Text style={styles.descripcion}>
          {lineas.slice(1).join('\n')}
        </Text>

        {/* CÓDIGO */}
        {usado && (
          <View style={styles.codigoBox}>
            <Text style={styles.codigoLabel}>Tu código</Text>
            <Text style={styles.codigo}>{item.codigo}</Text>
          </View>
        )}

        {/* CONTACTO */}
        {item.whatsapp && (
          <View style={styles.contactoContainer}>
            <Text style={styles.seccionTitulo}>Contacto directo</Text>

            <View style={styles.botonesContainer}>
              <TouchableOpacity
                style={styles.botonWhats}
                onPress={() => abrirWhatsApp(item.whatsapp)}
              >
                <Image
                  source={require('../assets/whatsapp.png')}
                  style={styles.icono}
                />
                <Text style={styles.botonWhatsTexto}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonLlamar}
                onPress={() => llamarTelefono(item.whatsapp)}
              >
                <Text style={styles.botonLlamarTexto}>Llamar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* REDES SOCIALES */}
        {(item.facebookSergio || item.facebookSociedad || item.facebookNegocio) && (
          <View style={styles.redesContainer}>
            <Text style={styles.seccionTitulo}>Redes oficiales</Text>

            {item.facebookSergio && (
              <TouchableOpacity
                style={styles.redItem}
                onPress={() => abrirLink(item.facebookSergio)}
              >
                <Image
                  source={require('../assets/facebook.png')}
                  style={styles.redIcon}
                />
                <Text style={styles.redText}>Facebook de Sergio</Text>
              </TouchableOpacity>
            )}

            {item.facebookSociedad && (
              <TouchableOpacity
                style={styles.redItem}
                onPress={() => abrirLink(item.facebookSociedad)}
              >
                <Image
                  source={require('../assets/facebook.png')}
                  style={styles.redIcon}
                />
                <Text style={styles.redText}>Sociedad Valiente</Text>
              </TouchableOpacity>
            )}

            {item.facebookNegocio && (
              <TouchableOpacity
                style={styles.redItem}
                onPress={() => abrirLink(item.facebookNegocio)}
              >
                <Image
                  source={require('../assets/facebook.png')}
                  style={styles.redIcon}
                />
                <Text style={styles.redText}>Facebook del Negocio</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{negocio.nombre}</Text>

        {negocio.logo ? (
          <Image source={{ uri: negocio.logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>SV</Text>
          </View>
        )}
      </View>

      <FlatList
        data={cupones}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 20,
  },

  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#ccff34',
  },

  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ccff34',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoPlaceholderText: {
    color: '#ccff34',
    fontSize: 22,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#ccff34',
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,
    elevation: 10,
  },

  canjeado: {
    opacity: 0.9,
  },

  tituloDescuento: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },

  subtitulo: {
    textAlign: 'center',
    fontSize: 13,
    color: '#000',
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#000',
    opacity: 0.2,
    marginVertical: 15,
  },

  descripcionTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },

  descripcion: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },

  codigoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },

  codigoLabel: {
    color: '#666',
  },

  codigo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  seccionTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },

  contactoContainer: {
    marginTop: 15,
  },

  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },

  botonWhats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
  },

  botonWhatsTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  botonLlamar: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
  },

  botonLlamarTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  icono: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  redesContainer: {
    marginTop: 20,
  },

  redItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  redIcon: {
    width: 20,
    height: 20,
  },

  redText: {
    color: '#ccff34',
    marginLeft: 10,
    fontWeight: 'bold',
  },

});