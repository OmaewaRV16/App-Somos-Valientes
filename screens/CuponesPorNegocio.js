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

  const abrirWhatsApp = (whatsapp) => {
    if (!whatsapp) return;

    const mensaje = 'Hola, vengo desde la app Sociedad Valiente 👋';

    const url = whatsapp.startsWith('http')
      ? whatsapp
      : `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir WhatsApp')
    );
  };

  const canjearCupon = async (cupon) => {
    if (cupon.usados?.includes(user.celular)) return;

    try {
      const resp = await fetch(
        `${API_URL}/api/cupones/${cupon._id}/canjear`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ celular: user.celular }),
        }
      );

      if (!resp.ok) throw new Error();

      Alert.alert('Cupón canjeado', 'Muestra este código en el negocio');
      cargarCupones();
    } catch {
      Alert.alert('Error', 'No se pudo canjear el cupón');
    }
  };

  const renderItem = ({ item }) => {
    const usado = item.usados?.includes(user.celular);
    const lineas = item.descripcion?.split('\n') || [];

    return (
      <View style={[styles.card, usado && styles.canjeado]}>
        {/* DESCRIPCIÓN */}
        <Text style={styles.descripcion}>
          <Text style={styles.descripcionTitulo}>
            {lineas[0]}
            {'\n'}
          </Text>
          {lineas.slice(1).join('\n')}
        </Text>

        {usado && (
          <View style={styles.codigoBox}>
            <Text style={styles.codigoLabel}>Tu código</Text>
            <Text style={styles.codigo}>{item.codigo}</Text>
          </View>
        )}

        {!usado && (
          <TouchableOpacity
            style={styles.boton}
            onPress={() => canjearCupon(item)}
          >
            {/* <Text style={styles.botonTexto}>Canjear Cupón</Text> */}
          </TouchableOpacity>
        )}

        {/* BOTÓN WHATSAPP SOLO SI EXISTE */}
        {item.whatsapp && (
          <TouchableOpacity
            style={styles.botonWhats}
            onPress={() => abrirWhatsApp(item.whatsapp)}
          >
            <Text style={styles.botonWhatsTexto}>
              Canjear Cupón por WhatsApp
            </Text>
          </TouchableOpacity>
        )}

        {usado && (
          <Text style={styles.usadoTexto}>✅ Ya canjeado</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
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
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

/* =======================
   ESTILOS
======================= */
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
    marginBottom: 30,
  },

  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
    borderRadius: 18,
    padding: 25,
    marginBottom: 15,
    alignItems: 'center',
  },

  canjeado: { opacity: 0.85 },

  descripcion: {
    fontSize: 13,
    color: '#333',
    marginBottom: 15,
    lineHeight: 22,
  },

  descripcionTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  codigoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },

  codigoLabel: { color: '#666' },

  codigo: {
    fontSize: 26,
    fontWeight: 'bold',
  },

/*   boton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 10,
  },

  botonTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  }, */

  botonWhats: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },

  botonWhatsTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  usadoTexto: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#ff0000',
  },
});
