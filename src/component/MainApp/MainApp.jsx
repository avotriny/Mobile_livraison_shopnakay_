// MainApp.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductsScreen from '../../screen/ProduitScreen/ProduitScreen';
import OrdersScreen from '../../screen/OrdersScreen/OrdersScreen';
import PendingDeliveriesScreen from '../../screen/PendingDeliveriesScreen/PendingDeliveriesScreen';
import CompletedDeliveriesScreen from '../../screen/CompletedDeliveriesScreen/CompletedDeliveriesScreen';
import LivraisonFormScreen from '../../screen/LivraisonFormScreen/LivraisonFormScreen';
import ProfileScreen from '../../screen/ProfileScreen/ProfileScreen';
import MapScreen from '../../screen/MapScreen/MapScreen';
import CustomHeader from '../Header/CustomHeader';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for pending deliveries flow
function DeliveryStack() {
  return (
    <Stack.Navigator screenOptions={{ header: () => <CustomHeader /> }}>
      <Stack.Screen
        name="PendingDeliveries"
        component={PendingDeliveriesScreen}
        options={{ title: 'À faire' }}
      />
      <Stack.Screen
        name="LivraisonForm"
        component={LivraisonFormScreen}
        options={{ title: 'Faire la livraison' }}
      />
    </Stack.Navigator>
  );
}

// Stack for completed deliveries (Livrées)
function CompletedStack() {
  return (
    <Stack.Navigator screenOptions={{ header: () => <CustomHeader /> }}>
      <Stack.Screen
        name="CompletedDeliveries"
        component={CompletedDeliveriesScreen}
        options={{ title: 'Livrées' }}
      />
      <Stack.Screen
        name="LivraisonForm"
        component={LivraisonFormScreen}
        options={{ title: 'Détails livraison' }}
      />
    </Stack.Navigator>
  );
}

export default function MainApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />, 
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Produits') iconName = 'cube-outline';
            else if (route.name === 'Commandes') iconName = 'cart-outline';
            else if (route.name === 'À faire') iconName = 'truck-delivery-outline';
            else if (route.name === 'Livrées') iconName = 'check-decagram-outline';
            else if (route.name === 'Map') iconName = 'map-outline';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#228B22',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { paddingHorizontal: 20 },
          tabBarItemStyle: { marginHorizontal: 15 },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Produits" component={ProductsScreen} />
        <Tab.Screen name="Commandes" component={OrdersScreen} />
        <Tab.Screen
          name="À faire"
          component={DeliveryStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Livrées"
          component={CompletedStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
