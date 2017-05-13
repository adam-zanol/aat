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

import WorkoutCreationScreen from '../screens/creation/WorkoutCreationScreen'
import ExerciseCreationScreen from '../screens/creation/ExerciseCreationScreen'
import CreationOverviewScreen from '../screens/creation/CreationOverviewScreen'
import ExerciseSelectionScreen from '../screens/creation/ExerciseSelectionScreen'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as presetWorkoutActions from '../actions/presetWorkoutActions'
import * as presetExerciseActions from '../actions/presetExerciseActions'

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../styles/styles.js'

class CreationNavigator extends Component {
  constructor(props) {
    super(props)

    this._renderScene = this._renderScene.bind(this)
  }
  _renderScene(route, navigator) {
    var globalNavigatorProps = { navigator }

    switch(route.ident) {
      case "WorkoutCreation":
        return (
            <WorkoutCreationScreen
              presetExercises={this.props.presetExercises}
              actions={this.props.actions}
              workout={route.workout}
              id={route.workoutID}
              {...globalNavigatorProps} />
        )
      case "ExerciseCreation":
        return (
            <ExerciseCreationScreen
              actions={this.props.actions}
              exercise={route.exercise}
              id={route.exerciseID}
              actions={this.props.actions}
              {...globalNavigatorProps} />
        )
      case "CreationOverview":
        return (
            <CreationOverviewScreen
              {...this.props}
              {...globalNavigatorProps} />
        )
      case "ExerciseSelection":
        return (
            <ExerciseSelectionScreen
              {...globalNavigatorProps}
              presetExercises={this.props.presetExercises}
              selectedExercises={route.selectedExercises}
              onChange={route.onChange}/>
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
        style={styles.bgAlt1}
        sceneStyle={styles.navigator}
        initialRoute={this.props.initialRoute}
        ref="creationNavigator"
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
         style={[styles.navBar,{backgroundColor:styles.colors.primary}]}
         />
        }
      />
    )
  }

  renderLeftButton(route, navigator, index, navState) {
    switch(route.ident) {
      case "CreationOverview":
        return null
      case "Import":
        return (
          <TouchableOpacity style={styles.navBarButton} onPress={() => navigator.pop()}>
            <MaIcon style={styles.textAlt2} size={20} name="close" />
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
          <Text style={styles.navBarTitle}>CREATE</Text>
        )
      default:
        return (
          <Text style={styles.navBarTitle} numberOfLines={1}>{route.title}</Text>
        )
      }
  }

  pushWorkoutCreation(navigator) {
    navigator.push({
      ident: "WorkoutCreation",
      title: "New Workout"
    })
  }

  _navigateToImport(navigator) {
    navigator.push({
      ident: "Import",
      title: "Import",
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    })
  }
}

export default connect(state => ({
    presetWorkouts: state.presetWorkouts,
    presetExercises: state.presetExercises
  }),
  (dispatch) => ({
    actions: bindActionCreators({...presetWorkoutActions, ...presetExerciseActions}, dispatch)
  })
)(CreationNavigator);
