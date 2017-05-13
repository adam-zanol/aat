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
  TouchableOpacity,
  TextInput,
  ActionSheetIOS,
  AlertIOS
} from 'react-native';

import SocialOverviewScreen from '../screens/social/SocialOverviewScreen'
import ProfileScreen from '../screens/social/ProfileScreen'
import UserOverviewScreen from '../screens/social/UserOverviewScreen'
import styles from '../styles/styles.js'
import MaIcon from 'react-native-vector-icons/MaterialIcons'
import firebaseApp from '../Firebase.js'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userActions from '../actions/userActions'
import Dimensions from 'Dimensions'
let screenWidth = Dimensions.get('window').width

class SocialNavigator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userInfo: null,
      isLoggedIn: null
    }

    this.actionSheetButtons = [
      'Add By Email',
      'Add By Username',
      'Cancel'
    ]

    this.authObserver = null
    this.auth = firebaseApp.auth()
    this.database = firebaseApp.database()
    this.profileRef = null
    this._renderScene = this._renderScene.bind(this)
  }

  componentDidMount() {
    this._checkAuth()
  }

  componentWillUnmount() {
    this.profileRef.off()
  }

  _renderScene(route, navigator) {
    var globalNavigatorProps = { navigator }
    switch(route.ident) {
      case "SocialOverview":
        return (
            <SocialOverviewScreen
              {...this.props}
              {...globalNavigatorProps}
              isLoggedIn={this.state.isLoggedIn}
              userInfo={this.state.userInfo} />
        )
      case "Profile":
        return (
            <ProfileScreen
              {...this.props}
              {...globalNavigatorProps} />
        )
      case "UserOverview":
        return (
            <UserOverviewScreen
              user={this.state.userInfo}
              actions={this.props.actions}
              userID={route.userID}
              isFollowing={route.isFollowing}
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
        searchString={this.state.searchString}
        sceneStyle={styles.navigator}
        initialRoute={this.props.initialRoute}
        ref="appNavigator"
        style={styles.navigatorStyles}
        renderScene={this._renderScene}
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.PushFromRight })}
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
         style={[styles.navBar,{backgroundColor:styles.colors.tertiary}]}
         />
        }
      />
    )
  }

  renderLeftButton(route, navigator, index, navState) {
    switch(route.ident) {
      case "SocialOverview":
          return null
      default:
        return (
          <TouchableOpacity style={styles.navBarButton} onPress={() => navigator.pop()}>
            <MaIcon style={styles.textAlt2} size={20} name="arrow-back" />
          </TouchableOpacity>
        )
      }
  }

  renderRightButton(route, navigator, index, navState) {
    switch(route.ident) {
      default:
        return null
      }
  }

  renderRouteTitle(route, navigator, index, navState) {
    switch(route.ident) {
      case "SocialOverview":
        return (
          <Text style={styles.navBarTitle}>SOCIAL</Text>
        )
      default:
        return (
          <Text style={styles.navBarTitle}>{route.title}</Text>
        )
      }
  }

  //*************************
  // Firebase Interactions
  //*************************

  _checkAuth = () => {
    this.authObserver = this.auth.onAuthStateChanged(function(user) {
      if (user) {
        // TODO unmounted component is being updated here
        this.setState({isLoggedIn:true})
        this.props.actions.setUserID(firebaseApp.auth().currentUser.uid)
        this.profileRef = this.database.ref('profiles/'+firebaseApp.auth().currentUser.uid)
        this._getUserProfile()
      } else {
        this.setState({isLoggedIn:null})
        this.props.actions.setUserID(null)
      }
    }.bind(this))
  }

  _getUserProfile() {
    this.profileRef.on('value', function(snap) {
      this.setState({userInfo: snap.val()})
    }, this)
  }
}

const cStyles = StyleSheet.create({


});

export default connect(state => ({

  }),
  (dispatch) => ({
    actions: bindActionCreators({...userActions}, dispatch)
  })
)(SocialNavigator);
