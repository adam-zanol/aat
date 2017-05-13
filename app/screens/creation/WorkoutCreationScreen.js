'use strict'
import React, {
  Component,
} from 'react';

import {
  ListView,
  StyleSheet,
  View,
  TabBarIOS,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Modal,
  Alert
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import ActionBar from '../../components/ActionBar'
import SuperText from '../../components/SuperText'
import styles from '../../styles/styles.js'
import ExerciseEditScreen from './components/ExerciseEditScreen'
import ExerciseSelectionScreen from '../other/ExerciseSelectionScreen'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class WorkoutCreationScreen extends Component {

  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
      animationType: 'slide',
      modalVisible: false,
      name: this.props.workout ? this.props.workout.name : '',
      exercisesEditable: false,
      exerciseModalVisible: false,
      activeExerciseID: null,
      exerciseDataSource: this.ds.cloneWithRows(this.props.workout ? this.props.workout.exercises: {},),
      exercises: this.props.workout ? this.props.workout.exercises: {}
    };

    this._saveWorkout = this._saveWorkout.bind(this)
    this._addExercises = this._addExercises.bind(this)
    this._setExerciseModalVisible = this._setExerciseModalVisible.bind(this)
    this._addSet = this._addSet.bind(this)
    this._updateSet = this._updateSet.bind(this)
    this._deleteSet = this._deleteSet.bind(this)
    this.renderExerciseRow = this.renderExerciseRow.bind(this)
  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={[styles.fullPageWrapper]}>
        <View style={cStyles.pageHeader}>
          <View style={[styles.rowFlex,styles.contentCenter]}>
            <View style={[styles.inputWrapper,styles.flex1]}>
              <TextInput
                  style={[styles.input]}
                  onChangeText={(text) => this._setName(text)}
                  value={this.state.name}
                  placeholder={'name'}
                  placeholderTextColor={styles.colors.alt3}
                  keyboardAppearance="dark"
                  autoCorrect={false}
                />
            </View>
            <View style={[styles.rowRight]}>
              <TouchableOpacity style={styles.buttonOptionsSmall} onPress={(event) => this._toggleExerciseEdit()}>
                <View style={styles.addButton}>
                  <MaIcon color={this.state.exercisesEditable ? styles.colors.primary : styles.colors.grayLight} size={18} name={"edit"} />
                </View>
                <SuperText style={this.state.exercisesEditable ? styles.textPrimary : styles.textLight}>edit</SuperText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonOptionsSmall} onPress={(event) => this._setModalVisible(true)}>
                <View style={styles.addButton}>
                  <MaIcon color={styles.colors.primary} size={18} name={"add-circle"} />
                </View>
                <SuperText style={styles.textPrimary}>add</SuperText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.flex1,styles.flexColumn]}>
          <ScrollView>
            <View style={cStyles.header}>
              <SuperText style={[styles.textBase3, styles.textBold]}>exercises</SuperText>
            </View>
            {this.renderExcercises()}
          </ScrollView>
          {this.renderFooterButtons()}
        </View>
        <Modal
          animationType={this.state.animationType}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {this._setModalVisible(false)}}
          >
          <ExerciseSelectionScreen
            onCancel={this._setModalVisible.bind(this)}
            onSave={this._addExercises.bind(this)}
            exercises={this.state.exercises}
            presetExercises={this.props.presetExercises} />
        </Modal>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.exerciseModalVisible}
          onRequestClose={() => {this._setExerciseModalVisible(false)}}
          >
          <ExerciseEditScreen
            ref={this.state.activeExerciseID}
            navigator={this.props.navigator}
            actions={this.props.actions}
            key={this.state.activeExerciseID}
            id={this.state.activeExerciseID}
            exercise={this.state.exercises[this.state.activeExerciseID]}
            onAddSet={this._addSet}
            onCancel={this._setExerciseModalVisible}
            onDeleteSet={this._deleteSet}
            onUpdateSet={this._updateSet} />
        </Modal>
      </View>
    )
  }

  renderExcercises() {
    if (Object.keys(this.state.exercises).length) {
      return (
        Object.keys(this.state.exercises).map((key,index) => {
          return this.renderExerciseRow(this.state.exercises[key],key)
        })
      )
    } else return (
      <View style={styles.flex1}>
        <View style={[styles.hCenter,styles.p1, styles.bgAlt2]}>
          <SuperText style={[styles.textBold,styles.textBase3]}>No Exercises</SuperText>
        </View>
      </View>
    )
  }

  renderExerciseRow(exercise,rowID) {
    return(
      <View key={rowID} style={cStyles.exercise}>
        <View style={[styles.flexRow]}>
          <TouchableOpacity  style={cStyles.heading} onPress={(event) => this._setExerciseActive(rowID)}>
            <SuperText style={[styles.textUnderline,styles.textPrimary]} numberOfLines={1}>{exercise.name}</SuperText>
          </TouchableOpacity>
        </View>
        {exercise.sets && Object.keys(exercise.sets).length ? this.renderSets(exercise.sets) : null}
        {this.state.exercisesEditable &&
        <TouchableOpacity style={cStyles.delete} onPress={(event) => this._removeExercise(rowID)}>
          <MaIcon color={styles.colors.secondary} size={16} name={"remove-circle"} />
          <SuperText style={styles.textSecondary}> delete</SuperText>
        </TouchableOpacity>}
      </View>
    )
  }

  renderSets(sets) {
    return (
      <View style={cStyles.sets}>
        {Object.keys(sets).map((key,index) => {
          return this.renderSet(sets[key],key,index)
        })}
      </View>

    )
  }

  renderSet(set,key,index) {
    switch(set.type) {
      // Shouldn't need=
      case 'default':
        return (
          <SuperText style={cStyles.set} key={key}><SuperText style={cStyles.set}>{index+'.'}</SuperText>{set.reps ? set.reps : '0' + " @ " + set.weight ? set.weight : '0'}</SuperText>
        )
      case 'strength':
        return (
          <SuperText style={cStyles.set} key={key}>{(set.reps ? set.reps : '0') + " reps @ " + (set.weight ? set.weight : '0') + ' lbs'}</SuperText>
        )
      case 'cardio':
        if (set.time || set.distance) {
          return (
            <SuperText style={cStyles.set} key={keyx}>{(set.time ? this._formatTime(set.time)+ ' ' : '') + (set.distance ? set.distance + ' mi' : '')}</SuperText>
          )
        } else return <SuperText key={key}>-</SuperText>

      default:
        return (
          <SuperText style={cStyles.set} key={index}>{'Uh oh, something went wrong. error 0001'}</SuperText>
        )
    }
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._navigateBack()}>
          <View style={styles.removeButton}>
            <MaIcon color={styles.colors.secondary} size={18} name={"cancel"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textSecondary]}>cancel</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._doSaveWorkout()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"check-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>save</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  //*************************
  // Events
  //*************************

  /*
  * Sets a set and set type to active for the set keyboard
  * @param {String} id
  * @return undefined
  */

  _setExerciseActive(id) {
    this.setState({
      activeExerciseID: id
    })

    this._setExerciseModalVisible(true)
  }

  _setName(newName) {
    this.setState({name: newName})
  }

  /*
  * Sets the exercises to editable, so they render with a delete overlay
  * @return undefined
  */

  _toggleExerciseEdit() {
    let status = !this.state.exercisesEditable
    this.setState({
      exercisesEditable: status,
      exerciseDataSource: this.ds.cloneWithRows(this.state.exercises)
    })
  }

  /*
  * Controls the save workout process, validates name,
  * and warns user if no exercises are selected
  * @return undefined
  */

  _doSaveWorkout() {
    // Check if name is not blank, error

    if (!this.state.name.length) {
      Alert.alert(
        'Failed to save workout!',
        'Please give your workout a name',
      )
      return false
    }
    // Check workout has exercises, save workout then navigate back, else warn

    if (Object.keys(this.state.exercises).length) {
      if (this._saveWorkout()) {
        this._navigateBack()
      }
    } else {
      Alert.alert(
        'This workout has no exercises',
        'Are you sure you want to save?',
        [
          {text: 'Cancel', null, style: 'cancel'},

          {text: 'Save', onPress: () => {
            if (this._saveWorkout()) {
              this._navigateBack()
            }
          }},
        ]
      )
    }
  }

  /*
  * Saves workout using state name and exercises
  * @return undefined
  */

  _saveWorkout() {
    let id = null
    if (this.props.id) {
      // use id of exisitng to update
      id = this.props.id
    } else {
      // create new unique id
      id = Date.now() + '_workout'
    }
    this.props.actions.addPresetWorkout(id,
      {
        name: this.state.name,
        exercises: this.state.exercises
      }
    )
    return true
  }

  /*
  * Adds a set to a given exercise, rests exercises listview
  * @param {String} exerciseID
  * @param {Object} set
  * @return undefined
  */

  _addSet(exerciseID,set) {
    const newSet = set ? set : {
      type: this.state.exercises[exerciseID].type,
    }

    const setID = Date.now()+'_set'
    let exercisesCopy = this.state.exercises
    let newExercises = {...exercisesCopy,
            [exerciseID] : {
              ...exercisesCopy[exerciseID],
                ['sets']: {
                  ...exercisesCopy[exerciseID]['sets'],
                    [setID]: newSet
                }
            }
          }

    this.setState({
      exercises: newExercises,
      exerciseDataSource: this.ds.cloneWithRows(newExercises)
    })
  }

  /*
  * Updates a set's given type value
  * @param {String} exerciseID
  * @param {String} setID
  * @param {String} type
  * @param {String} value
  * @return undefined
  */

  _updateSet(exerciseID,setID,type,value) {
    const newSet = {
      ...this.state.exercises[exerciseID].sets[setID],
        [type] : value
    }

    let exercisesCopy = this.state.exercises
    let newExercises = {...exercisesCopy,
            [exerciseID] : {
              ...exercisesCopy[exerciseID],
                ['sets']: {
                  ...exercisesCopy[exerciseID]['sets'],
                    [setID]: newSet
                }
            }
          }

    this.setState({
      exercises: newExercises,
      exerciseDataSource: this.ds.cloneWithRows(newExercises)
    })
  }

  /*
  * Deletes given set from given exercise and resets exercise listview
  * @param {String} exerciseID
  * @param {String} setID
  * @return undefined
  */

  _deleteSet(exerciseID,setID) {
    let exercisesCopy = this.state.exercises
    let newExercises = {...exercisesCopy,
            [exerciseID] : {
              ...exercisesCopy[exerciseID],
                ['sets']: {
                  ...this.removeByKey(exercisesCopy[exerciseID]['sets'],setID)
                }
            }
          }

    this.setState({
      exercises: newExercises,
      exerciseDataSource: this.ds.cloneWithRows(newExercises)
    })
  }

  /*
  * Merges newly select exercises to workouts current exercises,
  * resets listview, closes exercise selection modal
  * @param {Object} newExercises
  * @return undefined
  */

  _addExercises(newExercises) {
    // merge the new selected exercises with current selected exercises
    let mergedExercies = {...this.state.exercises, ...newExercises}
    // clone the new exercises into data source
    this.setState({
      exercises: mergedExercies,
      exerciseDataSource: this.ds.cloneWithRows(mergedExercies)
    })
    this._setModalVisible(false)
  }

  /*
  * Removes exercise from workouts current exercise based on id, resets listview
  * @param {String} exerciseID
  * @return undefined
  */

  _removeExercise(exerciseID) {

    let exercises = this.removeByKey(this.state.exercises,exerciseID)
    this.setState({
      exercises: exercises,
      exerciseDataSource: this.ds.cloneWithRows(exercises)
    })
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _setExerciseModalVisible(visible) {
    this.setState({exerciseModalVisible: visible})
  }

  /*
  * Helper function that removes a object by key from given object
  * @param {Object} myObj
  * @param {String} deleteKey
  * @return {Object}
  */

  removeByKey (myObj, deleteKey) {
    return Object.keys(myObj)
      .filter(key => key !== deleteKey)
      .reduce((result, current) => {
        result[current] = myObj[current]
        return result
    }, {})
  }

  //*************************
  // Navigation
  //*************************

  _navigateBack() {
    this.props.navigator.pop();
  }

  _navigateToExerciseSelection() {
    this.props.navigator.push({
      ident: "ExerciseSelection",
      title: "Exercises for " + this.state.name,
      onChange: this.addexercises,
      exercises: this.state.exercises
    })
  }
}

var cStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  },
  delete: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sets: {
    padding: 16,
    paddingBottom: 0
  },
  exercise: {
    backgroundColor: styles.colors.alt2,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: styles.colors.alt1,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    },
    zIndex: 1,
    marginLeft: 16,
    marginRight: 16,
  },

  exercises: {
    flex: 1
  },

  heading: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    flex: 1
  },

  set: {
    color: styles.colors.base2,
    opacity: 0.8,
    fontWeight: 'bold'
  },

  header: {
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },

  pageHeader: {
    backgroundColor: styles.colors.alt2,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex:1
  }

});

function mapStateToProps(state,component) {
  return {
    workout: state.presetWorkouts[component.id]
  }
}

export default connect(mapStateToProps)(WorkoutCreationScreen);
