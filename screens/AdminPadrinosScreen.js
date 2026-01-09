import React, { useEffect, useState, useCallback } from 'react';
import { 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  Alert, 
  RefreshControl,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminPadrinosScreen({ navigation }) {
  const [padrinos, setPadrinos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPadrinos = useCallback(async () => {
    try {
      const resp = await fetch('http://192.168.2.205:3000/api/users'); 
      const data = await resp.json();
      if (!resp.ok) {
        Alert.alert('Error', data.message || 'No se pudieron cargar los padrinos');
        return;
      }
      const filtrados = data.filter(u => u.rol === 'padrino');
      setPadrinos(filtrados);
      setFiltered(filtrados);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar los padrinos. Revisa tu backend.');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadPadrinos();
      setLoading(false);
    };
    init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPadrinos();
    setRefreshing(false);
  };

  const verDetalle = (item) => {
    navigation.navigate('DetallePadrino', { padrino: item });
  };

  // ✅ Filtrar al escribir
  const buscar = (text) => {
    setSearch(text);
    const match = padrinos.filter(p =>
      `${p.nombres} ${p.apellidoP} ${p.apellidoM}`
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFiltered(match);
  };

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#000' }}>
        <ActivityIndicator size="large" color="#ccff34" />
        <Text style={{ color:'#ccff34', marginTop:5 }}>Cargando padrinos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ✅ Barra de búsqueda */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar padrino..."
          placeholderTextColor="#9aa09f"
          value={search}
          onChangeText={buscar}
        />
      </View>

      <FlatList
        contentContainerStyle={styles.container}
        data={filtered}
        keyExtractor={(item) => item.celular}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#ccff34"
            colors={['#ccff34']}
          />
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.accion} onPress={() => verDetalle(item)}>
            <Text style={styles.titulo}>
              {index + 1}. {item.nombres} {item.apellidoP} {item.apellidoM}
            </Text>
            <View style={styles.resaltaContainer}>
              <Text style={styles.subtitulo}>Selecciona para saber más</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { padding: 30, paddingBottom: 100 },

  // ✅ Barra de búsqueda
  searchBox: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: '#000'
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderColor: '#ccff34',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#ccff34',
  },

  accion: {
    backgroundColor: '#ccff34',
    padding: 25,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  titulo: { fontSize: 25, fontWeight: 'bold', marginBottom: 5 },
  resaltaContainer: {
    backgroundColor: '#00000071',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  subtitulo: { 
    fontSize: 14, 
    color: '#000000',
    fontWeight: 'bold',
  },
});
