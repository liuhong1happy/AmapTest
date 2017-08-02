import React from 'react';
import { Provider } from 'react-redux';
import RouterApp from './router';
import store from './store/configureStore';
import './utils/Date';

const MainApp = () =>
  <Provider store={store} >
    <RouterApp />
  </Provider>;

export default MainApp;
