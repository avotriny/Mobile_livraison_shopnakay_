import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Button
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PendingDeliveriesScreen({ navigation }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Auth token manquant');
      }

      // ⚠️ Sur émulateur Android : 10.0.2.2, sur appareil réel : votre IP locale
      const baseURL = 'http://10.0.2.2:8000';
      const res = await axios.get(
        `${baseURL}/api/livraison`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Si res.data est une string, on la parse en JSON
      let data = res.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (parseErr) {
          console.error('Erreur parse JSON:', parseErr);
          throw new Error('Réponse API mal formée');
        }
      }

      console.log('🔍 API response (parsed):', data);
      if (!Array.isArray(data.commandes)) {
        console.warn('`data.commandes` n’est pas un tableau :', data.commandes);
      }

      // Normalisation des coordonnées
      const normalized = (data.commandes || []).map(o => ({
        ...o,
        latitude:  o.latitude  != null ? parseFloat(o.latitude)  : null,
        longitude: o.longitude != null ? parseFloat(o.longitude) : null,
      }));

      console.log('➡️ Normalized orders count:', normalized.length);
      setOrders(normalized);

    } catch (err) {
      console.error('❌ fetchOrders error:', err, err.response?.data);
      setError(err.response?.data?.error || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
        <Button title="Réessayer" onPress={fetchOrders} />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const hasCoords = item.latitude != null && item.longitude != null;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Commande #{item.id}</Text>
        <Text>Client : {item.nom}</Text>
        <Text>Total : {item.prix_total} Ar</Text>
        <Text>Adresse : {item.adresse}</Text>

        <Button
          title={hasCoords ? "Voir sur la carte" : "Pas de coords"}
          onPress={() => navigation.navigate('Map', { commande: item })}
          disabled={!hasCoords}
        />

        {!hasCoords && (
          <Text style={styles.noCoordsText}>
            Coordonnées non disponibles
          </Text>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={o => o.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={
        orders.length === 0
          ? { flex:1, justifyContent:'center', alignItems:'center' }
          : undefined
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          Aucune livraison à afficher.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  loader:        { flex:1, justifyContent:'center', alignItems:'center' },
  center:        { flex:1, justifyContent:'center', alignItems:'center', padding:16 },
  card:          { backgroundColor:'#fff', margin:8, padding:12, borderRadius:8, elevation:2 },
  title:         { fontSize:16, fontWeight:'600', marginBottom:4 },
  noCoordsText:  { color:'#888', fontStyle:'italic', marginTop:6 },
  emptyText:     { textAlign:'center', color:'#888', fontSize:16 },
  errorText:     { color:'red', fontSize:16, marginBottom:12, textAlign:'center' },
});
