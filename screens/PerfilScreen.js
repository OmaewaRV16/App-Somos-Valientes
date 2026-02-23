import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const API_URL = 'https://app-somos-valientes-production.up.railway.app';

export default function PerfilScreen({ navigation }) {

  const [user, setUser] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // ==========================
  // CARGAR USUARIO
  // ==========================
  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await AsyncStorage.getItem('currentUser');
      if (data) {
        const parsedUser = JSON.parse(data);
        setUser(parsedUser);

        // 🔥 Cargar foto desde MongoDB
        if (parsedUser.foto) {
          setImagen(parsedUser.foto);
        }
      }
    };
    cargarUsuario();
  }, []);

  // ==========================
  // SUBIR FOTO A CLOUDINARY
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

        const formData = new FormData();
        formData.append('foto', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });

        const response = await fetch(
          `${API_URL}/api/users/${user._id}/foto`,
          {
            method: 'PUT',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const updatedUser = await response.json();

        // 🔥 Actualizar imagen en pantalla
        setImagen(updatedUser.foto);

        // 🔥 Actualizar usuario guardado
        await AsyncStorage.setItem(
          'currentUser',
          JSON.stringify(updatedUser)
        );
      }

    } catch (error) {
      Alert.alert('Error', 'No se pudo subir la imagen.');
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
  // ELIMINAR CUENTA
  // ==========================
  const eliminarCuenta = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es PERMANENTE y no se puede deshacer.\n\n¿Deseas continuar?',
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

              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              Alert.alert('Error', 'No se pudo conectar con el servidor');
            }
          },
        },
      ]
    );
  };

  const abrirModal = () => {
    setModalVisible(true);
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const cerrarModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  if (!user)
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Cargando...</Text>;

  return (
    <View style={styles.container}>

      {/* HEADER VERDE */}
      <View style={styles.header}>

        <View style={styles.headerTopRow}>
          <Text style={styles.slogan}>Ayudar {"\n"} es ayudar</Text>

          <Image
            source={require('../assets/Logotipo_Negro-01.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>

        <Image
          source={require('../assets/Formas-Color-Negro_06.png')}
          style={styles.iconTopLeft}
          resizeMode="contain"
        />

        <Image
          source={require('../assets/Formas-Color-Negro_03.png')}
          style={styles.iconBottomRight}
          resizeMode="contain"
        />

      </View>

      {/* FOTO */}
      <TouchableOpacity onPress={abrirModal} style={styles.imageWrapper}>
        <Image
          source={
            imagen
              ? { uri: imagen }
              : require('../assets/default-profile.png')
          }
          style={styles.foto}
        />
      </TouchableOpacity>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.nombre}>
          {user.nombres} {user.apellidoP}
        </Text>

        <Text style={styles.rol}>{user.rol?.toUpperCase()}</Text>

        <TouchableOpacity style={styles.botonFoto} onPress={seleccionarImagen}>
          <Text style={styles.botonFotoTexto}>Cambiar Foto</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Celular</Text>
          <Text style={styles.infoValue}>{user.celular}</Text>

          <Text style={styles.infoLabel}>Dirección</Text>
          <Text style={styles.infoValue}>{user.direccion}</Text>

          <Text style={styles.infoLabel}>Fecha de Nacimiento</Text>
          <Text style={styles.infoValue}>{user.fechaNac}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Text style={styles.botonCerrarTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonEliminar} onPress={eliminarCuenta}>
        <Text style={styles.botonEliminarTexto}>Eliminar Cuenta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalFondo} activeOpacity={1} onPress={cerrarModal}>
          <Animated.Image
            source={
              imagen
                ? { uri: imagen }
                : require('../assets/default-profile.png')
            }
            style={[styles.modalImagen, { transform: [{ scale: scaleAnim }] }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },

  header: {
    width: '100%',
    height: 250,
    backgroundColor: '#ccff34',
    position: 'relative',
  },

  headerTopRow: {
    position: 'absolute',
    top: 110,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  slogan: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 12,
  },

  headerLogo: {
    width: 100,
    height: 65,
  },

  iconTopLeft: {
    position: 'absolute',
    top: 60,
    left: 10,
    width: 90,
    height: 90,
  },

  iconBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: -30,
    width: 90,
    height: 90,
  },

  imageWrapper: {
    position: 'absolute',
    top: 180,
    overflow: 'hidden',
    elevation: 15,
  },

  foto: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },

  card: {
    marginTop: 100,
    width: '90%',
    backgroundColor: '#121212',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },

  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ccff34',
  },

  rol: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 15,
  },

  botonFoto: {
    backgroundColor: '#ccff34',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20,
  },

  botonFotoTexto: {
    color: '#000',
    fontWeight: 'bold',
  },

  infoBox: {
    width: '100%',
    marginTop: 10,
  },

  infoLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 10,
  },

  infoValue: {
    color: '#fff',
    fontSize: 15,
  },

  botonCerrar: {
    marginTop: 25,
    backgroundColor: '#ccff34',
    paddingVertical: 12,
    width: '90%',
    borderRadius: 30,
    alignItems: 'center',
  },

  botonCerrarTexto: {
    fontWeight: 'bold',
    color: '#000',
  },

  botonEliminar: {
    marginTop: 15,
    backgroundColor: '#222',
    paddingVertical: 12,
    width: '90%',
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccff34',
  },

  botonEliminarTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalImagen: {
    width: width - 40,
    height: width - 40,
    borderRadius: 20,
  },
});