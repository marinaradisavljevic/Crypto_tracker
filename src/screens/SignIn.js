import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { connect } from 'react-redux';

import {
  WELCOME_STRING,
  EMAIL_STRING,
  PASSWORD_STRING,
  SIGN_IN_STRING,
  EMAIL_REQUIRED_STRING,
  INVALID_EMAIL_STRING,
  PASSWORD_REQUIRED_STRING
} from '../utils/Strings';

import {
  emailChanged,
  passwordChanged,
  updateState,
  signUserIn
} from '../actions';

class SignIn extends Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.updateState({ loading: false });
  }

  renderLabel = (type) => {
    let labelString = '';
    if (type === 'email' && this.props.showEmailLabel) {
      labelString = EMAIL_STRING;
    } else if (type === 'password' && this.props.showPassLabel) {
      labelString = PASSWORD_STRING;
    }
    return <Text style={styles.smallLabel}>{labelString}</Text>
  }

  renderErrorText = (type) => {
    let errorMessage = '';
    if (type === 'email' && this.props.emailErrorMsg) {
      errorMessage = this.props.emailErrorMsg;
    } else if (type === 'password' && this.props.passwordErrorMsg) {
      errorMessage = this.props.passwordErrorMsg;
    } else if (type === 'server' && this.props.serverErrorMsg) {
      errorMessage = this.props.serverErrorMsg;
    }
    return <Text style={styles.warning}>{errorMessage}</Text>
  }

  onSignInPressed = () => {
    const { email, password } = this.props;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

    if (!email) {
      this.props.updateState({
        emailErrorMsg: EMAIL_REQUIRED_STRING,
        borderColor1: 'red'
      });
    } else if (reg.test(email) === false) {
      this.props.updateState({
        emailErrorMsg: INVALID_EMAIL_STRING,
        borderColor1: 'red'
      });
    } else if (!password) {
      this.props.updateState({
        passwordErrorMsg: PASSWORD_REQUIRED_STRING,
        borderColor2: 'red'
      })
    } else {
      Keyboard.dismiss();
      this.props.signUserIn(email, password);
    }
  }

  renderBtnOrIndicator = () => {
    if (this.props.loading) {
      return <View style={styles.btnStyle}>
        <ActivityIndicator size="large" color="white"/>
      </View>;
    } else {
      return <TouchableOpacity
        style={styles.btnStyle}
        onPress={() => this.onSignInPressed()}
        >
          <Text style={styles.btnLabel}>{SIGN_IN_STRING}</Text>
      </TouchableOpacity>;

    }
  }

  render() {
    return(
      <View style={styles.mainContainer}>
        <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#cccccc"/>
        <View style={styles.labelContainer}>
          <Text style={styles.welcomeLabel}>{WELCOME_STRING}</Text>
        </View>
        <View style={styles.signInFormContainer}>
          <View>
            {this.renderLabel('email')}
            <TextInput
              placeholder={EMAIL_STRING}
              underlineColorAndroid='transparent'
              autocorrect={false}
              autoCapitalize='none'
              keyboardType="email-address"
              style={[styles.inputText, {borderColor: this.props.borderColor1}]}
              onFocus={() => this.props.updateState({ showEmailLabel: true, borderColor1: '#009888', emailErrorMsg: '' })}
              onBlur={() => this.props.updateState({borderColor1: '#cccccc' })}
              onChangeText={text => this.props.emailChanged(text)}
              value={this.props.email}
            />
            {this.renderErrorText('email')}
          </View>
          <View>
            {this.renderLabel('password')}
            <TextInput
              placeholder={PASSWORD_STRING}
              underlineColorAndroid='transparent'
              autocorrect={false}
              autoCapitalize='none'
              secureTextEntry={true}
              style={[styles.inputText, {borderColor: this.props.borderColor2}]}
              onFocus={() => { this.props.updateState({ showPassLabel: true, borderColor2: '#009888', passwordErrorMsg: '' })}}
              onBlur={() => this.props.updateState({borderColor2: '#cccccc' })}
              onChangeText={text => this.props.passwordChanged(text)}
              value={this.props.password}
            />
            {this.renderErrorText('password')}
          </View>
        </View>
        <View style={styles.serverErrorMsgContainer}>
          {this.renderErrorText('server')}
        </View>
        <View style={styles.signInBtnContainer}>
          {this.renderBtnOrIndicator()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    showEmailLabel: state.auth.showEmailLabel,
    showPassLabel: state.auth.showPassLabel,
    borderColor1: state.auth.borderColor1,
    borderColor2: state.auth.borderColor2,
    emailErrorMsg: state.auth.emailErrorMsg,
    passwordErrorMsg: state.auth.passwordErrorMsg,
    serverErrorMsg: state.auth.serverErrorMsg,
    loading: state.auth.loading
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 35
  },
  labelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signInFormContainer: {
    flex: 1,
    justifyContent: 'space-evenly'
  },
  signInBtnContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  welcomeLabel: {
    fontSize: 38,
    color: '#666666',
    fontWeight: 'bold'
  },
  btnStyle: {
    backgroundColor: '#009888',
    opacity: 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    elevation:4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  btnLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  inputText: {
    fontSize: 18,
    borderBottomWidth: 2,
  },
  smallLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#cccccc',
  },
  warning: {
    color: 'red'
  },
  serverErrorMsgContainer: {
    alignItems: 'center'
  }
}

export default connect(mapStateToProps, {
  emailChanged,
  passwordChanged,
  updateState,
  signUserIn
})(SignIn);
