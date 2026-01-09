import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, RadioButton, HelperText } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }) {
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [nombres, setNombres] = useState('');
  const [fechaNac, setFechaNac] = useState('');
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('participante');

  const insets = useSafeAreaInsets();

  const formatFecha = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    let formatted = cleaned;

    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + "-" + cleaned.slice(2);
    if (cleaned.length > 4) formatted = cleaned.slice(0, 2) + "-" + cleaned.slice(2, 4) + "-" + cleaned.slice(4);

    setFechaNac(formatted);
  };

  const formatCelular = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 10);
    setCelular(numbers);
  };

  const handleRegister = async () => {
    if (!apellidoP || !apellidoM || !nombres || !fechaNac || !direccion || !celular || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (celular.length < 10) {
      Alert.alert('Error', 'El número celular debe tener 10 dígitos');
      return;
    }

    try {
      const response = await fetch("http://192.168.2.205:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apellidoP,
          apellidoM,
          nombres,
          fechaNac,
          direccion,
          celular,
          password,
          rol,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "No se pudo registrar");
        return;
      }

      const codigo = data.codigo;
      navigation.navigate("VerificarScreen", { celular, codigo });

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  const getPasswordStrength = (pass) => {
    if (pass.length < 6) return 'Mala';
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.length >= 8) return 'Buena';
    return 'Media';
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#000', '#1a1a1a', '#000']}
        style={styles.background}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
        >
          <View style={styles.formCard}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <TextInput mode="outlined" label="Apellido Paterno" value={apellidoP} onChangeText={setApellidoP} style={styles.input} />
            <TextInput mode="outlined" label="Apellido Materno" value={apellidoM} onChangeText={setApellidoM} style={styles.input} />
            <TextInput mode="outlined" label="Nombres" value={nombres} onChangeText={setNombres} style={styles.input} />

            <TextInput
              mode="outlined"
              label="Fecha de Nacimiento (DD-MM-YYYY)"
              value={fechaNac}
              onChangeText={formatFecha}
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
            />

            <TextInput mode="outlined" label="Dirección" value={direccion} onChangeText={setDireccion} style={styles.input} />

            <TextInput
              mode="outlined"
              label="Celular"
              value={celular}
              onChangeText={formatCelular}
              keyboardType="phone-pad"
              maxLength={10}
              left={<TextInput.Affix text="+52" />}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <HelperText type={getPasswordStrength(password) === 'Mala' ? 'error' : 'info'}>
              {password ? `Contraseña ${getPasswordStrength(password)}` : ''}
            </HelperText>

            <TextInput
              mode="outlined"
              label="Confirmar Contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />

            <Text style={styles.label}>Soy:</Text>
            <RadioButton.Group onValueChange={setRol} value={rol}>
              <View style={styles.radioRow}>
                <RadioButton value="participante" color="#000" />
                <Text>Participante</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="padrino" color="#000" />
                <Text>Padrino</Text>
              </View>
            </RadioButton.Group>

            <Button mode="contained" onPress={handleRegister} style={styles.button} labelStyle={styles.buttonLabel}>
              Registrarse
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    padding: 30,
    flexGrow: 1,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#ccff34',
    padding: 30,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#ccff34',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  label: { fontSize: 16, marginVertical: 12, fontWeight: 'bold' },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  button: {
    marginTop: 25,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 8,
  },
  buttonLabel: { color: '#ccff34', fontWeight: 'bold', fontSize: 16 },
});
