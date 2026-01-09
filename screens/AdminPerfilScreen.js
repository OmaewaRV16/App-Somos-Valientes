import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function AdminPerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await AsyncStorage.getItem('currentUser');
      if (data) {
        const parsedUser = JSON.parse(data);
        setUser(parsedUser);

        const uri = await AsyncStorage.getItem(`userImage-${parsedUser.correo}`);
        if (uri) setImagen(uri);
      }
    };
    cargarUsuario();
  }, []);

  const seleccionarImagen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImagen(uri);
        await AsyncStorage.setItem(`userImage-${user.correo}`, uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  if (!user) return <Text>Cargando...</Text>;

  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageWrapper}>
          <Image
            source={imagen ? { uri: imagen } : require('../assets/default-profile.png')}
            style={styles.foto}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Soy:</Text>
        <Text style={styles.rol}>{user.rol}</Text>

        <Text style={styles.nombre}>{user.nombres} {user.apellidoP}</Text>

        <TouchableOpacity style={styles.boton} onPress={seleccionarImagen}>
          <Text style={styles.botonTextoFoto}>Cambiar Foto</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.label}>Número Celular:</Text>
          <Text>{user.celular}</Text>

          <Text style={styles.label}>Dirección:</Text>
          <Text>{user.direccion}</Text>

          <Text style={styles.label}>Fecha de Nacimiento:</Text>
          <Text>{user.fechaNac}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Text style={styles.botonTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.version}>v1.0 Beta</Text>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalFondo} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <Image
            source={imagen ? { uri: imagen } : require('../assets/default-profile.png')}
            style={[styles.modalImagen, { width: width - 40, height: width - 40 }]}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#000000ff', alignItems:'center', justifyContent: 'center', padding:30 },
  rol: {
  fontSize: 20,
  color: '#000000ff',
  marginBottom: 10,
  },
  card: {
    width: '100%',
    backgroundColor:'#ccff34',
    borderRadius:20,
    paddingTop:200,
    paddingBottom:20,
    paddingHorizontal:20,
    alignItems:'center',
    justifyContent: 'center',
    shadowColor:'#ccff34',
    shadowOffset:{ width:0, height:5 },
    shadowOpacity:0.15,
    shadowRadius:10,
    elevation:5,
    marginTop:20
  },
  imageWrapper:{
    position:'absolute',
    top:50,
    borderRadius:60,
    overflow:'hidden',
    borderWidth:4,
    borderColor:'black'
  },
  foto:{ width:120, height:120, borderRadius:60 },
  nombre:{ fontSize:20, fontWeight:'bold', marginBottom:10, color:'#333' },
  boton:{
    backgroundColor:'#000000ff',
    paddingVertical:8,
    paddingHorizontal:20,
    borderRadius:20,
    marginVertical:10
  },
  botonTexto:{ color:'#000000ff', fontWeight:'bold', textAlign:'center' },
  info:{ alignSelf:'stretch', marginTop:10 },
  label:{ fontWeight:'bold', marginTop:10, color:'#555' },
  botonTextoFoto: {
    color: '#ccff34',
    fontWeight:'bold', 
    textAlign:'center'
  },
  botonCerrar:{
    width:'100%',
    backgroundColor:'#ccff34',
    paddingVertical:10,
    borderRadius:25,
    alignItems:'center',
    marginTop:20
  },
  version:{ position:'absolute', bottom:10, right:20, color:'#999', fontSize:12 },
  modalFondo:{ flex:1, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'center', alignItems:'center' },
  modalImagen:{ borderRadius:15 },
});
