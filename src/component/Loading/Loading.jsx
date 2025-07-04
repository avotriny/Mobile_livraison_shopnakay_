import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useValue } from '../../context/ContextProvider';

const Loading = () => {
  const { state: { loading } } = useValue();

  // 1) Si on n'est pas en train de charger, on ne rend rien
  if (!loading) return null;

  // 2) Sinon on renvoie bien du JSX
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // plein écran
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // optionnel : overlay
  }
});

export default Loading;
