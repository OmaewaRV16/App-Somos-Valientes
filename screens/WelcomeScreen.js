import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* ✅ Imagen superior */}
      <Image
        source={require('../assets/Logotipo_Negro-01.png')} // reemplaza con tu imagen
        style={styles.topImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>¿Quieres unirte a SV?</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Register')}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        ¡Unirme Ahora!
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccff34',
    padding: 20,
  },
  topImage: {
    width: 400,
    height: 150,
    marginBottom: 20, // espacio entre la imagen y el título
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000ff',
    textAlign: 'center',  
    marginBottom: 30,
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#000000ff',
    paddingHorizontal: 30,
  },
  buttonLabel: {
    color: '#ccff34',
  },
  link: {
    color: '#0000008c',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
