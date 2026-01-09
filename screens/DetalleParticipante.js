import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalleParticipante({ route, navigation }) {
  const { participante } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>
          {participante.nombres} {participante.apellidoP} {participante.apellidoM}
        </Text>

        <Text style={styles.label}>Celular:</Text>
        <Text style={styles.valor}>{participante.celular}</Text>

        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.valor}>{participante.direccion}</Text>

        <Text style={styles.label}>Fecha de Nacimiento:</Text>
        <Text style={styles.valor}>{participante.fechaNac}</Text>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
          <Text style={styles.botonTexto}>Cerrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'flex-start', // ahora inicia desde arriba
    alignItems: 'center',
    paddingTop: 50, // puedes ajustar este valor para subir/bajar más
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  valor: {
    fontSize: 16,
    marginTop: 2,
    color: '#555',
  },
  boton: {
    marginTop: 25,
    backgroundColor: '#000000ff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
