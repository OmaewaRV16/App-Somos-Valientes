// crearAdmin.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const crearAdmin = async () => {
  try {
    const usersData = await AsyncStorage.getItem('users');

    let users = [];

    if (usersData) {
      try {
        users = JSON.parse(usersData);
        if (!Array.isArray(users)) {
          users = [];
        }
      } catch (e) {
        // Si el JSON está corrupto, lo reiniciamos
        users = [];
      }
    }

    const existeAdmin = users.some(u => u?.rol === 'admin');

    if (!existeAdmin) {
      const admin = {
        nombre: 'Administrador',
        apellidoP: 'Sistema',
        apellidoM: '',
        celular: '9993292792',
        password: 'admin123',
        rol: 'admin',
        direccion: '',
        fechaNac: '2000-01-01',
      };

      users.push(admin);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('Admin creado exitosamente');
    }
  } catch (error) {
    // 👇 Nunca lanzar error, solo log
    console.log('Error al crear admin:', error);
  }
};
