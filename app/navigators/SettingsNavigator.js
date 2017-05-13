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

import SettingsScreen from '../screens/settings/SettingsScreen'
import SelectionScreen from '../screens/settings/SelectionScreen'

import styles from '../styles/styles.js'
import MaIcon from 'react-native-vector-icons/MaterialIcons'

class SettingsNavigator extends Component {

  _renderScene(route, navigator) {
    var globalNavigatorProps = { navigator }

    switch(route.ident) {
      case "Settings":
        return (
            <SettingsScreen
              {...globalNavigatorProps} />
        )
      case "Selection":
        return (
            <SelectionScreen
              onSelect={route.onSelect}
              options={route.options}
              selected={route.selected}
              {...globalNavigatorProps} />
        )
      default:
        return (
          <Text>{`YO YOU MESSED SOMETHING UP ${route}`}</Text>
        )
    }
  }

  render() {
    return (
      <Navigator
        sceneStyle={styles.navigator}
        initialRoute={this.props.initialRoute}
        ref="appNavigator"
        style={styles.navigatorStyles}
        renderScene={this._renderScene}
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.PushFromRight})}
          navigationBar={
       <Navigator.NavigationBar
         routeMapper={{
           LeftButton: (route, navigator, index, navState) =>
            { return this.renderLeftButton(route, navigator, index, navState) },
           RightButton: (route, navigator, index, navState) =>
            { return this.renderRightButton(route, navigator, index, navState) },
           Title: (route, navigator, index, navState) =>
            { return this.renderRouteTitle(route, navigator, index, navState) },
         }}
         style={[styles.navBar,{backgroundColor:styles.colors.secondary}]}
         />
        }
      />
    )
  }

  renderLeftButton(route, navigator, index, navState) {
    switch(route.ident) {
      case "Selection":
        return (
          <TouchableOpacity style={styles.navBarButton} onPress={() => navigator.pop()}>
            <MaIcon style={styles.textAlt2} size={20} name="arrow-back" />
          </TouchableOpacity>
        )
      default:
        return null
      }
  }

  renderRightButton(route, navigator, index, navState) {
    switch(route.ident) {
      default:
        return null
      }
  }

  renderRouteTitle(route, navigator, index, navState) {
    switch(index) {
      case 0:
        return (
          <Text style={styles.navBarTitle}>SETTINGS</Text>
        )
      default:
        return (
          <Text style={styles.navBarTitle}>{route.title}</Text>
        )
      }
  }

  _navigateToProfile(navigator) {
    navigator.push({
      ident: "Profile",
      title: "Profile"
    })
  }
}

module.exports = SettingsNavigator
