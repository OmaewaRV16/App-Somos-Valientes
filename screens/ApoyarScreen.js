import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

// ✅ URL PRODUCCIÓN
const API_URL = "https://app-somos-valientes-production.up.railway.app";

export default function ApoyarScreen({ route }) {
  const { user } = route.params;
  const [participantes, setParticipantes] = useState([]);
  const [montos, setMontos] = useState({});

  useEffect(() => {
    const loadParticipantes = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/rol/participante`
        );
        if (!response.ok) throw new Error();

        const participantesData = await response.json();
        setParticipantes(participantesData);
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          'No se pudieron cargar los participantes'
        );
      }
    };

    loadParticipantes();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ===============================
          CONTENIDO REAL (DIFUMINADO)
          =============================== */}
      <View style={styles.disabledContent}>
        <FlatList
          contentContainerStyle={styles.container}
          data={participantes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.participante}>
              <Text style={styles.nombre}>
                {item.nombres} {item.apellidoP} {item.apellidoM}
              </Text>

              <TextInput
                placeholder="Monto de apoyo"
                placeholderTextColor="#aaa"
                style={styles.input}
                editable={false}
              />

              <View style={styles.fakeButton}>
                <Text style={styles.fakeButtonText}>Apoyar</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* ===============================
          OVERLAY DIFUMINADO (FAKE BLUR)
          👉 QUITAR ESTE BLOQUE DESPUÉS
          =============================== */}
      <View style={styles.overlay}>
        <View style={styles.overlayWash} />

        <View style={styles.overlayCard}>
          <Text style={styles.overlayTitle}>ESTARÁ ACTIVA</Text>
          <Text style={styles.overlaySubtitle}>PRÓXIMAMENTE</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  /* CONTENIDO DESACTIVADO */
  disabledContent: {
    flex: 1,
    opacity: 0.25, // 👈 baja contraste (efecto blur)
  },

  container: {
    padding: 20,
  },

  participante: {
    backgroundColor: '#ccff34',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  nombre: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },

  input: {
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#ccff34',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    color: '#ccff34',
  },

  fakeButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },

  fakeButtonText: {
    color: '#ccff34',
    fontWeight: 'bold',
  },

  /* ===============================
     OVERLAY FAKE BLUR
     =============================== */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgb(0, 0, 0)', // 👈 oscurece fuerte
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)', // 👈 efecto blur fake
  },

  overlayCard: {
    backgroundColor: '#000',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccff34',
    alignItems: 'center',
    zIndex: 10,
  },

  overlayTitle: {
    color: '#ccff34',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  overlaySubtitle: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: 2,
  },
});
