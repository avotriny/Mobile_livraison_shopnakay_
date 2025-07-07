import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Image, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CompletedDeliveriesScreen() {
  const navigation = useNavigation();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await axios.get('http://10.0.2.2:8000/api/livraisonFaite', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(res.data.commandes || []);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Livraison #{item.id}</Text>
      <Text style={styles.line}>Commande #{item.commande_id}</Text>
      <Text style={styles.line}>Client : {item.commande.nom}</Text>
      {item.images && <Image source={{ uri: item.images }} style={styles.image} />}
      {item.signature && <Text style={styles.line}>Signature enregistrée</Text>}
      <Text style={styles.date}>Le {new Date(item.created_at).toLocaleString()}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Voir détails"
          onPress={() => navigation.navigate('DeliveryDetail', { livraison: item })}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={deliveries}
      keyExtractor={d => d.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={deliveries.length === 0 && styles.centerEmpty}
      ListEmptyComponent={<Text style={styles.emptyText}>Aucune livraison effectuée.</Text>}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  line: { fontSize: 14, color: '#333', marginBottom: 4 },
  date: { fontSize: 12, color: '#666', marginTop: 4 },
  image: { width: '100%', height: 150, borderRadius: 6, marginVertical: 6 },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center' },
  centerEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonContainer: { marginTop: 8, alignSelf: 'flex-end' }
});