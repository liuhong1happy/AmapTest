import types from '../constants/ActionTypes';

const common = {
  redirect: "/user/login",
  savingTime: false
};

export default function (state = common, action) {
  const { type, payload } = action;
  switch (type) {
    case types.common.FETCH_REDIRECT:
      return { ...state, redirect: payload.name };
    case types.common.SET_STATE:
      return { ...state, ...payload };
    default:
      return state;
  }
}