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

export default function ApoyarScreen({ route }) {
  const { user } = route.params;
  const [participantes, setParticipantes] = useState([]);
  const [montos, setMontos] = useState({});

  useEffect(() => {
    const loadParticipantes = async () => {
      try {
        const response = await fetch('http://192.168.2.205:3000/api/users/rol/participante');
        const participantesData = await response.json();
        setParticipantes(participantesData);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'No se pudieron cargar los participantes');
      }
    };

    loadParticipantes();
  }, []);

  const handleApoyar = async (participante) => {
    const monto = montos[participante._id];
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    try {
      await fetch("http://192.168.2.205:3000/api/apoyos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          padrino: user._id,                      // quien dona
          participante: participante._id,          // quien recibe
          monto: Number(monto)
        })
      });

      Alert.alert('Éxito', `Has apoyado a ${participante.nombres} con $${monto}`);
      setMontos(prev => ({ ...prev, [participante._id]: '' }));

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo registrar el apoyo");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.container}
        data={participantes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.participante}>
            <Text style={styles.nombre}>{item.nombres} {item.apellidoP} {item.apellidoM}</Text>

            <TextInput
              placeholder="Monto de apoyo"
              placeholderTextColor="#ccff34"
              keyboardType="numeric"
              style={styles.input}
              value={montos[item._id]}
              onChangeText={text =>
                setMontos(prev => ({ ...prev, [item._id]: text }))
              }
            />

            <TouchableOpacity style={styles.boton} onPress={() => handleApoyar(item)}>
              <Text style={styles.botonTexto}>Apoyar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  container: {
    padding: 20,
  },
  participante:{
    backgroundColor:'#ccff34',
    padding:15,
    borderRadius:8,
    marginBottom:15,
    shadowColor:'#000',
    shadowOpacity:0.1,
    shadowRadius:5,
    elevation:3,
  },
  nombre:{
    textAlign: 'center',
    fontSize:16,
    fontWeight:'bold',
    marginBottom:5,
    color: '#000000ff'
  },
  input:{
    backgroundColor: 'black',
    borderWidth:2,
    borderColor:'#ccff34',
    borderRadius:5,
    padding:8,
    marginBottom:10,
  },
  boton:{
    backgroundColor:'#000000ff',
    padding:10,
    borderRadius:5,
    width: 200,
    alignItems:'center',
    textAlign: 'center',
    margin: 'auto'
  },
  botonTexto:{
    color:'#ccff34',
    fontWeight:'bold',
  },
});
