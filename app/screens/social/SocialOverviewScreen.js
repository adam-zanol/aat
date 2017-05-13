'use strict'
import React, {
  Component,
} from 'react';

import {
  ListView,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  TextInput,
  LayoutAnimation,
  ActionSheetIOS,
  Image,
  KeyboardAvoidingView
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../styles/styles.js'
import SuperText from '../../components/SuperText'
import firebaseApp from '../../Firebase.js'
import Spinner from 'react-native-loading-spinner-overlay'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import CustomTabBar from '../../components/CustomTabBar'
import FollowingSubScreen from './subscreens/FollowingSubScreen'
import SharedWorkoutsSubScreen from './subscreens/SharedWorkoutsSubScreen'
import LoginScreen from './subscreens/LoginScreen'
import RegistrationScreen from './subscreens/RegistrationScreen'
import {bindActionCreators} from 'redux'
import * as userActions from '../../actions/userActions';
import {connect} from 'react-redux'

class SocialOverviewScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      screenState: 2,
      email: '',
      password: '',
      loginError: '',
      registrationError: '',
      loginEmail: '',
      loginPassword: '',
    }

    // this.props.user.uid
    this.auth = firebaseApp.auth()

    this.actionSheetButtons = [
      'Edit Profile',
      'Logout',
      'Cancel'
    ]

    this._doLoginUser = this._doLoginUser.bind(this)
    this._changeScreenState = this._changeScreenState.bind(this)
  }

  render() {
    if (this.props.isLoggedIn) {
      return this.renderUserContent()
    } else {
      return (
        <KeyboardAvoidingView style={[styles.fullPageWrapper,styles.bgAlt2]} behavior={"padding"}>
          <ScrollView automaticallyAdjustContentInsets={false}>
            <Spinner visible={this.state.loading} color={styles.colors.blue} overlayColor='rgba(0,0,0,0.5)'/>
            <View style={cStyles.wrapper}>
              {this.renderNonUserContent()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )
    }
  }

  renderUserContent() {
    return (
      <View style={styles.fullPageWrapper}>
        <View style={[styles.bgAlt2, styles.rowFlex, styles.hCenter]}>
          <View style={styles.profileImageWrapper}>
            {this.props.userInfo ?
              <Image
                style={styles.profileImage}
                source={{uri:this.props.userInfo.imgUrl}}
                />
              : null}
          </View>
          {this.props.user ?
            <View style={cStyles.userInfo}>
              <View style={[cStyles.userInfoItems]}>
                <View style={cStyles.userInfoItem}>
                  <SuperText style={[styles.fontSize16,styles.textTertiary,styles.textExtraBold]}>{this.props.user.followersCount ? this.props.user.followersCount: 0}</SuperText>
                  <SuperText style={[styles.fontSize10,styles.textBase2, styles.textBold]}>followers</SuperText>
                </View>
                <View style={cStyles.userInfoItem}>
                  <SuperText style={[styles.fontSize16,styles.textTertiary,styles.textExtraBold]}>{this.props.user.followingCount ? this.props.user.followingCount: 0}</SuperText>
                  <SuperText style={[styles.fontSize10,styles.textBase2, styles.textBold]}>following</SuperText>
                </View>
                <View style={cStyles.userInfoItem}>
                  <SuperText style={[styles.fontSize16,styles.textTertiary,styles.textExtraBold]}>{this.props.user.activityCount ? this.props.user.activityCount : 0}</SuperText>
                  <SuperText style={[styles.fontSize10,styles.textBase2, styles.textBold]}>workouts</SuperText>
                </View>
              </View>
              <View style={[styles.flexRow,styles.flex1]}>
                <TouchableOpacity style={cStyles.editProfileButton} onPress={(event) => this._navigateToProfile()}>
                  <SuperText style={[styles.fontSize14, styles.textBase2]}>edit profile</SuperText>
                </TouchableOpacity>
                <TouchableOpacity style={cStyles.logoutButton} onPress={(event) => this._doLogoutUser()}>
                  <SuperText style={[styles.fontSize14, styles.textTertiary]}>logout</SuperText>
                </TouchableOpacity>
              </View>
            </View>
            :
          null }
        </View>
        <ScrollableTabView
          style={[styles.bgWhite,styles.flex1]}
          backgroundColor={styles.colors.alt2}
          tabBarActiveTextColor={styles.colors.tertiary}
          tabBarUnderlineStyle={{backgroundColor: styles.colors.tertiary, height: 1}}
          tabBarInactiveTextColor={styles.colors.base2}
          tabBarTextStyle={{padding: 0, fontSize: 12}}
          prerenderingSiblingsNumber={1}
          renderTabBar={() => <CustomTabBar/>}>
          <FollowingSubScreen tabLabel="FOLLOWING" userID={this.auth.uid} {...this.props}/>
          <SharedWorkoutsSubScreen tabLabel="SHARED WORKOUTS" {...this.props} />
        </ScrollableTabView>
      </View>
    )
  }

  renderNonUserContent() {
    switch(this.state.screenState) {
      case 2: {
        return (
          <View>
            {this.renderLoginError()}
            <LoginScreen
              onSubmit={this._doLoginUser}
              navigateToRegister={this._changeScreenState}
              />
          </View>
        )
      }
      // Show Register
      case 3: {
        return (
          <View>
            {this.renderRegistrationError()}
            <RegistrationScreen
              onSubmit={this._doRegisterUser}
              navigateToLogin={this._changeScreenState} />
          </View>
        )
      }
    }
  }

  renderLoginError() {
    if (this.state.loginError) {
        return (
          <View style={cStyles.feedback}>
            <SuperText style={[styles.textAlt2]}>{this.state.loginError}</SuperText>
          </View>
        )
    } else {
      return null
    }
  }

  renderRegistrationError() {
    if (this.state.registrationError) {
        return (
          <View style={cStyles.feedback}>
            <SuperText style={[styles.textAlt2]}>{this.state.registrationError}</SuperText>
          </View>
        )
    } else {
      return null
    }
  }

  _changeScreenState(newState) {
    LayoutAnimation.easeInEaseOut()
    this.setState({
      screenState: newState,
      loginError: null,
      registrationError: null
    })
  }

  _navigateToProfile() {
    this.props.navigator.push({
      ident: "Profile",
      title: "EDIT PROFILE"
    })
  }

  //*************************
  // Events
  //*************************

  _doLoginUser(email,password) {
    // Attempt to login user
    this.setState({loading: true})
    this.auth.signInWithEmailAndPassword(email,password).then(function() {
      // Go back to overview on success
      this.setState({loading: false})
      // Set successful email, so on login it auto fills email input
      this.props.actions.setEmail(email)
    }, function (error) {
      // Handle/display Errors here.
      this._setLoginError(error.code)
      this.setState({loading: false})
    },this)
  }

  _doLogoutUser = () => {
    this.auth.signOut().then(function() {
      // Sign-out successful.
      // Clear user info
      this.props.actions.clearUserInfo()
    }, function(error) {
      // An error occurred
    }, this);
  }

  _setLoginError = (errorCode) => {
    let errorMessage = ''
    switch(errorCode) {
      case 'auth/invalid-email': {
        errorMessage = "Invalid Email Address"
      }
        break
      case 'auth/wrong-password': {
        errorMessage = "Invalid Email/Password Combination"
      }
        break
      case 'auth/user-not-found': {
        errorMessage = "Check email address"
      }
        break
    }

    this.setState({loginError: errorMessage})
  }

  _setRegistrationError = (errorCode) => {
    let errorMessage = ''
    switch(errorCode) {
      case 'auth/invalid-email': {
        errorMessage = "Invalid Email Address"
      }
        break
      case 'auth/weak-password': {
        errorMessage = "Password is Too Weak"
      }
        break
      case 'passwords-dont-match': {
        errorMessage = "Password's Don't Match"
      }
        break
      default: {
        errorMessage ="An unkown error occured. Oops."
      }
    }

    this.setState({registrationError: errorMessage})
  }

  _showProfileActionSheet = () => {
      ActionSheetIOS.showActionSheetWithOptions({
        options: this.actionSheetButtons,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        this._doProfileAction(buttonIndex)
      })
  }

  _doProfileAction(index) {
    switch(index) {
      case 0: this._navigateToProfile()
        break
      case 1: this._doLogoutUser()
        break
    }
  }
}


const cStyles = StyleSheet.create({

  button: {
    flex: 1,
    margin: 6,
    borderWidth: 1,
    borderColor: styles.colors.tertiary,
    padding: 8,
    borderRadius: 10
  },
  buttonWrapper: {
    flexDirection: 'row',
    paddingTop: 12
  },

  header: {
    marginBottom: 16
  },

  wrapper : {
    padding: 32,
    backgroundColor: styles.colors.alt2,
    overflow: 'hidden',
  },

  username: {
    marginRight: 12,
    marginLeft: 12,
    flex: 1
  },

  profileOptions: {
    flexDirection: 'row'
  },

  userInfo: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 16
  },

  userInfoItem: {
    flex: 1,
    padding: 4,
    justifyContent: 'flex-end'
  },

  userInfoItems: {
    flexDirection: 'row',
    flex: 1,
    margin: 16,
    marginBottom: 0
  },

  editProfileButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: styles.colors.base2,
    padding: 8,
    borderRadius: 12,
    flexDirection: 'row',
    marginRight: 6,
    flex: 3,
    marginTop: 8
  },

  logoutButton: {
    marginRight: 16,
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: styles.colors.tertiary,
    padding: 8,
    borderRadius: 12,
    flexDirection: 'row',
    marginRight: 6,
  },

  feedback: {
    backgroundColor: styles.colors.tertiary,
    padding: 12,
    justifyContent: 'center'
  },

});

export default connect(state => ({
   user: state.user
  }),
  (dispatch) => ({
    actions: bindActionCreators({...userActions}, dispatch)
  })
)(SocialOverviewScreen)
