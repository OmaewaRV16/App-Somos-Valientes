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

// ✅ URL PRODUCCIÓN
const API_URL = "https://app-somos-valientes-production.up.railway.app";

export default function AdminParticipantesScreen({ navigation }) {
  const [participantes, setParticipantes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadParticipantes = useCallback(async () => {
    try {
      const resp = await fetch(`${API_URL}/api/users`);
      if (!resp.ok) throw new Error();

      const data = await resp.json();
      const filtrados = data.filter(u => u.rol === 'participante');

      setParticipantes(filtrados);
      setFiltered(filtrados);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los participantes. Intenta más tarde.'
      );
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadParticipantes();
      setLoading(false);
    };
    init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadParticipantes();
    setRefreshing(false);
  };

  const verDetalle = (item) => {
    navigation
      .getParent()
      ?.navigate('DetalleParticipante', { participante: item });
  };

  // 🔎 Buscar participante
  const buscar = (text) => {
    setSearch(text);
    const filtro = participantes.filter(p =>
      `${p.nombres} ${p.apellidoP} ${p.apellidoM}`
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFiltered(filtro);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ccff34" />
        <Text style={styles.loadingText}>
          Cargando participantes...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Barra de búsqueda */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar participante..."
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay participantes coincidentes
          </Text>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.accion}
            onPress={() => verDetalle(item)}
          >
            <Text style={styles.titulo}>
              {index + 1}. {item.nombres} {item.apellidoP} {item.apellidoM}
            </Text>
            <View style={styles.resaltaContainer}>
              <Text style={styles.subtitulo}>
                Selecciona para saber más
              </Text>
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

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  loadingText: {
    color: '#ccff34',
    marginTop: 8
  },

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
    color: '#ccff34',
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
