import types from '../constants/ActionTypes';

const common = {
  redirect: "/user/login"
};

export default function (state = common, action) {
  const { type, payload } = action;
  switch (type) {
    case types.common.FETCH_REDIRECT:
      return { ...state, redirect: payload.name };
    default:
      return state;
  }
}