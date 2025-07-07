// DeliveryDetailScreen.jsx (Écran de détail)
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function DeliveryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { livraison } = route.params;

  return (
    <View style={styles.wrapper}>
      {/* Header with back arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails livraison</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Livraison #{livraison.id}</Text>
        <Text style={styles.subTitle}>Commande #{livraison.commande_id} - Client : {livraison.commande.nom}</Text>
        {livraison.images && <Image source={{ uri: livraison.images }} style={styles.image} />}
        {livraison.signature && (
          <Image source={{ uri: `http://10.0.2.2:8000/storage/${livraison.signature}` }} style={styles.image} />
        )}
        <Text style={styles.date}>Le {new Date(livraison.created_at).toLocaleString()}</Text>

        {/* Liste des lignes de commande */}
        <Text style={styles.sectionTitle}>Détails des produits</Text>
        {livraison.commande.lignes.map((ligne) => (
          <View key={ligne.id} style={styles.lineItem}>
            <Text style={styles.lineText}>{ligne.produit.nom_prod}</Text>
            <Text style={styles.lineText}>Quantité: {ligne.quantite}</Text>
            <Text style={styles.lineText}>Prix unitaire: {ligne.prix_unitaire} Ar</Text>
            <Text style={styles.lineText}>Total: {(ligne.quantite * parseFloat(ligne.prix_unitaire)).toFixed(2)} Ar</Text>
          </View>
        ))}

        <Text style={styles.total}>Prix total: {livraison.commande.prix_total} Ar</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  subTitle: { fontSize: 16, marginBottom: 12 },
  date: { fontSize: 14, color: '#666', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  lineItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  lineText: { fontSize: 14, marginBottom: 4 },
  total: { fontSize: 16, fontWeight: '600', textAlign: 'right', marginTop: 12 },
  image: { width: '100%', height: 200, borderRadius: 6, marginVertical: 8 }
});
