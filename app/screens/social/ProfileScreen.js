'use strict'
import React, {
  Component,
} from 'react';

import {
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  TextInput
} from 'react-native';

import SuperText from '../../components/SuperText'
import styles from '../../styles/styles.js'
import firebaseApp from '../../Firebase.js'
import MaIcon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-picker'
var Platform = require('react-native').Platform

import RNFetchBlob from 'react-native-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

class ProfileScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      repassword: '',
      notification: '',
      avatarSource: '',
      feedback: null
    }
    this.database = firebaseApp.database()
    this.auth = firebaseApp.auth()
    this.uid = firebaseApp.auth().currentUser.uid
    this.profileRef = this.database.ref('profiles/'+this.uid)

    this.feedbackTimeout = null
  }

  componentDidMount() {
    this._getProfile()
  }

  componentWillUnmount() {
    clearTimeout(this.feedbackTimeout)
  }

  render() {
    return (
      <View style={[styles.fullPageWrapper]}>
        <ScrollView style={[styles.flex, styles.bgAlt2, styles.p1]} automaticallyAdjustContentInsets={false}>
          <View style={[styles.bgAlt2, styles.rowFlex, styles.center]}>
            <TouchableOpacity onPress={(event) => this._doGetImage()}>
              <View style={cStyles.profileImageWrapper}>
                {this.state.avatarSource ?
                  <Image
                    style={cStyles.profileImage}
                    source={{uri:this.state.avatarSource}}
                    >
                  </Image> : null
                }
                <MaIcon color={styles.colors.tertiary} style={cStyles.imgIcon} size={24} name={'insert-photo'} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.inputHeader}>
            <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> USERNAME </SuperText>
          </View>
          <View style={styles.inputWrapperStacked}>
            <TextInput
                style={[styles.textWhite, styles.input]}
                onChangeText={(text) => this._setUsername(text)}
                value={this.state.username}
                placeholderTextColor={styles.colors.grayLight}
                keyboardAppearance={'dark'}
                maxLength={10}
                autoCorrect={false}
              />
          </View>
          <View style={styles.inputHeader}>
            <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> FIRST NAME </SuperText>
          </View>
          <View style={styles.inputWrapperStacked}>
            <TextInput
              style={[styles.textWhite, styles.input]}
              onChangeText={(text) => this._setFirstName(text)}
              value={this.state.firstName}
              placeholderTextColor={styles.colors.grayLight}
              keyboardAppearance={'dark'}
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputHeader}>
            <SuperText style={[styles.textBase1, styles.fontSize10, styles.textBold]}> LAST NAME </SuperText>
          </View>
          <View style={styles.inputWrapperStacked}>
            <TextInput
              style={[styles.textWhite, styles.input]}
              onChangeText={(text) => this._setLastName(text)}
              value={this.state.lastName}
              placeholderTextColor={styles.colors.grayLight}
              keyboardAppearance={'dark'}
              autoCorrect={false}
            />
          </View>
        </ScrollView>
        {this.renderFooter()}
      </View>
    )
  }

  renderFooter() {
    return (
      <View>
        {this.renderFeedback()}
        <View style={[styles.footerButtons]}>
          <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._doSaveProfile()}>
            <View style={styles.addButton}>
              <MaIcon color={styles.colors.primary} size={18} name={'check-circle'} />
            </View>
            <SuperText style={[styles.fontSize16,styles.textPrimary]}>save</SuperText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderFeedback() {
    if (this.state.feedback) {
      return (
        <View style={cStyles.feedback}>
          <SuperText style={styles.textAlt2}>{this.state.feedback}</SuperText>
        </View>
      )
    } else return null
  }

  _doGetImage() {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {

      }
      else if (response.error) {

      }
      else {
        let source

        source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: response.uri.replace('file://', ''),
          uriToUpload: response.uri.replace('file://', '')
        })
      }
    })
  }

  _uploadImage(path, imageName) {
    // return promoise for asynchronism
    return new Promise(
      function(resolve,reject) {
        Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' })
         .then((blob) => firebaseApp.storage()
           .ref('profile-images')
           .child(imageName)
           .put(blob, { contentType : 'image/png' })
         )
         .then((snapshot) => {
           resolve(snapshot.a.downloadURLs[0])
        })
      }
    )
  }

  _setUsername = (text) => {
    this.setState({username:text})
  }
  _setFirstName = (text) => {
    this.setState({firstName:text})
  }
  _setLastName = (text) => {
    this.setState({lastName:text})
  }

  _getProfile = () => {
    this.profileRef.once('value').then(snap => {
      this.setState({
        username: snap.val().username,
        lastName: snap.val().lastname,
        firstName: snap.val().firstname,
        avatarSource: snap.val().imgUrl,
        key: snap.key,
        loaded: true
      })
    })
  }

  _doSaveProfile = () => {
    this.setState({
      feedback:'Saving Profile...'
    })
    // Upload new image if it has been changed, check for uriToUpload
    if(this.state.loaded) {
      if (this.state.uriToUpload) {
        this.setState({feedback:'Uploading new profile image...'})
        this._uploadImage(this.state.uriToUpload,this.state.key+'.jpg').then(function(url) {
          this._updateProfile(url)
        }.bind(this))
      } else this._updateProfile()
    } else {
      this.setState({
        feedback: 'An error occured'
      })
      this.feedbackTimeout = setTimeout(() => {this.setState({feedback: null})}, 5000)
    }

  }

  _updateProfile(imgUrl=this.state.avatarSource) {
    this.profileRef.update({
      username: this.state.username,
      firstname: this.state.firstName,
      lastname: this.state.lastName,
      imgUrl: imgUrl,
    }).then(() => {
      this.setState({feedback: 'Profile successfully updated!'})
      this.feedbackTimeout = setTimeout(() => {this.setState({feedback: null})}, 5000)
    }, (error) => {
      this.setState({feedback: 'An error occured'})
      this.feedbackTimeout = setTimeout(() => {this.setState({feedback: null})}, 5000)
    }, this)
  }

  _navigateBack() {
    this.props.navigator.pop()
  }
}

const cStyles = StyleSheet.create({
  profileImage: {
    width: 108,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6
  },
  imgIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 40,
    top: 40,
    backgroundColor: 'rgba(0,0,0,0)',
    zIndex: 2
  },
  profileImageWrapper: {
    overflow: 'hidden',
    height: 108,
    width: 108,
    backgroundColor: styles.colors.base3,
    borderWidth: 4,
    borderColor: styles.colors.tertiary,
    margin: 16,
    borderRadius: 72,
    justifyContent: 'center',
  },
  feedback: {
    backgroundColor: styles.colors.tertiary,
    padding: 12,
    justifyContent: 'center'
  }
});

module.exports = ProfileScreen
