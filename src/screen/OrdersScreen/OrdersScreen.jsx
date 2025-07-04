import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrdersScreen() {
  const [lines, setLines] = useState([]);       // liste plate des lignes de commande
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Utilisateur non authentifié');

      const res = await axios.get(
        'http://10.0.2.2:8000/api/commande',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //1️⃣ Récupère la page courante de commandes
      const allOrders = res.data.commandes.data;

      //2️⃣ Aplatit en "lignes" en gardant la commande parente
      const allLines = allOrders.flatMap(order =>
        order.lignes.map(line => ({
          ...line,
          // données de la commande
          orderId:       order.id,
          clientNom:     order.nom,
          clientEmail:   order.email,
          orderStatus:   order.status,
          orderDate:     order.created_at,
          orderTotal:    order.prix_total,
        }))
      );

      setLines(allLines);

      //3️⃣ Extraction des catégories uniques
      const cats = Array.from(new Set(
        allLines.map(l => l.produit.subcategorie.name_categorie)
      ));
      setCategories(['All', ...cats]);
    } catch (err) {
      console.error('Error loading orders', err);
      Alert.alert('Erreur', 'Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  // Filtrage par catégorie
  const filtered = selectedCat === 'All'
    ? lines
    : lines.filter(l => l.produit.subcategorie.name_categorie === selectedCat);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: `http://10.0.2.2:8000/${item.produit.images}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.produit.nom_prod}</Text>
        <Text style={styles.detail}>
          Qté: {item.quantite} • L.<Text style={{fontWeight:'600'}}>€{item.prix_unitaire}</Text>
        </Text>
        <Text style={styles.detail}>Total Ligne: €{(item.quantite * item.prix_unitaire).toFixed(2)}</Text>
        <Text style={styles.detail}>Commande #{item.orderId} • {new Date(item.orderDate).toLocaleDateString()}</Text>
        <Text style={styles.detail}>Client: {item.clientNom}</Text>
        <Text style={styles.detail}>Statut: {item.orderStatus}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtre par catégorie */}
      <View style={styles.filter}>
        <Text style={styles.filterLabel}>Catégorie :</Text>
        <Picker
          selectedValue={selectedCat}
          style={styles.picker}
          onValueChange={setSelectedCat}
        >
          {categories.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {/* Liste des lignes de commande */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune commande.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  loader:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filter:    { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  filterLabel: { fontWeight: '600', marginRight: 8 },
  picker:    { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 8 },
  list:      { paddingBottom: 16 },
  card:      { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 8, borderRadius: 12, overflow: 'hidden', elevation: 2 },
  image:     { width: 100, height: 100 },
  info:      { flex: 1, padding: 8, justifyContent: 'space-between' },
  name:      { fontSize: 16, fontWeight: '600' },
  detail:    { fontSize: 13, color: '#555' },
  empty:     { flex: 1, alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888' },
});
