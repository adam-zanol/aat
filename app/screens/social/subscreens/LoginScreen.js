'use strict'
import React, {
  Component,
} from 'react';

import {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Navigator,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  TextInput
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import MaIcon from 'react-native-vector-icons/MaterialIcons'

import styles from '../../../styles/styles.js'
import SuperText from '../../../components/SuperText'

import {connect} from 'react-redux'

class LoginScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: this.props.user.email,
      password: '',
      loginError: '',
    }
  }

  render() {
    return (
      <View>
        <View style={styles.inputHeader}>
          <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> EMAIL </SuperText>
        </View>
        <View style={styles.inputWrapperStacked}>
          <TextInput
              style={[styles.textWhite, styles.input]}
              onChangeText={(text) => this._setEmail(text)}
              value={this.state.email}
              keyboardAppearance="dark"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              placeholderTextColor={styles.colors.alt3}
            />
        </View>
        <View style={styles.inputHeader}>
          <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> PASSWORD </SuperText>
        </View>
        <View style={styles.inputWrapperStacked}>
          <TextInput
              style={[styles.textWhite, styles.input]}
              onChangeText={(text) => this._setPassword(text)}
              value={this.state.password}
              keyboardAppearance="dark"
              autoCapitalize="none"
              secureTextEntry={true}
              placeholderTextColor={styles.colors.alt3}
            />
        </View>
        <TouchableHighlight style={styles.buttonTertiary} onPress={(event) => this.props.onSubmit(this.state.email,this.state.password)} underlayColor={styles.colors.alt3}>
          <View>
            <SuperText style={[styles.textCenter, styles.textTertiary, styles.textBold]}>Login</SuperText>
          </View>
        </TouchableHighlight>
        <View style={[styles.rowFlex, styles.rowVert]}>
          <SuperText style={[styles.textBase2]}>{'Not a User?'}</SuperText>
          <TouchableOpacity style={styles.flex1} onPress={(event) => this.props.navigateToRegister(3)}>
            <SuperText style={[styles.textBase2, styles.textBold]}> Register</SuperText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _setEmail = (text) => {
    this.setState({email:text})
  }
  _setPassword = (text) => {
    this.setState({password:text})
  }

}

const cStyles = StyleSheet.create({

  inputBox: {
    margin: 25,
    marginTop: 25,
    marginBottom: 25,
  },

});

function mapStateToProps(state,component) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(LoginScreen)
