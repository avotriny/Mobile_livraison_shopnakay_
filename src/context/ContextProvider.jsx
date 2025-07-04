// ContextProvider.jsx
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducer from './Reducer';

const initialState = {
  currentUser: null,
  loading: false,
  alert: { open: false, severity: 'info', message: '' },
};

const Context = createContext();
export const useValue = () => useContext(Context);

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Au démarrage, on récupère currentUser
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('currentUser');
        if (stored) {
          dispatch({ type: 'UPDATE_USER', payload: JSON.parse(stored) });
        }
      } catch (e) {
        console.error('Erreur lecture AsyncStorage:', e);
      }
    };
    loadUser();
  }, []);

  // À chaque changement de currentUser, on le sauvegarde
  useEffect(() => {
    const saveUser = async () => {
      try {
        if (state.currentUser) {
          await AsyncStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        } else {
          await AsyncStorage.removeItem('currentUser');
        }
      } catch (e) {
        console.error('Erreur écriture AsyncStorage:', e);
      }
    };
    saveUser();
  }, [state.currentUser]);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
