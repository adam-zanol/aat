'use strict'
import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  Navigator,
  NavigatorIOS,
  View,
  TouchableOpacity
} from 'react-native';

import RegistrationScreen from '../screens/intro/RegistrationScreen'
import LoginScreen from '../screens/intro/LoginScreen'

const styles = require('../styles/styles.js')

class IntroNavigator extends Component {

  _renderScene(route, navigator) {
    var globalNavigatorProps = { navigator }

    switch(route.ident) {
      case "login":
        return (
            <LoginScreen
              {...globalNavigatorProps} />
        )
      case "register":
        return (
            <RegistrationScreen
              {...globalNavigatorProps} />
        )
      default:
        return (
          <Text>{`no match of route.ident ${route}`}</Text>
        )
    }
  }

  render() {

    return (
      <Navigator
        initialRoute={this.props.initialRoute}
        ref="appNavigator"
        style={styles.navigatorStyles}
        renderScene={this._renderScene}
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.PushFromRight})} />
    )
  }
}

module.exports = IntroNavigator
