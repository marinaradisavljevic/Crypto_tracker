import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  UPDATE_STATE
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  showEmailLabel: false,
  showPassLabel: false,
  borderColor1: '#cccccc',
  borderColor2: '#cccccc',
  emailErrorMsg: '',
  passwordErrorMsg: '',
  serverErrorMsg: '',
  loading: 'false'
};

export default (state=INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    case EMAIL_CHANGED:
      return {
        ...state,
        email: action.payload,
        emailErrorMsg: '',
        serverErrorMsg: '',
        borderColor1:'#009888'
      };
    case PASSWORD_CHANGED:
      return {
        ...state,
        password: action.payload,
        passwordErrorMsg: '',
        serverErrorMsg: '',
        borderColor2:'#009888'
      };
    case UPDATE_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
