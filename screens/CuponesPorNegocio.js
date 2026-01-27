import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
} from 'react-native';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function CuponesPorNegocio({ route, navigation }) {
  const { negocio, user } = route.params;

  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const canjearCupon = async (cupon) => {
    const yaUsado = cupon.usados?.includes(user.celular);
    if (yaUsado) return;

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
    } catch (e) {
      Alert.alert('Error', 'No se pudo canjear el cupón');
    }
  };

  const renderItem = ({ item }) => {
    const usado = item.usados?.includes(user.celular);

    return (
      <View style={[styles.card, usado && styles.canjeado]}>
        <Text style={styles.titulo}>{item.descripcion}</Text>

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
            <Text style={styles.botonTexto}>Canjear Cupón</Text>
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
      {/* HEADER DEL NEGOCIO */}
      <View style={styles.headerContainer}>
          <Text style={styles.header}>{negocio.nombre}</Text>
        {negocio.logo ? (
          <Image
            source={{ uri: negocio.logo }}
            style={styles.logo}
            resizeMode="cover"
          />
          
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },

  /* HEADER */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    marginBottom: 10,

 
    borderWidth: 4,
    borderColor: '#ccff34',

    shadowColor: '#ccff34',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,

    elevation: 14, 
  },

  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,

    borderWidth: 4,
    borderColor: '#ccff34',

    shadowColor: '#ccff34',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,

    elevation: 12,
  },

  logoPlaceholderText: {
    color: '#ccff34',
    fontSize: 22,
    fontWeight: 'bold',
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#ccff34',
    borderRadius: 18,
    padding: 25,
    marginBottom: 15,
    alignItems: 'center',
  },

  canjeado: { opacity: 0.85 },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
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
    color: '#000',
  },

  boton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },

  botonTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  usadoTexto: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#ff0000',
  },
});
