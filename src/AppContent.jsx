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
      <Notification />

      {loading && <Loading />}

      {!loading && !currentUser && <Login />}

      {!loading && currentUser && <MainApp />}
    </Fragment>
  );
}
