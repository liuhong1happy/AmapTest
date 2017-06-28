import { combineReducers } from 'redux';

import common from './common';
import times from './times';
import data from './data';

const rootReducer = combineReducers({
  common,
  times,
  data
});

export default rootReducer;
