// src/AppContent.jsx
import React from 'react';
import { Fragment } from 'react';
import { useValue } from './context/ContextProvider';
import Loading from './component/Loading/Loading';
import Login from './component/Login/Login';
import MainApp from './component/MainApp/MainApp';
import Notification from './component/Notification/Notification';

export default function AppContent() {
  const { state: { loading, currentUser } } = useValue();

  return (
    <Fragment>
      {/* Toujours rendre Notification */}
      <Notification />

      {/* Si on charge, on affiche Loading */}
      {loading && <Loading />}

      {/* Si pas de user et pas en train de charger, on affiche la page de login */}
      {!loading && !currentUser && <Login />}

      {/* Si user connecté, on affiche l’app principale */}
      {!loading && currentUser && <MainApp />}
    </Fragment>
  );
}
