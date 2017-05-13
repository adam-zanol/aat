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
  LayoutAnimation,
  KeyboardAvoidingView,
  ActionSheetIOS,
  InteractionManager,
  Modal,
  TextInput,
  Alert
} from 'react-native'

import _ from 'lodash'
import SuperText from '../../components/SuperText'
import ExerciseEntry from './components/ExerciseEntry'
import ExerciseEditScreen from './components/ExerciseEditScreen'
import MaIcon from 'react-native-vector-icons/MaterialIcons'
import ExerciseSelectionScreen from '../other/ExerciseSelectionScreen'
import styles from '../../styles/styles.js'
import Spinner from 'react-native-loading-spinner-overlay'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as exerciseActions from '../../actions/exerciseActions'
import * as entryActions from '../../actions/entryActions'
import * as setActions from '../../actions/setActions'
import firebaseApp from '../../Firebase.js'

var dismissKeyboard = require('dismissKeyboard');

const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

const timeStringOptions = {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
}

class EntryDetailScreen extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })

    this.state = {
      modalVisible: false,
      exerciseModalVisible: false,
      loading: false,
      presetExerciseDateSource: this.ds.cloneWithRows(this.props.presetExercises),
      scrollYOffset: 0,
      scrollHeight: 0,
      activeExerciseID: null,
      weight: this.props.entry.weight ? this.props.entry.weight : '',
      calories: this.props.entry.calories ? this.props.entry.calories : '',
      notes: this.props.entry.notes ? this.props.entry.notes : '',
      exercisesEditable: false
    }

    this.renderExerciseRow = this.renderExerciseRow.bind(this)
    this._navigateBack = this._navigateBack.bind(this)
    this._deleteExercise = this._deleteExercise.bind(this)
    this._addExercises = this._addExercises.bind(this)
    this._setModalVisible = this._setModalVisible.bind(this)
    this._setExerciseModalVisible = this._setExerciseModalVisible.bind(this)
    this._setExerciseActive = this._setExerciseActive.bind(this)
    this._showActionSheet = this._showActionSheet.bind(this)
    this._reorderExercise = this._reorderExercise.bind(this)

    this.actionSheetButtons = [
      'Edit Title',
      'History',
      'Delete',
      'Cancel'
    ]

    this.auth = firebaseApp.auth()
    this.database = firebaseApp.database()
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  //*************************
  // Render
  //*************************

  render() {
    // check if entry still exists, once it is deleted from on this screen, this page will still render until it is done animating
    if (this.props.entry) {
      return (
        <View style={[styles.fullPageWrapper]}>
          <View style={[cStyles.entryInfo]}>
            <View style={styles.flexRow}>
              <View style={[styles.p1, styles.flex1]}>
                <SuperText style={[styles.textBold, styles.textBase1]}>{this.props.dateString}</SuperText>
              </View>
            </View>
            <View style={styles.rowRight}>
              <TouchableOpacity style={styles.buttonOptions} onPress={() => this._setModalVisible(true)}>
                <View style={styles.addButton}>
                  <MaIcon color={styles.colors.primaryAlt} size={18} name={"add-circle"} />
                </View>
                <SuperText style={styles.textPrimaryAlt}>add</SuperText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonOptions} onPress={(event) => this._toggleExercisesEditable()}>
                <View style={styles.addButton}>
                  <MaIcon color={this.state.exercisesEditable ? styles.colors.primaryAlt : styles.colors.grayLight} size={18} name={"edit"} />
                </View>
                <SuperText style={this.state.exercisesEditable ? styles.textPrimaryAlt : styles.textLight}>edit</SuperText>
              </TouchableOpacity>
            </View>
          </View>
          <KeyboardAvoidingView behavior={'position'} style={[styles.scrollContentWrapper]}>
            <ScrollView
              automaticallyAdjustContentInsets={true}
              ref="exercisesScrollView"
              pageSize={3}>
              <View style={[cStyles.activityBox]} ref="activityBox">
                <View style={cStyles.header}>
                  <SuperText style={[styles.textBold,styles.textBase3,styles.flex1]}>exercises</SuperText>
                </View>
                {this.renderExercises()}
              </View>
              {this.renderInputSection()}
            </ScrollView>
          </KeyboardAvoidingView>
          {this.renderFooterButtons()}
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {this._setModalVisible(false)}}
            >
            <ExerciseSelectionScreen
              headerColor={styles.colors.primaryAlt}
              onCancel={this._setModalVisible.bind(this)}
              onSave={this._addExercises.bind(this)} />
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
              entryID={this.props.id}
              exerciseID={this.state.activeExerciseID}
              exercise={this.props.exercises[this.state.activeExerciseID]}
              exercises={this.props.exercises}
              onDelete={this.deleteExercise}
              onCancel={this._setExerciseModalVisible}
              onSave={this._addExercises} />
          </Modal>
        </View>
      )
    } else return null
  }

  renderExercises() {
    if (this.props.entry.exercises && this.props.entry.exercises.length) {
      return (
        this.props.entry.exercises.map((key,index) => {
          return this.renderExerciseRow(this.props.exercises[key], key)
        })
      )
    } else {
      return (
        <View style={styles.m1}>
          <SuperText style={[styles.textBase3, styles.textItalic, styles.textCenter]}>No Exercises</SuperText>
        </View>
      )
    }
  }

  renderExerciseRow(obj, key) {
    let exercise = this.props.exercises[key]
    return (
      <ExerciseEntry
        key={key}
        exercise={exercise}
        id={key}
        entryID={this.props.id}
        onPress={this._setExerciseActive}
        onDelete={this._deleteExercise}
        editable={this.state.exercisesEditable}
        onOrderChange={this._reorderExercise}
        onOptionsPress={this._showActionSheet} />
    )
  }

  renderInputSection() {
    return (
      <View style={[cStyles.inputSection]}>
        <View style={cStyles.header}>
          <SuperText style={[styles.textBold,styles.textBase3,styles.flex1]}>notes</SuperText>
        </View>
        <View style={[cStyles.notes,(this.state.notesSelected ? cStyles.notesSelected : null )]}>
          <TextInput
              style={cStyles.noteInput}
              onChangeText={(text) => this._updateNotes(text)}
              value={this.props.entry.notes}
              placeholderTextColor={styles.colors.grayLight}
              keyboardAppearance="dark"
              multiline={true}
              placeholder="add notes..."
              autoCorrect={false}
            />
        </View>
      </View>
    )
  }

  renderFooterButtons() {
    let sharedDate = null

    if (this.props.entry.dateShared) {
      let date = new Date(this.props.entry.dateShared)
      sharedDate = date.toLocaleTimeString("en-us", timeStringOptions)
    }

    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._doShareWorkout()}>
          <View style={styles.addButton}>
            <MaIcon color={this.props.entry.shared ? styles.colors.tertiary : styles.colors.alt3} size={18} name={"share"} />
          </View>
          <View style={styles.flexCol}>
            <SuperText style={[styles.fontSize16,(this.props.entry.shared ? styles.textTertiary : styles.textLight)]}>{this.props.entry.shared ? 'shared' : 'share'}</SuperText>
            {sharedDate ? <SuperText style={styles.fontSize8}>({sharedDate})</SuperText> : null}
          </View>
      </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._toggleComplete()}>
          <View style={styles.addButton}>
            <MaIcon color={this.props.entry.completed ? styles.colors.primaryAlt : styles.colors.alt3} size={18} name={"check"} />
          </View>
          <SuperText style={[styles.fontSize16,(this.props.entry.completed ? styles.textPrimaryAlt : styles.textLight)]}>{this.props.entry.completed ? 'completed' : 'complete'}</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  //*************************
  // Navigation
  //*************************

  _navigateBack() {
    this.props.navigator.pop()
  }

  _navigateToHistory(exerciseID) {
    this.props.navigator.push({
      ident: "ExerciseHistory",
      title: 'History of '+this.props.exercises[exerciseID].name,
      name: this.props.exercises[exerciseID].name
    })
  }

  _navigateToExerciseInfo() {

  }

  //*************************
  // Events
  //*************************

  _toggleExercisesEditable() {
    const editable = this.state.exercisesEditable
    this.setState({
      exercisesEditable: !editable
    })
  }

  _toggleComplete() {
    this.props.actions.toggleComplete(this.props.id, this.props.entry.completed)
  }

  _updateNotes(text) {
    this.props.actions.updateNotes(this.props.id, text)
  }

  _reorderExercise(exerciseID,direction) {
    this.props.actions.reorderExercise(this.props.id,exerciseID,direction)
    LayoutAnimation.easeInEaseOut()
  }

  _setExerciseActive(id,exercise) {
    this.setState({
      activeExerciseID:id,
      exerciseModalVisible:true
    })
  }

  _addExercises(exercises) {
    let id = Date.now()+'ex'
    Object.keys(exercises).map(function(key,index) {
      const exercise = exercises[key],
        id = Date.now() + exercise.name
      this.props.actions.addExerciseToEntry(this.props.id,id)
      this.props.actions.addExercise({
        name: exercise.name,
        type: exercise.type
      },id,this.props.id)
    },this)
    this._setModalVisible(false)

    LayoutAnimation.easeInEaseOut()

  }

  _deleteExercise(entryID, exerciseID) {
    this.props.actions.removeExerciseFromEntry(entryID, exerciseID)
    this.props.actions.removeExercise(entryID, exerciseID)
    this.props.actions.removeSets(exerciseID)

    LayoutAnimation.easeInEaseOut()
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }

  _setExerciseModalVisible(visible) {
    this.setState({exerciseModalVisible: visible})
  }

  _showActionSheet = (title,exerciseID) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: this.actionSheetButtons,
      cancelButtonIndex: 3,
      destructiveButtonIndex: 2,
      title: title
    },
    (buttonIndex) => {
      this.setState({ clicked: this.actionSheetButtons[buttonIndex] })
      this._doAction(buttonIndex,exerciseID)
    })
  }

  _doAction = (index,exerciseID) => {
    switch(index) {
      case 0:
        this._navigateToExerciseInfo()
        break
      case 1:
        this._navigateToHistory(exerciseID)
        break
      case 2:
        this._deleteExercise(this.props.id,exerciseID)
        break
      default:
        null
    }
  }

  _doShareWorkout() {
    if (this.props.entry.shared) {
        let date = new Date(this.props.entry.dateShared)
        let sharedDate = date.toLocaleTimeString("en-us", timeStringOptions)
        Alert.alert(
          'This workout entry was shared on '+sharedDate,
          'What would you like to do?',
          [
            {text: 'Cancel', null, style: 'cancel'},
            {text: 'Share Again', onPress: () => this._shareWorkout()},
            {text: 'Unshare', onPress: () => this._removeSharedWorkout()},
          ]
        )
      } else this._shareWorkout()

  }

  _shareWorkout() {
    // check if user is logged in
    if (this.auth.currentUser) {
      // user is logged in

      let sharedWorkoutsRef = this.database.ref('shared_activity/'+this.auth.currentUser.uid)

      let exercises = Object.assign({},this.props.exercises)

      // add sets to exercises before we push complete entry to firebase
      Object.keys(exercises).map((key,index) => {
        if(this.props.sets[key]) {
          exercises[key] = {...exercises[key],['sets']:this.props.sets[key]}
        }
      })

      // Use .update so it updates if already shared or pushes if not
      sharedWorkoutsRef.update({
        [this.props.entry.id] : {
          exercises: exercises,
            ...this.props.entry
        }
      }).then(() => {
        this.props.actions.toggleShared(this.props.id,true,Date.now())
      })
    } else {
      Alert.alert(
        'You must login before sharing a workout',
      )
    }
  }

  _removeSharedWorkout() {
    if (this.auth.currentUser) {
      // set shared to false
      this.props.actions.toggleShared(this.props.id,false,null)

      // remove from firebase
      let sharedWorkoutsRef = this.database.ref('shared_activity/'+this.auth.currentUser.uid)
      sharedWorkoutsRef.child(this.props.entry.id).remove()
    } else {
      Alert.alert(
        'You must login before un sharing this workout',
      )
    }

  }

  //*************************
  // Misc/Helpers
  //*************************


}

//*************************
// Component Styles
//*************************

const cStyles = StyleSheet.create({

  activityBox: {
    flex: 1,
    marginBottom: 16,
    marginTop: 16
  },
  titleBarButton: {
    flex: 1,
    padding: 8,
  },
  addIcon: {
    padding: 16,
  },
  entryInfo: {
    flexDirection: 'row',
    backgroundColor: styles.colors.alt2,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex:1
  },
  stats: {
    marginBottom: 16,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
  notes: {
    margin: 16,
    padding: 16,
    marginTop: 0,
    backgroundColor: styles.colors.alt2,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    },
    zIndex:1,
    borderLeftWidth: 2,
    borderColor: styles.colors.primaryAlt,
  },

  noteInput: {
    height: 160,
    color: styles.colors.base2,
    fontSize: 14
  },
  inputSectionSelected: {
    top: 16,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 10
  },
  inputWrapper: {
    padding: 10,
    backgroundColor: styles.colors.alt2,
    borderLeftWidth: 2,
    borderColor: styles.colors.primaryAlt,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    },
  },

  header: {
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row'
  }
});

function mapStateToProps(state,component) {
  return {
    entry: state.entries[component.id],
    exercises: state.exercises[component.id] ? state.exercises[component.id] : {},
    // Only get the sets we care about
    sets: state.exercises[component.id] ?  _.zipObject(Object.keys(state.exercises[component.id]),Object.keys(state.exercises[component.id]).map(function(key,index) {
      return state.sets[key]
    })) : null
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators({...entryActions,...exerciseActions,...setActions}, dispatch)
  })
)(EntryDetailScreen);
