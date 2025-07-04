// App.jsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ContextProvider from './src/context/ContextProvider';
import AppContent from './src/AppContent';

export default function App() {
  return (
    <SafeAreaProvider>
      <ContextProvider>
        <AppContent />
      </ContextProvider>
    </SafeAreaProvider>
  );
}
