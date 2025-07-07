import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PendingDeliveriesScreen({ navigation }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res   = await axios.get('http://10.0.2.2:8000/api/livraison', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.commandes);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const totalQty = item.lignes.reduce((sum, l) => sum + l.quantite, 0);
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('OrderDetail', { id: item.id })}
        >
          <Text style={styles.title}>Commande #{item.id}</Text>
          <Text style={styles.line}>Client : {item.nom}</Text>
          <Text style={styles.line}>Qté totale : {totalQty}</Text>
          <Text style={styles.line}>Total : {item.prix_total} Ar</Text>
          <Text style={styles.line}>Adresse : {item.adresse}</Text>
          <Text style={[styles.line, styles.status]}>{item.status}</Text>
        </TouchableOpacity>

        {item.status !== 'livré' && (
          <View style={styles.buttonContainer}>
            <Button
              title="Faire la livraison"
              onPress={() => navigation.navigate('LivraisonForm', { commande: item })}
            />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={o => o.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<Text style={styles.emptyText}>Aucune commande disponible.</Text>}
      contentContainerStyle={orders.length === 0 && { flex: 1, justifyContent: 'center' }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loader:    { flex:1, justifyContent:'center', alignItems:'center' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  cardContent: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  line: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  status: {
    color: '#e67e22',
    fontWeight: '500',
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
