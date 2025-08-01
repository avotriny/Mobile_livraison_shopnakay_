import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import PendingDeliveriesScreen   from '../../screen/PendingDeliveriesScreen/PendingDeliveriesScreen';
import LivraisonFormScreen       from '../../screen/LivraisonFormScreen/LivraisonFormScreen';
import CompletedDeliveriesScreen from '../../screen/CompletedDeliveriesScreen/CompletedDeliveriesScreen';
import DeliveryDetailScreen      from '../../screen/DeliveryDetailScreen/DeliveryDetailScreen';
import MapScreen                 from '../../screen/MapScreen/MapScreen';
import ProfileScreen             from '../../screen/ProfileScreen/ProfileScreen';
import OrdersScreen from '../../screen/OrdersScreen/OrdersScreen';
import CustomHeader from '../Header/CustomHeader';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function DeliveryStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, scene, previous }) => ({
        header: () => (
          <CustomHeader
            navigation={navigation}
            scene={scene}
            previous={previous}
          />
        ),
      })}
    >
      <Stack.Screen
        name="PendingDeliveries"
        component={PendingDeliveriesScreen}
        options={{ title: 'À faire' }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Localisation client' }}
      />
      <Stack.Screen
        name="LivraisonForm"
        component={LivraisonFormScreen}
        options={{ title: 'Faire la livraison' }}
      />
    </Stack.Navigator>
  );
}

// Stack pour “Livrées”
function CompletedStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, scene, previous }) => ({
        header: () => (
          <CustomHeader
            navigation={navigation}
            scene={scene}
            previous={previous}
          />
        ),
      })}
    >
      <Stack.Screen
        name="CompletedDeliveries"
        component={CompletedDeliveriesScreen}
        options={{ title: 'Livrées' }}
      />
      <Stack.Screen
        name="DeliveryDetail"
        component={DeliveryDetailScreen}
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
            const icons = {
              Commandes:      'cart-outline',
              'À faire':      'truck-delivery-outline',
              Livrées:        'check-decagram-outline',
              Profile:        'account-circle-outline',
            };
            return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
          },
          tabBarActiveTintColor:   '#228B22',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel:         false,
        })}
      >
        <Tab.Screen
          name="Commandes"
          component={OrdersScreen}
        />

        <Tab.Screen
          name="À faire"
          component={DeliveryStack}
          options={{ headerShown: false }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              // Empêche le comportement par défaut
              e.preventDefault();
              // Réinitialise vers l'écran PendingDeliveries
              navigation.navigate('À faire', {
                screen: 'PendingDeliveries'
              });
            },
          })}
        />

        <Tab.Screen
          name="Livrées"
          component={CompletedStack}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}