import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  UPDATE_STATE,
  SIGN_IN_SUCCESS
} from './types';


export const emailChanged = (text) => {
  return(
    {type: EMAIL_CHANGED,
    payload: text}
  );
}


export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
}

export const updateState = (value) => {
  return {
    type: UPDATE_STATE,
    payload: value
  };
}

export const signUserIn = (email, password) => {
  return {
    type: SIGN_IN_SUCCESS
  };
}
