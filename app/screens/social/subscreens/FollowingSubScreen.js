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
  AlertIOS
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../../styles/styles.js'
import firebaseApp from '../../../Firebase.js'
import SuperText from '../../../components/SuperText'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import * as userActions from '../../../actions/userActions';
import {connect} from 'react-redux'

class FollowingSubScreen extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
        following: [],
        loading:  true,
        dataSource: this.ds.cloneWithRows([]),
        followingCountLoaded: false,
        followersCountLoaded: false
    }
    this.auth = firebaseApp.auth()
    this.database = firebaseApp.database()
    this.profilesRef = this.database.ref('profiles')
    this.followingRef = this.database.ref('following/'+this.auth.currentUser.uid)
    this.followersRef = this.database.ref('followers/'+this.auth.currentUser.uid)
    this.renderFriendRow = this.renderFriendRow.bind(this)
  }

  componentDidMount() {
    this._getFollowing()
    this._getFollowers()

  }

  componentWillUnmount() {
    this.followingRef.off()
  }

  componentWillReceiveProps(nextProps) {

  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={styles.contentWrapper}>
        <ScrollView style={[styles.flex1]}>
          {this.renderFriends()}
        </ScrollView>
        <View style={[styles.footerButtons]}>
          <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._showPromptForUserAdd()}>
            <View style={styles.addButton}>
              <MaIcon color={styles.colors.tertiary} size={18} name={"person-add"} />
            </View>
            <SuperText style={[styles.fontSize16,styles.textTertiary]}>find friend</SuperText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderFriends() {
    if (this.state.dataSource._cachedRowCount) {
      return (
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderFriendRow}
          enableEmptySections={true}
          removeClippedSubviews={false}
        />
      )
    } else if (this.state.loading) {
      return (
        <View style={styles.p1}>
          <SuperText style={styles.textCenter}>Loading Friends...</SuperText>
        </View>
      )
    } else {
      return (
        <View style={styles.p1}>
          <SuperText style={styles.textCenter}>You are not following anyone</SuperText>
        </View>
      )
    }
  }

  renderFriendRow(friend,sectionID,rowID) {
    return (
      <TouchableHighlight style={styles.listRowWrapper} underlayColor={styles.colors.alt3} onPress={(event) => this._navigateToUserOverview(rowID,friend.username)}>
        <View style={[styles.listRow,styles.flexRow,styles.center]}>
          <View style={cStyles.imageWrapper}>
            {friend.imgUrl ?
              <Image
                style={cStyles.profileImage}
                source={{uri:friend.imgUrl}}
                resizeMode='cover'
                />
              : null}
          </View>
          <View style={cStyles.userInfo}>
            <SuperText style={[styles.textBase2, styles.fontSize12, styles.textBold]} numberOfLines={1}>{friend.username}</SuperText>
            <View style={cStyles.tag}>
              <SuperText style={[styles.fontSize10,styles.textAlt2]} numberOfLines={1}>{friend.tag.toUpperCase()}</SuperText>
            </View>
          </View>
          <View style={styles.p2}>
            <MaIcon style={[styles.textBase3]} size={20} name="keyboard-arrow-right" />
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  //*************************
  // Events
  //*************************

  _showPromptForUserAdd(message) {
    AlertIOS.prompt(
      'Enter Username',
      message,
      text => this._findUser(text),
      'plain-text',
    )
  }

  _getFollowers() {
    // get number of followers by querying the following ref
    this.setState({followersCountLoaded:true})
    this.followersRef.once("value", function(snapshot) {
      const count = snapshot.val() ? Object.keys(snapshot.val()).length : 0
      this.props.actions.setFollowersCount(count)
    },this)
  }

  _getFollowing() {
    // Get if there is existing data TODO new way to do this so we don't load all the data to check if following exist
    this.followingRef.once('value', function(snapshot) {
      if (!snapshot.val()) {
        this.setState({
          loading: false
        })
        this.props.actions.setFollowingCount(0)
      } else {
        const count = Object.keys(snapshot.val()).length
        this.props.actions.setFollowingCount(count)
      }
    }, this)

    // Set up listeners to react when users are followed or unfollowed
    this.followingRef.on('child_added', function(snapshot) {
      let followingCopy = this.state.following
      // get profile
      this.database.ref('profiles/'+snapshot.key).once('value', (snapshot) => {
        followingCopy[snapshot.key] = snapshot.val()
      }).then(() => {
        this.setState({
          following: followingCopy,
          dataSource: this.ds.cloneWithRows(followingCopy),
          loading: false
        })
      })
    },this)

    this.followingRef.on('child_removed', function(snapshot) {
      let followingCopy = this.state.following
      delete followingCopy[snapshot.key]
      this.setState({
        following: followingCopy,
        dataSource: this.ds.cloneWithRows(followingCopy)
      })
    },this)
  }

  _findUser(username) {
    this.profilesRef.orderByChild("username").equalTo(username).once("value", function(snapshot) {
      if (snapshot.val()) {
        const data = snapshot.val(),
          key = Object.keys(data)[0],
          userData = data[key]
        this._navigateToUserOverview(key, userData.username)
      } else {
        this._showPromptForUserAdd('User Does Not Exist!')
      }
    },this)
  }

  //*************************
  // Navigation
  //*************************

  _navigateToUserOverview(key,username) {
    this.props.navigator.push({
      ident: "UserOverview",
      title: username,
      userID: key,
      isFollowing: _.includes(Object.keys(this.state.following), key)
    })
  }

}

const cStyles = StyleSheet.create({

  titleBarButton: {
    flex: 1,
    padding: 10
  },

  textWhite: {
    color: 'white'
  },

  pageWrapper: {
    backgroundColor: 'white',
    flex: 1,
  },

  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  imageWrapper: {
    height: 40,
    width: 40,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: styles.colors.base2,
    justifyContent: 'center',
    margin: 6,
    marginLeft: 12,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: styles.colors.tertiary,
    borderRadius: 6,
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4
  },
  userInfo: {
    flex: 1,
    padding: 12,
    alignItems: 'flex-start'
  }

});

export default FollowingSubScreen
