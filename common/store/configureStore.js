import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';

import rootReducer from '../reducers';
import { RouteHistory, SceneConfigs } from '../components/base/react-native-router';

const logger = createLogger();
let createStoreWithMiddleware;

if (process.env.NODE_ENV === "development") {
  createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
}

const store = createStoreWithMiddleware(rootReducer, undefined, autoRehydrate());

const opt = {
  storage: AsyncStorage,
  transform: []
};

persistStore(store, opt, () => {
  RouteHistory.pushRoute('/home/index', -1, SceneConfigs.FadeAndroid);
});

export default store;