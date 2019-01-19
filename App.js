import React, {Component} from 'react';
import { Text } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import NavigationService from './src/navigation/NavigationService';
import reducers from './src/reducers';

import SignIn from './src/screens/SignIn';
import Markets from './src/screens/Markets';
import Favorites from './src/screens/Favorites';

import { MARKETS_TITLE, FAVORITES} from './src/utils/Strings';

const store = createStore(reducers, applyMiddleware(thunk));

const NestedStackNavigatorForMarkets = createStackNavigator({
  Markets: Markets
});

const NestedStackNavigatorForFavorites = createStackNavigator({
  Favorites: Favorites
});

const nestedTabRouteConfigs = {
  Markets: {
    screen: NestedStackNavigatorForMarkets,
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 15, color: '#009888' }}>{MARKETS_TITLE}</Text>,
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let iconColor = 'grey';
        if (focused) {
          iconColor = tintColor;
        }
        return <MaterialIcon
          name={'view-list'}
          size={horizontal?20:28}
          color={iconColor}
          />;
      },
    }
  },
  Favorites: {
    screen: NestedStackNavigatorForFavorites,
    navigationOptions: {
        tabBarLabel: <Text style={{ fontSize: 15, color: '#009888' }}>{FAVORITES}</Text>,
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        let iconColor = 'grey';
        if (focused) {
          iconColor = tintColor;
        }
        return <Ionicon name={'md-heart'} size={horizontal?20:28} color={iconColor}/>;},
    }
  }
}

const nestedTabNavigationConfig = {
    shifting: true,
    labeled: true,
    activeColor: '#009888',
    inactiveColor: 'grey',
    barStyle: {
      backgroundColor: 'white',
    }
};

const BottomTabNavigator = createMaterialBottomTabNavigator(nestedTabRouteConfigs, nestedTabNavigationConfig);

const MainStackNavigator = createStackNavigator({
  SignIn: SignIn,
  Main: {
    screen: BottomTabNavigator,
    navigationOptions: {
      header: null
    }
  }
});

const AppContainer = createAppContainer(MainStackNavigator);


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
      </Provider>
    );
  }
}
