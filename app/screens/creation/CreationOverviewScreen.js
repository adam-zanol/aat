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
} from 'react-native';

import CustomTabBar from '../../components/CustomTabBar'
import SuperText from '../../components/SuperText'
import WorkoutsSubScreen from './components/WorkoutsSubScreen'
import ExercisesSubScreen from './components/ExercisesSubScreen'

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import styles from '../../styles/styles.js'

class ToolBoxOverviewScreen extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
        workoutDataSource: this.ds.cloneWithRows(this.props.presetWorkouts),
        exercisesDataSource: this.ds.cloneWithRows(this.props.presetExercises),
        selectedIndex: 0,
        loading: false,
        workoutsEditable: false,
        exercisesEditable: false
    };

    // Binding functions
    this.renderWorkoutRow = this.renderWorkoutRow.bind(this)
    this.renderExerciseRow = this.renderExerciseRow.bind(this)
    this._navigateToWorkoutCreation = this._navigateToWorkoutCreation.bind(this)
    this._navigateToExerciseCreation = this._navigateToExerciseCreation.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.presetWorkouts !== this.props.presetWorkouts) {
     this.setState({
       workoutDataSource: this.ds.cloneWithRows(nextProps.presetWorkouts)
     })
    }

    if (nextProps.presetExercises !== this.props.presetExercises) {
     this.setState({
       exerciseDataSource: this.ds.cloneWithRows(nextProps.presetExercises)
     })
    }
  }

  render() {
    return (
      <View style={styles.fullPageWrapper}>
          <ScrollableTabView
            tabBarBackgroundColor={styles.colors.alt2}
            tabBarActiveTextColor={styles.colors.primary}
            tabBarUnderlineStyle={{backgroundColor: styles.colors.primary, height: 1}}
            tabBarInactiveTextColor={styles.colors.base2}
            tabBarTextStyle={{padding: 0, fontSize: 12}}
            prerenderingSiblingsNumber={1}
            renderTabBar={() => <CustomTabBar/>}>
            <View style={styles.contentWrapper} tabLabel="WORKOUTS">
              <WorkoutsSubScreen
                onWorkoutPress={this._navigateToWorkoutCreation} />
            </View>
            <View style={styles.contentWrapper} tabLabel="EXERCISES">
              <ExercisesSubScreen
                onExercisePress={this._navigateToExerciseCreation} />
            </View>
          </ScrollableTabView>
      </View>
    )
  }

  renderFooterWorkoutButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._toggleEditWorkouts()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primaryAlt} size={18} name={"edit"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimaryAlt]}>edit</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._navigateToWorkoutCreation()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"add-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>new workout</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderFooterExercisesButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._toggleEditExercises()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primaryAlt} size={18} name={"edit"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimaryAlt]}>edit</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._navigateToExerciseCreation()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.tertiary} size={18} name={"filter-list"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textTertiary]}>filter</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._navigateToExerciseCreation()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"add-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>exercise</SuperText>
        </TouchableOpacity>
      </View>
    )
  }
  renderWorkouts() {
    return (
      <ListView
        style={styles.flex1}
        automaticallyAdjustContentInsets={false}
        removeClippedSubviews={false}
        dataSource={this.state.workoutDataSource}
        renderRow={this.renderWorkoutRow}
        enableEmptySections={true}
      />
    )
  }

  renderWorkoutRow(workout,sectionID,rowID) {
    return(
      <TouchableHighlight style={styles.bgAlt2} underlayColor={styles.colors.alt1} onPress={() => this._navigateToWorkoutCreation(workout,rowID)}>
        <View style={[styles.listRow, styles.noPadding, styles.hCenter]}>
          <View style={[styles.p1,styles.flex1]}>
            <SuperText style={styles.textBase2} numberOfLines={1}> {workout.name} </SuperText>
          </View>
          {this.state.workoutsEditable ?
          <TouchableOpacity style={styles.buttonOptions} onPress={(event) => this._deleteWorkout(rowID)}>
            <View style={styles.removeButton}>
              <MaIcon color={styles.colors.secondary} size={18} name={"remove-circle"} />
            </View>
            <SuperText style={styles.textSecondary}>delete</SuperText>
          </TouchableOpacity> :
          <View style={[styles.p1x]}>
            <MaIcon style={[styles.textBase2]} size={20} name="keyboard-arrow-right" />
          </View>}
        </View>
      </TouchableHighlight>
    )
  }

  renderExcercises() {
    return (
      <ListView
        renderHeader={this.renderExerciseHeader}
        automaticallyAdjustContentInsets={false}
        removeClippedSubviews={false}
        dataSource={this.state.exercisesDataSource}
        renderRow={this.renderExerciseRow}
        enableEmptySections={true}
      />
    )
  }

  renderExerciseRow(exercise, sectionID, rowID) {
    return (
      <TouchableHighlight style={styles.bgAlt2} underlayColor={styles.colors.alt1} onPress={() => this._navigateToExerciseCreation(exercise,rowID)}>
        <View style={[styles.listRow, styles.noPadding, styles.hCenter]}>
          <View style={[styles.p1,styles.flex1]}>
            <SuperText style={styles.textBase2} numberOfLines={1}> {exercise.name} </SuperText>
          </View>
          {this.state.exercisesEditable ?
          <TouchableOpacity style={styles.buttonOptions} onPress={(event) => this._deleteExercise(rowID)}>
            <View style={styles.removeButton}>
              <MaIcon color={styles.colors.secondary} size={18} name={"remove-circle"} />
            </View>
            <SuperText style={styles.textSecondary}>delete</SuperText>
          </TouchableOpacity> :
          <View style={[styles.p1x]}>
            <MaIcon style={[styles.textBase2]} size={20} name="keyboard-arrow-right" />
          </View>}
        </View>
      </TouchableHighlight>
    )
  }

  //*************************
  // Events
  //*************************

  _toggleEditExercises() {
    const status = this.state.exercisesEditable
    this.setState({
      exercisesEditable: !status,
      exercisesDataSource: this.ds.cloneWithRows(this.props.presetExercises)
    })
  }

  _onChange(index) {
    this.setState({
      selectedIndex: index,
    })
  }

  _navigateToWorkoutCreation(workout, workoutID) {
    this.props.navigator.push({
      ident: "WorkoutCreation",
      title: workout ? "edit template" : "new workout template",
      workout,
      workoutID
    })
  }

  _navigateToExerciseCreation(exercise, exerciseID) {
    this.props.navigator.push({
      ident: "ExerciseCreation",
      title: exercise ? "EDIT EXERCISE" : "NEW EXERCISE",
      exercise,
      exerciseID
    })
  }

}

//*************************
// Component Styles
//*************************

const cStyles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },

  tabDiv: {
    width: 1,
    backgroundColor: styles.colors.base1,
    marginTop: 16,
    marginBottom: 16
  },
  entryRowIcon: {
    justifyContent: 'center',
  },

  addButtonText: {
    fontSize: 12,
    textAlign: 'center',
    color: styles.colors.primary,
    fontWeight: 'bold'
  },

  addButton: {
    padding: 16,
    backgroundColor: styles.colors.alt1
  }

})

module.exports = ToolBoxOverviewScreen
