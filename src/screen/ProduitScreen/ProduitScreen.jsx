// src/component/ProductsScreen/ProductsScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);          // pour le filtre
  const [selectedCat, setSelectedCat] = useState('All');     // “All” par défaut
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch produits
        const res = await axios.get('http://10.0.2.2:8000/api/produit');
        const allProds = res.data.produit;

        // 2. Extraire catégories uniques
        const uniqueCats = Array.from(
          new Set(allProds.map(p => p.subcategorie.name_categorie))
        );
        
        setCategories(['All', ...uniqueCats]);
        setProducts(allProds);
      } catch (err) {
        console.error('Error loading products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtrer la liste selon selectedCat
  const filtered = selectedCat === 'All'
    ? products
    : products.filter(p => p.subcategorie.name_categorie === selectedCat);

  // Rendu d’un item
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: `http://10.0.2.2:8000/${item.images}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nom_prod}</Text>
        <Text style={styles.price}>{item.prix_prod} Ar</Text>
        <Text style={styles.cat}>{item.subcategorie.name_categorie}</Text>
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
          onValueChange={value => setSelectedCat(value)}
        >
          {categories.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {/* Liste des produits */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={2}                 // deux colonnes pour un rendu grille
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    fontWeight: '600',
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
  },

  list: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3, // Android shadow
  },
  image: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#228B22',
    marginBottom: 2,
  },
  cat: {
    fontSize: 12,
    color: '#666',
  },
});
