// crearAdmin.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const crearAdmin = async () => {
  try {
    const usersData = await AsyncStorage.getItem('users');
    let users = usersData ? JSON.parse(usersData) : [];

    // Revisar si ya existe un admin
    const existeAdmin = users.some(u => u.rol === 'admin');
    if (!existeAdmin) {
      const admin = {
        nombre: 'Administrador',
        apellidoP: 'Sistema',
        apellidoM: '',
        celular: '9993292792', // solo 10 dígitos
        password: 'admin123',
        rol: 'admin',
        direccion: '',
        fechaNac: '2000-01-01',
      };
      users.push(admin);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('Admin creado exitosamente');
    } else {
      console.log('Ya existe un admin');
    }
  } catch (error) {
    console.log('Error al crear admin:', error);
  }
};
