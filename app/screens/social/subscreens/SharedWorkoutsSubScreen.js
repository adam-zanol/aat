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
  ScrollView
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../../styles/styles.js'
import firebaseApp from '../../../Firebase.js'
import SuperText from '../../../components/SuperText'

const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
]

class SharedWorkoutsSubScreen extends Component {

  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
        sharedWorkouts: [],
        loading:  true,
        dataSource: this.ds.cloneWithRows([]),
        activityCount: 0
    }
    this.auth = firebaseApp.auth()
    this.database = firebaseApp.database()
    this.sharedWorkoutsRef = this.database.ref('shared_activity/'+this.auth.currentUser.uid)
    this.renderSharedWorkoutRow = this.renderSharedWorkoutRow.bind(this)
  }

  componentDidMount() {
    this._getSharedWorkouts()
  }

  componentWillUnmount() {
    this.sharedWorkoutsRef.off()
  }

  render() {
    return (
      <View style={styles.contentWrapper}>
        {this.renderSharedWorkouts()}
      </View>
    )
  }

  renderSharedWorkouts() {
    if (this.state.dataSource._cachedRowCount) {
      return (
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderSharedWorkoutRow}
          enableEmptySections={true}
        />
      )
    } else if (this.state.loading) {
      return (
        <View style={styles.p1}>
          <SuperText style={styles.textCenter}>Loading Workouts...</SuperText>
        </View>
      )
    } else {
      return (
        <View style={styles.p1}>
          <SuperText style={styles.textCenter}>You have not shared any workouts, yet!</SuperText>
        </View>
      )
    }
  }

  renderSharedWorkoutRow(workout,sectionID,rowID) {
    let date =  monthNames[workout.month] + ' ' + workout.day + ', ' + workout.year
    return (
      <TouchableHighlight style={[styles.listRowWrapper,styles.bgAlt2]} underlayColor={styles.colors.alt3} onPress={(event) => this._navigateToSharedWorkoutOverview(rowID,workout)}>
        <View style={[styles.p2,styles.listRow]}>
          <View style={styles.flex1}>
            <SuperText style={[styles.textBase2, styles.fontSize12, styles.textBold]} numberOfLines={1}> {workout.name} </SuperText>
          </View>
          <View>
            <SuperText style={[styles.textBase3,styles.fontSize12]}>{date}</SuperText>
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
    );
  }

  _getSharedWorkouts() {

    // Get if there is existing data
    this.sharedWorkoutsRef.once('value', function(snapshot) {
      if (!snapshot.val()) {
        this.setState({loading: false})
      } else {
        const count = Object.keys(snapshot.val()).length
        this.props.actions.setActivityCount(count)
      }
    }, this)

    // Set up listeners to react when workouts are deleted or added
    this.sharedWorkoutsRef.on('child_added', function(snapshot) {
      let sharedWorkoutsCopy = this.state.sharedWorkouts
      sharedWorkoutsCopy[snapshot.key] = snapshot.val()
      this.setState({
        sharedWorkouts: sharedWorkoutsCopy,
        dataSource: this.ds.cloneWithRows(sharedWorkoutsCopy),
        loading: false,
      })
    },this)

    this.sharedWorkoutsRef.on('child_removed', function(snapshot) {
      let sharedWorkoutsCopy = this.state.sharedWorkouts
      delete sharedWorkoutsCopy[snapshot.key]
      this.setState({
        sharedWorkouts: sharedWorkoutsCopy,
        dataSource: this.ds.cloneWithRows(sharedWorkoutsCopy)
      })
    },this)
  }

  //*************************
  // Navigation
  //*************************

  _navigateToSharedWorkoutOverview(key,workout) {
    this.props.navigator.push({
      ident: "SharedWrokoutOverview",
      title: workout.name,
      workout,
    })
  }

}


const cStyles = StyleSheet.create({


});

module.exports = SharedWorkoutsSubScreen
