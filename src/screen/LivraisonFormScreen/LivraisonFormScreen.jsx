import React, { useState, useRef } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Signature from 'react-native-signature-canvas';

const LivraisonSchema = Yup.object().shape({
  images: Yup.mixed()
    .nullable()
    .test('fileSize', 'Image trop volumineuse (<2MB)', value => !value || value.fileSize <= 2048 * 1024)
    .test('fileType', 'Format invalide (jpeg/png/jpg)', value => !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)),
  signature: Yup.string()
    .required('Signature requise')
    .matches(/^data:image\/\w+;base64,/, 'Signature invalide'),
});

export default function LivraisonFormScreen({ route, navigation }) {
  const { commande } = route.params;
  const [previewImage, setPreviewImage] = useState(null);
  const sigRef = useRef();

  const pickImage = async (setFieldValue) => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', includeBase64: false });
      if (result?.assets?.length) {
        const asset = result.assets[0];
        setPreviewImage(asset.uri);
        setFieldValue('images', {
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
          fileSize: asset.fileSize,
        });
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sélectionner l’image');
    }
  };

  const resetSignature = (setFieldValue) => {
    sigRef.current?.clearSignature();
    setFieldValue('signature', '');
  };


  const submitLivraison = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('commande_id', String(commande.id));
    if (values.images) {
      formData.append('images', {
        uri: values.images.uri,
        name: values.images.name,
        type: values.images.type,
      });
    }
    formData.append('signature', values.signature);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(
        'http://10.0.2.2:8000/api/livraisonFaite',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Alert.alert('Succès', 'Livraison enregistrée');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.error || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Commande #{commande.id}</Text>
      <Formik
        initialValues={{ images: null, signature: '' }}
        validationSchema={LivraisonSchema}
        onSubmit={submitLivraison}
      >
        {({ handleSubmit, setFieldValue, setFieldTouched, values, errors, touched, isSubmitting }) => (
          <View>
            <View style={styles.imagePicker}>
              {previewImage ? (
                <Image source={{ uri: previewImage }} style={styles.imagePreview} />
              ) : (
                <Button title="Ajouter une preuve photo" onPress={() => pickImage(setFieldValue)} />
              )}
            </View>
            {errors.images && touched.images && <Text style={styles.error}>{errors.images}</Text>}


            <Text style={styles.label}>Signature :</Text>
            <View style={styles.sigWrapper}>
              <Signature
                ref={sigRef}
                onOK={(sig) => {
                  setFieldValue('signature', sig);
                  setFieldTouched('signature', true);
                }}
                onEmpty={() => Alert.alert('Veuillez signer et valider')}
                descriptionText="Signez ici"
                clearText="Effacer"
                confirmText="Valider"
                webStyle={stylePad}
                autoClear={false}
                style={{ flex: 1 }}
              />
            </View>
            <View style={styles.signatureButtons}>
              <Button title="Effacer" onPress={() => resetSignature(setFieldValue)} />
            </View>
            {errors.signature && touched.signature && <Text style={styles.error}>{errors.signature}</Text>}

            <Button
              title={isSubmitting ? 'Envoi...' : 'Valider la livraison'}
              onPress={() => {
                sigRef.current?.readSignature();
                handleSubmit();
              }}
              disabled={isSubmitting}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const stylePad = `
  .m-signature-pad { box-shadow: none; border: none; }
  .m-signature-pad--footer { display: flex; }
  body,html { width: 100%; height: 100%; }
`;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  imagePicker: { height: 150, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  imagePreview: { width: '100%', height: '100%', borderRadius: 6 },
  label: { fontSize: 16, marginBottom: 4 },
  sigWrapper: { height: 200, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
  signatureButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
  error: { color: '#e74c3c', marginBottom: 8 },
});
