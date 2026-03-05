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

const { width, height } = Dimensions.get('window');
const API_URL = 'https://app-somos-valientes-production.up.railway.app';

const BASE_HEIGHT = 950;
const scale = height / BASE_HEIGHT;

export default function PerfilScreen({ navigation }) {

  const [user, setUser] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await AsyncStorage.getItem('currentUser');
      if (data) {
        const parsedUser = JSON.parse(data);
        setUser(parsedUser);
        if (parsedUser.foto) setImagen(parsedUser.foto);
      }
    };
    cargarUsuario();
  }, []);

  // 📸 CAMBIAR FOTO
  const cambiarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const nuevaImagen = resultado.assets[0].uri;

      const updatedUser = { ...user, foto: nuevaImagen };

      setImagen(nuevaImagen);
      setUser(updatedUser);
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  // 🚪 CERRAR SESIÓN
  const cerrarSesion = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            navigation.replace('Welcome');
          }
        }
      ]
    );
  };

  // 🗑 ELIMINAR CUENTA
  const eliminarCuenta = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción no se puede deshacer. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`${API_URL}/api/usuarios/${user.celular}`, {
                method: 'DELETE',
              });

              await AsyncStorage.removeItem('currentUser');
              navigation.replace('Welcome');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la cuenta.');
            }
          }
        }
      ]
    );
  };

  // 🔥 ABRIR MODAL
  const abrirModal = () => {
    setModalVisible(true);
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  // 🔥 CERRAR MODAL
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

      {/* HEADER */}
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

        <TouchableOpacity style={styles.botonFoto} onPress={cambiarFoto}>
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

      {/* MODAL IMAGEN */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalFondo}
          activeOpacity={1}
          onPress={cerrarModal}
        >
          <Animated.Image
            source={
              imagen
                ? { uri: imagen }
                : require('../assets/default-profile.png')
            }
            style={[
              styles.modalImagen,
              { transform: [{ scale: scaleAnim }] }
            ]}
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
    height: 250 * scale,
    backgroundColor: '#ccff34',
    position: 'relative',
  },

  headerTopRow: {
    position: 'absolute',
    top: 110 * scale,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  slogan: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 12,
  },

  headerLogo: {
    width: 100 * scale,
    height: 65 * scale,
  },

  iconTopLeft: {
    position: 'absolute',
    top: 60 * scale,
    left: 10,
    width: 90 * scale,
    height: 90 * scale,
  },

  iconBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: -30,
    width: 90 * scale,
    height: 90 * scale,
  },

  imageWrapper: {
    position: 'absolute',
    top: 180 * scale,
  },

  foto: {
    width: 160 * scale,
    height: 160 * scale,
    borderRadius: (160 * scale) / 2,
  },

  card: {
    marginTop: 100 * scale,
    width: '90%',
    backgroundColor: '#121212',
    borderRadius: 25 * scale,
    padding: 25 * scale,
    alignItems: 'center',
  },

  nombre: {
    fontSize: 22 * scale,
    fontWeight: 'bold',
    color: '#ccff34',
  },

  rol: {
    fontSize: 14 * scale,
    color: '#aaa',
    marginBottom: 15 * scale,
  },

  botonFoto: {
    backgroundColor: '#ccff34',
    paddingVertical: 8 * scale,
    paddingHorizontal: 25 * scale,
    borderRadius: 20 * scale,
    marginBottom: 20 * scale,
  },

  botonFotoTexto: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14 * scale,
  },

  infoBox: {
    width: '100%',
    marginTop: 10 * scale,
  },

  infoLabel: {
    color: '#888',
    fontSize: 12 * scale,
    marginTop: 10 * scale,
  },

  infoValue: {
    color: '#fff',
    fontSize: 15 * scale,
  },

  botonCerrar: {
    marginTop: 25 * scale,
    backgroundColor: '#ccff34',
    paddingVertical: 12 * scale,
    width: '90%',
    borderRadius: 30 * scale,
    alignItems: 'center',
  },

  botonCerrarTexto: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 15 * scale,
  },

  botonEliminar: {
    marginTop: 15 * scale,
    backgroundColor: '#222',
    paddingVertical: 12 * scale,
    width: '90%',
    borderRadius: 30 * scale,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccff34',
  },

  botonEliminarTexto: {
    color: '#ccff34',
    fontWeight: 'bold',
    fontSize: 15 * scale,
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