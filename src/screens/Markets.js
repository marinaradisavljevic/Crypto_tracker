import React, { Component } from 'react';
import { View, Text, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import { MARKETS_TITLE, SEARCH_PLACEHOLDER_STRING } from '../utils/Strings';
import {
  getMarketsAndFavorites,
  saveSearchResultForMarkets,
  addRemoveFromFavorites
} from '../actions';


class Markets extends Component {

  static navigationOptions = {
    title: MARKETS_TITLE,
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

  state = {
    searchQuery: ''
  };

  componentWillMount() {
    this.props.getMarketsAndFavorites(
      this.props.accountId,
      this.props.userId,
      this.props.accessToken
    );
  }

  convertValueToString = (value) => {
    const floatValue = parseFloat(value).toLocaleString();
    return `$` + floatValue;
  }

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

  searchFilterFunction = (text) => {
    const newData = this.props.markets.filter(item => {
      const itemData = item.name.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    this.props.saveSearchResultForMarkets(newData);
    this.setState({
      searchQuery: text
    });
  }

  renderHeader = () => {
  return (
    <SearchBar
      placeholder={SEARCH_PLACEHOLDER_STRING}
      clearIcon={{color:"grey"}}
      lightTheme
      onChangeText={text => this.searchFilterFunction(text)}
      onClear={() => this.setState({searchQuery: ""})}
      value={this.state.searchQuery}
      autoCorrect={false}
      containerStyle={styles.searchContainer}
      inputContainerStyle={{ backgroundColor: 'white '}}
    />
  );
};

renderFavoritesSymbol = (isFavorite) => {
  if (isFavorite) {
    return <Ionicon
      name={'md-heart'}
      size={26}
      style={styles.filledHeart}
      color="#e60073"/>;
  } else {
    return <Ionicon
      name={'md-heart-empty'}
      size={26}
      color="#737373"/>;
  }
}

addRemoveFavorite = (item) => {
  let { markets, marketsSearchResult, accountId, accessToken } = this.props;
  let newMarkets = [];
  let newMarketsSearchResults = [];
  if (item.isFavorite) {
    marketsSearchResult.find(e => e.id === item.id).isFavorite = false;
    markets.find(e => e.id === item.id).isFavorite = false;
  } else {
    marketsSearchResult.find(e => e.id === item.id).isFavorite = true;
    markets.find(e => e.id === item.id).isFavorite = true;
  }
  newMarkets = markets.slice();
  newMarketsSearchResults = marketsSearchResult.slice();
  this.props.addRemoveFromFavorites(
    newMarkets,
    newMarketsSearchResults,
    item.id,
    accountId,
    accessToken,
    item.isFavorite
  );
}


  render() {
    return(
      <View style={styles.mainContainer}>
        <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#008073"/>
        <FlatList
          data={this.props.marketsSearchResult}
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
                onPress={() => this.addRemoveFavorite(item)}
              >
                {this.renderFavoritesSymbol(item.isFavorite)}
              </TouchableOpacity>
            </View>
          }
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={item => item.id}
          ListHeaderComponent={this.renderHeader}
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
  searchContainer: {
    backgroundColor: 'white',
    height: 60,
    elevation: 4,
    marginTop: 10,
    marginBottom: 30,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 5
  },
  searchInput: {
    backgroundColor: 'white',
    height: 50
  }
}

export default connect(mapStateToProps, {
  getMarketsAndFavorites,
  saveSearchResultForMarkets,
  addRemoveFromFavorites
})(Markets);
