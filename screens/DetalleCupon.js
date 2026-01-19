import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// ✅ URL PRODUCCIÓN (Railway)
const API_URL = "https://app-somos-valientes-production.up.railway.app";

export default function DetalleCupon({ route, navigation }) {
  const { cupon, user, onCanjear } = route.params;

  const [canjeado, setCanjeado] = useState(
    cupon.usados?.includes(user.celular) ?? false
  );
  const [mostrarCodigo, setMostrarCodigo] = useState(false);

  const handleCanjear = async () => {
    if (canjeado) return;

    try {
      const resp = await fetch(
        `${API_URL}/api/cupones/${cupon._id}/canjear`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ celular: user.celular }),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        Alert.alert(
          "Error",
          data.message || "No se pudo canjear el cupón"
        );
        return;
      }

      setCanjeado(true);
      setMostrarCodigo(true);

      // 🔁 Notificar a CuponeraScreen
      if (onCanjear) onCanjear(data);

    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "No se pudo conectar con el servidor"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, canjeado && styles.canjeadoCard]}>
        <Text style={styles.titulo}>{cupon.nombre}</Text>
        <Text style={styles.descripcion}>{cupon.descripcion}</Text>

        {mostrarCodigo && (
          <View style={styles.codigoContainer}>
            <Text style={styles.codigoLabel}>Tu Código:</Text>
            <Text style={styles.codigoValor}>{cupon.codigo}</Text>
          </View>
        )}

        {!canjeado && (
          <TouchableOpacity
            style={styles.botonCanjear}
            onPress={handleCanjear}
          >
            <Text style={styles.botonTexto}>Canjear Cupón</Text>
          </TouchableOpacity>
        )}

        {canjeado && !mostrarCodigo && (
          <Text style={styles.yaCanjeado}>
            ¡Este cupón ya fue canjeado!
          </Text>
        )}

        <TouchableOpacity
          style={styles.botonCerrar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botonCerrarTexto}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:15,
    backgroundColor:'#000000'
  },
  card: {
    width: '100%',
    backgroundColor: '#ccff34',
    padding: 30,
    borderRadius: 20,
    elevation: 8,
    alignItems: 'center'
  },
  canjeadoCard: { backgroundColor: '#ccff34' },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000'
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign:'center'
  },
  codigoContainer: {
    width: '100%',
    backgroundColor: '#f9fff0',
    borderRadius: 12,
    padding: 15,
    alignItems:'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccff34'
  },
  codigoLabel: { fontSize:16, color:'#777', marginBottom:5 },
  codigoValor: {
    fontSize:24,
    fontWeight:'bold',
    color:'#ccff34'
  },
  botonCanjear: {
    backgroundColor:'#ccff34',
    paddingVertical:15,
    paddingHorizontal:50,
    borderRadius:12,
    marginBottom:15,
    elevation:4
  },
  botonTexto: { color:'#000', fontSize:16, fontWeight:'bold' },
  yaCanjeado: {
    fontSize:16,
    color:'#d32f2f',
    fontWeight:'bold',
    marginBottom:15,
    textAlign:'center'
  },
  botonCerrar: {
    paddingVertical:12,
    paddingHorizontal:35,
    borderRadius:12,
    borderWidth:1,
    borderColor:'#000000',
    backgroundColor:'#000000'
  },
  botonCerrarTexto: { fontSize:16, color:'#ccff34' },
});
