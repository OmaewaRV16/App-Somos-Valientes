import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TarjetaVirtualScreen({ route }) {
  const { user } = route.params;
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const calcularSaldo = async () => {
      try {
        const data = await AsyncStorage.getItem('apoyos');
        if (data) {
          const apoyos = JSON.parse(data);
          const total = apoyos
            .filter(a => a.participante === user.correo)
            .reduce((sum, a) => sum + a.monto, 0);
          setSaldo(total);
        }
      } catch (error) {
        console.log(error);
      }
    };
    calcularSaldo();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Tarjeta Somos Valientes</Text>

        <View style={styles.chipContainer}>
          <View style={styles.chip} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{user.nombres} {user.apellidoP}</Text>
          <Text style={styles.numero}>****  ****  ****  ****</Text>
        </View>

        <View style={styles.saldoContainer}>
          <Text style={styles.label}>Saldo disponible</Text>
          <Text style={styles.monto}>${saldo.toFixed(2)}</Text>
        </View>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SV</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => alert('Pronto podrás recargar y transferir 💸')}
      >
        <Text style={styles.botonTexto}>Opciones</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#000000ff',
  },
  card:{
    width:'88%',
    backgroundColor:'#ccff34',
    borderRadius:20,
    padding:25,
    position:'relative',
    elevation:6,
  },
  titulo:{
    color:'#000000ff',
    fontSize:18,
    fontWeight:'bold',
    marginBottom:25,
  },
  chipContainer:{
    alignItems:'flex-start',
    marginBottom:25,
  },
  chip:{
    width:45,
    height:30,
    borderRadius:6,
    backgroundColor:'gold',
  },
  infoContainer:{
    marginBottom:25,
  },
  nombre:{
    color:'#000000ff',
    fontSize:17,
    fontWeight:'500',
    marginBottom:5,
  },
  numero:{
    color:'#000000ff',
    fontSize:18,
    letterSpacing:3,
  },
  saldoContainer:{
    borderTopWidth:1,
    borderTopColor:'#000000ff',
    paddingTop:15,
  },
  label:{
    color:'#000000ff',
    fontSize:14,
  },
  monto:{
    color:'#000000ff',
    fontSize:30,
    fontWeight:'bold',
    marginTop:5,
  },
  logoContainer:{
    position:'absolute',
    bottom:15,
    right:20,
    backgroundColor:'#000000ff',
    width:45,
    height:45,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center',
  },
  logoText:{
    color:'#ccff34',
    fontWeight:'bold',
    fontSize:16,
  },
  boton:{
    backgroundColor:'#ccff34',
    marginTop:40,
    paddingVertical:14,
    paddingHorizontal:40,
    borderRadius:10,
  },
  botonTexto:{
    color:'#000000ff',
    fontWeight:'bold',
    fontSize:16,
  },
});

