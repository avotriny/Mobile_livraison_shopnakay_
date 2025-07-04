import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const ProfileScreen = ()=>  {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Profil Utilisateur</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenText: {
    fontSize: 20,
    fontWeight: '500',
  },
});
export default ProfileScreen;