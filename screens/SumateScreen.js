import React, { useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SumateScreen({ navigation, route }) {
  const { user } = route.params || {};
  const scrollY = useRef(new Animated.Value(0)).current;

  const Card = ({ title, description, buttonText, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>

        {/* ICONO SUPERIOR DERECHO */}
        <Image
          source={require('../assets/Formas-Color-Verde_03.png')}
          style={styles.iconTopRight}
          resizeMode="contain"
        />

        {/* ICONO INFERIOR DERECHO */}
        <Image
          source={require('../assets/Formas-Color-Verde_05.png')}
          style={styles.iconBottomRight}
          resizeMode="contain"
        />

        <Text style={styles.cardTitle}>{title}</Text>

        <Text style={styles.cardDescription}>
          {description}
        </Text>

        <View style={styles.cardButton}>
          <Text style={styles.cardButtonText}>{buttonText}</Text>
        </View>

      </View>

      <View style={styles.greenLine} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
        indicatorStyle="white"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >

        <Text style={styles.mainTitle}>
          En Sociedad Valiente te puedes sumar de muchas maneras
        </Text>

        <Text style={styles.subTitle}>
          Cada acción fortalece nuestra comunidad.
        </Text>

        {/* CARD 1 */}
        <Card
          title="¿Tienes un negocio o servicio?"
          description="Forma parte como aportante de Sociedad Valiente y conecta tu negocio con miles de personas que creen en ayudarse mutuamente."
          buttonText="Quiero ser aportante"
          onPress={() =>
            navigation.navigate('SerAportanteScreen', { user })
          }
        />

        {/* CARD 2 */}
        <Card
          title="¿Quieres apoyar con difusión?"
          description="Apóyanos colocando una barda o lona y ayúdanos a llevar el mensaje de Sociedad Valiente a más colonias y comunidades."
          buttonText="Apoyar difusión"
          onPress={() =>
            navigation.navigate('DifusionScreen', { user })
          }
        />

        {/* CARD 3 */}
        <Card
          title="Tu opinión es importante"
          description="Comparte tus ideas, sugerencias o mensajes para seguir fortaleciendo Sociedad Valiente y construir juntos una comunidad más unida."
          buttonText="Enviar mensaje"
          onPress={() =>
            navigation.navigate('EnviarOpinionScreen', { user })
          }
        />

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ccff34',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },

  subTitle: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginBottom: 35,
  },

  cardWrapper: {
    marginBottom: 30,
    borderRadius: 22,
    overflow: 'hidden',
  },

  card: {
    backgroundColor: '#121212',
    padding: 28,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    position: 'relative',
    height: 240,
    justifyContent: 'space-between',
  },

  greenLine: {
    height: 2,
    backgroundColor: '#ccff34',
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#ccff34',
    marginBottom: 14,
    paddingRight: 70,
  },

  cardDescription: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 20,
  },

  cardButton: {
    backgroundColor: '#ccff34',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  cardButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },

  iconTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 65,
    height: 65,
  },

  iconBottomRight: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 80,
    height: 80,
  },
});