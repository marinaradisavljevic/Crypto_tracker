import NavigationService from '../navigation/NavigationService';
import Toast from 'react-native-simple-toast';

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
  ADD_REMOVE_MARKET_TO_FAVORITES,
} from './types';

import {
  signIn,
  getUserInfo,
  getFavorites,
  searchMarkets,
  addToWatchlist
} from '../utils/API';


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
  return (dispatch) => {
    dispatch({ type: START_API_REQUEST });
    let accessToken = '';
    signIn(email, password)
      .then((responseJSON) => {
        if (responseJSON.accessToken) {
          accessToken = responseJSON.accessToken;
          dispatch({ type: SIGN_IN_SUCCESS, payload: accessToken });
          dispatch(getUserId(accessToken));
        } else if (responseJSON.message) {
          Toast.show("An error occurred, please try again.");
          dispatch({ type: SIGN_IN_FAILED, payload: responseJSON.message });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

const getUserId = (accessToken) => {
  return (dispatch) => {
    getUserInfo(accessToken)
      .then((responseJSON) => {
        if (responseJSON.id) {
          dispatch({
            type: FETCHING_USER_ID_SUCCESS,
            payload: {userId: responseJSON.id, accountId: responseJSON.accounts[0].id}
          });
          NavigationService.navigate('Main');
        } else if (responseJSON.code === 401) {
          Toast.show("Session expired, please log in again.");
          dispatch({ type: SESSION_EXPIRED });
          NavigationService.navigate('SignIn')
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export const getMarketsAndFavorites = (accountId, userId, accessToken) => {
  return(dispatch) => {
    let favorites = [];
    getFavorites(accountId, accessToken)
      .then((responseJSON) => {
        if (responseJSON.code) {
          Toast.show("Session expired, please log in again.");
          dispatch({ type: SESSION_EXPIRED });
          NavigationService.navigate('SignIn')
        } else {
          responseJSON.forEach(e => {
            favorites.push(e.id);
          })
          dispatch({ type: FETCH_FAVORITES_SUCCESS, payload: favorites });
        }
        dispatch(fetchMarkets(userId, accessToken, favorites));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const fetchMarkets = (userId, accessToken, favorites) => {
  return(dispatch) => {
    searchMarkets(userId, accessToken)
      .then((responseJSON) => {
        if (responseJSON.code) {
          Toast.show("Session expired, please log in again.");
          dispatch({ type: SESSION_EXPIRED });
          NavigationService.navigate('SignIn')
        } else {
          let markets = [];
          responseJSON.forEach(e => {
            if (favorites.includes(e.id)) {
              e.isFavorite = true;
            } else {
              e.isFavorite = false;
            }
            markets.push(e);
          });
          dispatch({ type: FETCH_MARKETS_SUCCESS, payload: markets });
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }
}

export const saveSearchResultForMarkets = (results) => {
  return({ type: SAVE_MARKETS_SEARCH_RESULTS, payload: results});
}

export const addToFavorites = (
  markets,
  marketsSearchResult,
  marketId,
  accountId,
  accessToken
) => {
  return(dispatch) => {
    addToWatchlist(accountId, marketId, accessToken)
      .then((responseJSON) => {
        if (responseJSON.code) {
          Toast.show("An error occurred, please try again.");
        } else {
          Toast.show("Successfully added a market to Favorites");
          dispatch({ type: ADD_REMOVE_MARKET_TO_FAVORITES, payload: {markets, marketsSearchResult}});
        }
      });
  };
}

//removes a market from favorites only locally
export const removeFromFavorites = (markets, marketsSearchResult) => {
  Toast.show("Successfully removed a market from Favorites");
  return({ type: ADD_REMOVE_MARKET_TO_FAVORITES, payload: {markets, marketsSearchResult}});
}
