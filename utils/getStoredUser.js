import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStoredUser = async () => {
  try {
    const data = await AsyncStorage.getItem('currentUser');
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};
