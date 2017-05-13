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

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../../styles/styles.js'
import SuperText from '../../../components/SuperText'
import firebaseApp from '../../../Firebase.js'

class RegistrationScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      username: '',
      password: '',
      repassword: '',
      isRegPasswordSecure: true,
      isRegRePasswordSecure: true,
    }

    this.auth = firebaseApp.auth()


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
              placeholderTextColor={styles.colors.alt3}
              autoCorrect={false}
            />
        </View>
        <View style={styles.inputHeader}>
          <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> USERNAME </SuperText>
        </View>
        <View style={styles.inputWrapperStacked}>
          <TextInput
              style={[styles.textWhite, styles.input]}
              onChangeText={(text) => this._setUsername(text)}
              value={this.state.username}
              keyboardAppearance="dark"
              placeholderTextColor={styles.colors.alt3}
              autoCorrect={false}
              maxLength={10}
            />
        </View>
        <View style={styles.inputHeader}>
          <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> PASSWORD </SuperText>
        </View>
        <View style={[styles.inputWrapperStacked, styles.rowFlex, styles.hCenter]}>
          <TextInput
            style={[styles.textWhite, styles.input, styles.flex1]}
            onChangeText={(text) => this._setPassword(text)}
            value={this.state.password}
            keyboardAppearance="dark"
            placeholderTextColor={styles.colors.alt3}
            secureTextEntry={this.state.isRegPasswordSecure}
            autoCorrect={false}
          />
          <TouchableOpacity onPress={(event) => this.setState({isRegPasswordSecure: !this.state.isRegPasswordSecure})}>
            <Text style={[styles.fontSize12, styles.textBase1]}>{this.state.isRegPasswordSecure ? 'show' : 'hide'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputHeader}>
          <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> RETYPE PASSWORD </SuperText>
        </View>
        <View style={[styles.inputWrapperStacked, styles.rowFlex, styles.hCenter]}>
          <TextInput
              style={[styles.textWhite, styles.input, styles.flex1]}
              onChangeText={(text) => this._setRepassword(text)}
              value={this.state.repassword}
              keyboardAppearance="dark"
              placeholderTextColor={styles.colors.alt3}
              secureTextEntry={this.state.isRegRePasswordSecure}
              autoCorrect={false}
          />
        <TouchableOpacity onPress={(event) => this.setState({isRegRePasswordSecure: !this.state.isRegRePasswordSecure})}>
          <Text style={[styles.fontSize12, styles.textBase1]}>{this.state.isRegRePasswordSecure ? 'show' : 'hide'}</Text>
        </TouchableOpacity>
        </View>
        <TouchableHighlight style={styles.buttonTertiary} onPress={(event) => this._doRegisterUser()} underlayColor={styles.colors.alt3}>
          <View>
            <SuperText style={[styles.textCenter, styles.textTertiary, styles.textBold]}>Sign Up</SuperText>
          </View>
        </TouchableHighlight>
        <View style={[styles.rowFlex, styles.rowVert]}>
          <SuperText style={[styles.textBase2]}>{'Already a User?'}</SuperText>
          <TouchableOpacity style={styles.flex1} onPress={(event) => this.props.navigateToLogin(2)}>
            <SuperText style={[styles.textBase2, styles.textBold]}> Sign In</SuperText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _setEmail = (text) => {
    this.setState({email:text})
  }
  _setUsername = (text) => {
    this.setState({username:text})
  }
  _setPassword = (text) => {
    this.setState({password:text})
  }
  _setRepassword = (text) => {
    this.setState({repassword:text})
  }

  _doRegisterUser() {
    // make sure all fields are good to register,
    // Check if passwords match, set error

    if (this.state.password != this.state.repassword) {
      this._setRegistrationError('passwords-dont-match')
      return this
    }

    // All good then attempt to create the firebase user
    this.auth.createUserWithEmailAndPassword(this.state.email,this.state.password).then(function() {

    // Create User in /users TODO

    }, function (error) {
      this._setRegistrationError(error.code)
    }, this)
    // Add user to /users
  }

}

const cStyles = StyleSheet.create({


});

module.exports = RegistrationScreen
