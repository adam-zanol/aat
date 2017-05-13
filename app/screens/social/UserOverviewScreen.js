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
  ScrollView,
  TouchableHighlight,
  TextInput
} from 'react-native';

import Dimensions from 'Dimensions'
let screenWidth = Dimensions.get('window').width

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../styles/styles.js'
import firebaseApp from '../../Firebase.js'
import SuperText from '../../components/SuperText'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import CustomTabBar from '../../components/CustomTabBar'

const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
]

class UserOverviewScreen extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
      isFollowing: this.props.isFollowing ? this.props.isFollowing : false,
      activityDataSource: this.ds.cloneWithRows([]),
      userInfo: {}
    }

    this.database = firebaseApp.database()
    this.auth = firebaseApp.auth()
    this.userProfileRef = this.database.ref('profiles/'+this.props.userID)
    this.followingRef = this.database.ref('following/'+this.auth.currentUser.uid)
    this.activityRef = this.database.ref('shared_activity/'+this.auth.currentUser.uid)
    this.renderActivityRow = this.renderActivityRow.bind(this)
  }

  componentDidMount() {
    this._getUserProfile()
  }

  componentWillUpdate() {

  }

  render() {
    return (
      <View style={styles.fullPageWrapper}>
        <ScrollView style={[styles.contentWrapper, styles.bgAlt2]}>
          <View style={styles.hCenter}>
            <View style={cStyles.imageWrapper}>
              <Image
                style={cStyles.profileImage}
                source={{uri:this.state.userInfo.imgUrl}}
                resizeMode='cover'
                />
            </View>
          </View>
          <View style={cStyles.info}>
            <View style={[cStyles.textInfo,styles.m1b]}>
              {(this.state.userInfo.firstname || this.state.userInfo.lastName) &&
                <SuperText style={[styles.textBold, styles.textBase2]}>{this.state.userInfo.firstname + ' ' + this.state.userInfo.lastname}</SuperText>
              }
              <View style={cStyles.specialTag}>
                <SuperText style={[styles.textAlt2, styles.textBold, styles.fontSize10]}>{this.state.userInfo.tag ? this.state.userInfo.tag.toUpperCase() : null}</SuperText>
              </View>
            </View>
            <View style={styles.hCenter}>
              <TouchableOpacity style={[this.state.isFollowing ? styles.buttonBase3 : styles.buttonTertiary,styles.flexRow]} onPress={(event) => this._toggleFollow(this.state.isFollowing)}>
                {this.state.isFollowing ?
                  <MaIcon color={styles.colors.base3} size={10} name={"check"} />
                  : <MaIcon color={styles.colors.tertiary} size={10} name={"add"}  />
                  }
                <SuperText style={[this.state.isFollowing ? styles.textBase3 : styles.textTertiary, styles.fontSize10]}>
                  {this.state.isFollowing ? ' FOLLOWING' : 'FOLLOW'}
                </SuperText>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollableTabView
            backgroundColor={styles.colors.base2}
            tabBarActiveTextColor={styles.colors.tertiary}
            tabBarUnderlineStyle={{backgroundColor: styles.colors.tertiary, height: 1}}
            tabBarInactiveTextColor={styles.colors.base2}
            tabBarTextStyle={{padding: 0, fontSize: 12}}
            prerenderingSiblingsNumber={1}
            renderTabBar={() => <CustomTabBar/>}>
            <ListView tabLabel="ACTIVITY"
              automaticallyAdjustContentInsets={false}
              dataSource={this.state.activityDataSource}
              renderRow={this.renderActivityRow}
              enableEmptySections={true}
              scrollEnabled={false}
            />
            <ListView tabLabel="WORKOUTS"
              automaticallyAdjustContentInsets={false}
              dataSource={this.state.activityDataSource}
              renderRow={this.renderActivityRow}
              enableEmptySections={true}
              scrollEnabled={false}

            />
          </ScrollableTabView>
        </ScrollView>
      </View>
    )
  }

  renderActivityRow(workout,sectionID,rowID) {
    let date =  monthNames[workout.month] + ' ' + workout.day + ', ' + workout.year
    return (
      <TouchableHighlight style={styles.bgAlt2} underlayColor={styles.colors.alt3} onPress={(event) => this._navigateToSharedWorkoutOverview(rowID,workout)}>
        <View style={[styles.p2,styles.listRow]}>
          <View style={styles.flex1}>
            <SuperText style={styles.textBase2} numberOfLines={1}> {workout.name} </SuperText>
          </View>
          <View>
            <SuperText style={[styles.textBase3,styles.fontSize12]}>{date}</SuperText>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _getUserProfile() {
    this.userProfileRef.once('value', function(snap) {
      this.setState({
        userInfo: snap.val(),
        loading: false,
      })
    }, this)

    this.activityRef.once('value', function(snap) {
      if (snap.val()) {
        this.setState({
          activityDataSource: this.ds.cloneWithRows(snap.val())
        })
      }
    }, this)
  }

  _toggleFollow(status) {
    // Add user to friends or remove based on status
    if (status == false) {
      this.followingRef.child(this.props.userID).set({
        username: this.state.userInfo.username,
      }).then(() => {
        this.database.ref('followers/'+this.props.userID).child(this.auth.currentUser.uid).set({
            username: this.props.user.username,
          }).then(() => {
            this.props.actions.updateFollowingCount(1)
            this.setState({isFollowing: true})
          })
        },this)
    } else {
      this.followingRef.child(this.props.userID).remove().then(
        this.followingRef.child(this.auth.currentUser.uid).remove().then(() => {
          this.database.ref('followers/'+this.props.userID).child(this.auth.currentUser.uid).remove().then(() => {
            this.props.actions.updateFollowingCount(-1)
            this.setState({isFollowing: false})
          })
        },this)
      )
    }
  }

  _navigateToSharedWorkoutOverview(id,workout) {

  }
}


const cStyles = StyleSheet.create({

  profileImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  content: {
    flexDirection: 'column',
    justifyContent: 'center'
  },

  imageWrapper: {
    position: 'relative',
    height: 140,
    width: screenWidth,
    backgroundColor: styles.colors.base2,
    justifyContent: 'center',
    marginBottom: 0,
    justifyContent: 'center',
    flex: 1
  },

  info: {
    padding: 16,
    backgroundColor: styles.colors.alt2
  },

  textInfo: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  specialTag: {
    backgroundColor: styles.colors.tertiary,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    padding: 2,
    paddingLeft: 6,
    paddingRight: 6
  }


});

module.exports = UserOverviewScreen
