import React, { useRef } from 'react';
import { StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

export default function MapScreen({ route, navigation }) {
  const { commande } = route.params;
  const lat = parseFloat(commande.latitude);
  const lng = parseFloat(commande.longitude);
  const mapRef = useRef(null);

  // recentre à chaque focus
  React.useEffect(() => {
    if (mapRef.current && !isNaN(lat) && !isNaN(lng)) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    }
  }, [lat, lng]);

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <View style={styles.center}>
        <Text>Coordonnées non disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        showsUserLocation
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} pinColor="#228B22">
          <Callout tooltip onPress={() => navigation.navigate('LivraisonForm', { commande })}>
            <View style={styles.callout}>
              <Text style={styles.title}>Commande #{commande.id}</Text>
              <Text>Client : {commande.nom}</Text>
              <Text>Total : {commande.prix_total} Ar</Text>
              <Text>Adresse : {commande.adresse}</Text>
              <Button title="Livraison" onPress={() => navigation.goBack()} />
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1 },
  center:        { flex:1, justifyContent:'center', alignItems:'center' },
  map:           { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  callout:       { backgroundColor:'white', padding:8, borderRadius:6, width:220 },
  title:         { fontWeight:'600', marginBottom:4 },
});