import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  UPDATE_STATE,
  START_API_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  FETCHING_USER_ID_SUCCESS,
  SESSION_EXPIRED,
  FETCH_MARKETS_SUCCESS,
  SAVE_MARKETS_SEARCH_RESULTS,
  FETCH_FAVORITES_SUCCESS,
  ADD_REMOVE_MARKET_TO_FAVORITES
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
  loading: 'false',
  accessToken: '',
  userId: '',
  accountId: '',
  markets: [],
  marketsSearchResult: [],
  favorites: []
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
    case START_API_REQUEST:
      return { ...state, loading: true };
    case SIGN_IN_SUCCESS:
      return { ...state, accessToken: action.payload, loading: false };
    case SIGN_IN_FAILED:
      return { ...state, loading: false, serverErrorMsg: action.payload };
    case FETCHING_USER_ID_SUCCESS:
      return { ...state, ...action.payload };
    case SESSION_EXPIRED:
      return { ...state, accessToken: '' };
    case FETCH_MARKETS_SUCCESS:
      return { ...state, markets: action.payload, marketsSearchResult: action.payload };
    case SAVE_MARKETS_SEARCH_RESULTS:
      return { ...state, marketsSearchResult: action.payload};
    case FETCH_FAVORITES_SUCCESS:
      return { ... state, favorites: action.payload};
    case ADD_REMOVE_MARKET_TO_FAVORITES:
      return{ ...state, ...action.payload };
    default:
      return state;
  }
};
