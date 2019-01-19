import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {connect} from 'react-redux';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';

import { FAVORITES } from '../utils/Strings';

import { removeFromFavorites } from '../actions';

class Favorites extends Component {

  static navigationOptions = {
    title: FAVORITES,
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#009888',
      height:50
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24
    },
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#d9d9d9',
        }}
      />
    );
  }

  removeFavorite = (item) => {
    let { markets, accountId, accessToken, marketsSearchResult } = this.props;
    let newMarkets = [];
    markets.find(e => e.id === item.id).isFavorite = false;
    newMarkets = markets.slice();
    this.props.removeFromFavorites(newMarkets, marketsSearchResult);
  }

  convertValueToString = (value) => {
    const floatValue = parseFloat(value).toLocaleString();
    return `$` + floatValue;
  }




  render() {
    return(
      <View style={styles.mainContainer}>
        <FlatList
          data={this.props.markets.filter(e => e.isFavorite === true)}
          style={styles.listContainer}
          renderItem={({item}) =>
            <View style={styles.listItem}>
              <TouchableOpacity
                style={styles.nameAndValue}
                onPress={()=> Toast.show('I was pressed!')}
              >
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
                <Text style={styles.value}>{this.convertValueToString(item.volume)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => this.removeFavorite(item)}
              >
                <Ionicon
                  name={'md-heart'}
                  size={26}
                  style={styles.filledHeart}
                  color="#e60073"/>
              </TouchableOpacity>
            </View>
          }
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    userId: state.auth.userId,
    markets: state.auth.markets,
    marketsSearchResult: state.auth.marketsSearchResult,
    accountId: state.auth.accountId
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15
  },
  listContainer: {
    flex: 1,
    marginTop: 20
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 15,
    justifyContent: 'center'
  },
  nameAndValue: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  iconContainer: {
    marginHorizontal: 10
  },
  nameContainer: {
    paddingRight: 10
  },
  name: {
    fontSize: 18,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 18,
    color: '#737373'
  },
  filledHeart: {
    opacity: 0.95
  },
}

export default connect(mapStateToProps, {removeFromFavorites})(Favorites);
