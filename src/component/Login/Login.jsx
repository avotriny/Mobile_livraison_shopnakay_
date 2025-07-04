import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useValue } from '../../context/ContextProvider';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string()
    .min(6, '6 caractères minimum')
    .required('Mot de passe requis'),
});

export default function Login() {
  const { dispatch } = useValue();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    dispatch({ type: 'START_LOADING' });

    try {
      // Remplace par l'URL de ton API
      const API_URL = 'http://10.0.2.2:8000/api'; 
      const payload = {
        login: values.email,    // côté backend, tu acceptes 'login' (email OU name)
        password: values.password,
      };

      const { data } = await axios.post(`${API_URL}/login`, payload);

      if (data.success) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
        dispatch({ type: 'UPDATE_USER', payload: data.user });
      } else {
        dispatch({
          type: 'UPDATE_ALERT',
          payload: { open: true, severity: 'error', message: data.message }
        });
      }
    } catch (err) {
      console.error('Login error', err);
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: err.response?.data?.message || 'Erreur réseau'
        }
      });
    } finally {
      dispatch({ type: 'END_LOADING' });
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <Image
              style={styles.logo}
              source={require('../../../assets/images/shopnakay.jpg')}
            />

            <Text style={styles.title}>Connexion</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && errors.email ? styles.inputError : null
              ]}
              placeholder="exemple@domaine.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={[styles.label, { marginTop: 16 }]}>Mot de passe</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[
                  styles.input,
                  touched.password && errors.password ? styles.inputError : null,
                  { paddingRight: 40 }
                ]}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(v => !v)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    alignItems: 'center'
  },
  logo: {
    width: 60, height: 60,
    borderWidth: 1, borderColor: '#3498db',
    borderRadius: 30, marginBottom: 12
  },
  title: {
    fontSize: 20, marginBottom: 16,
    textAlign: 'center', fontWeight: '600'
  },
  label: {
    alignSelf: 'flex-start', fontSize: 14, fontWeight: '600',
    marginBottom: 4, color: '#333'
  },
  input: {
    width: '100%', height: 44,
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, paddingHorizontal: 12,
    backgroundColor: '#f9f9f9'
  },
  inputError: {
    borderColor: '#e74c3c'
  },
  errorText: {
    color: '#e74c3c', fontSize: 12,
    alignSelf: 'flex-start', marginTop: 4
  },
  passwordWrapper: {
    width: '100%', marginTop: 4,
    position: 'relative'
  },
  eyeButton: {
    position: 'absolute', right: 12,
    top: '50%', marginTop: -12,
    height: 24, width: 24,
    justifyContent: 'center', alignItems: 'center'
  },
  button: {
    marginTop: 24, width: '100%',
    height: 48,
    backgroundColor: '#228B22',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff', fontSize: 16,
    fontWeight: '600'
  }
});
