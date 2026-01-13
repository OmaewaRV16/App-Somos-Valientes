import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'https://app-somos-valientes-production.up.railway.app';

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

        const uri = await AsyncStorage.getItem(`userImage-${parsedUser.celular}`);
        if (uri) setImagen(uri);
      }
    };
    cargarUsuario();
  }, []);

  // ==========================
  // FOTO DE PERFIL
  // ==========================
  const seleccionarImagen = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImagen(uri);
        await AsyncStorage.setItem(`userImage-${user.celular}`, uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  // ==========================
  // CERRAR SESIÓN
  // ==========================
  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Deseas cerrar sesión?',
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

  // ==========================
  // ELIMINAR CUENTA (🔥)
  // ==========================
  const eliminarCuenta = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es permanente y NO se puede deshacer.\n\n¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/users/${user._id}`,
                { method: 'DELETE' }
              );

              if (!response.ok) {
                const data = await response.json();
                Alert.alert('Error', data.message || 'No se pudo eliminar la cuenta');
                return;
              }

              await AsyncStorage.removeItem('currentUser');
              await AsyncStorage.removeItem(`userImage-${user.celular}`);

              Alert.alert(
                'Cuenta eliminada',
                'Tu cuenta fue eliminada correctamente',
                [
                  {
                    text: 'OK',
                    onPress: () =>
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                      }),
                  },
                ]
              );
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'No se pudo conectar con el servidor');
            }
          },
        },
      ]
    );
  };

  if (!user) return <Text style={{ color: '#fff' }}>Cargando...</Text>;

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

        <Text style={styles.label}>Rol:</Text>
        <Text style={styles.rol}>{user.rol}</Text>

        <Text style={styles.nombre}>
          {user.nombres} {user.apellidoP}
        </Text>

        <TouchableOpacity style={styles.botonFoto} onPress={seleccionarImagen}>
          <Text style={styles.botonTextoFoto}>Cambiar Foto</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.label}>Celular:</Text>
          <Text>{user.celular}</Text>

          <Text style={styles.label}>Dirección:</Text>
          <Text>{user.direccion}</Text>

          <Text style={styles.label}>Fecha de Nacimiento:</Text>
          <Text>{user.fechaNac}</Text>
        </View>
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Text style={styles.botonTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Eliminar cuenta */}
      <TouchableOpacity style={styles.botonEliminar} onPress={eliminarCuenta}>
        <Text style={styles.botonEliminarTexto}>Eliminar Cuenta</Text>
      </TouchableOpacity>

      <Text style={styles.version}>v1.0 Beta</Text>

      {/* Modal imagen */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalFondo}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={imagen ? { uri: imagen } : require('../assets/default-profile.png')}
            style={{ width: width - 40, height: width - 40, borderRadius: 15 }}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ==========================
// ESTILOS
// ==========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ccff34',
    borderRadius: 20,
    paddingTop: 200,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'absolute',
    top: 50,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#000',
  },
  foto: { width: 120, height: 120, borderRadius: 60 },
  nombre: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  rol: { fontSize: 18, marginBottom: 10 },
  info: { alignSelf: 'stretch', marginTop: 10 },
  label: { fontWeight: 'bold', marginTop: 10 },

  botonFoto: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
  },
  botonTextoFoto: { color: '#ccff34', fontWeight: 'bold' },

  botonCerrar: {
    backgroundColor: '#ccff34',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  botonTexto: { fontWeight: 'bold', color: '#000' },

  botonEliminar: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  botonEliminarTexto: { color: '#fff', fontWeight: 'bold' },

  version: { position: 'absolute', bottom: 10, right: 20, color: '#999' },

  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
