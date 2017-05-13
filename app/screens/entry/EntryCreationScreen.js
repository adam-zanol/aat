'use strict'
import React, {
  Component,
} from 'react';

import {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Modal,
  DatePickerIOS,
  InteractionManager,
  ActivityIndicator
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import Action from '../../components/ActionBar'
import SuperText from '../../components/SuperText'

import styles from '../../styles/styles.js'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as entryActions from '../../actions/entryActions';
import * as exerciseActions from '../../actions/exerciseActions'
import * as setActions from '../../actions/setActions'

var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

class EntryCreationScreen extends Component {
  static defaultProps = {
    date: new Date(),
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  }

  ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2
  })

  colors = [
    '#179FE5',
    '#116e9e',
    '#0d5174',
    '#073249',
    '#020d13',
  ]

  constructor(props) {
    super(props)

    // Bind functions that are used as callbacks

    this.renderWorkoutItem = this.renderWorkoutItem.bind(this)
    this._navigateBack = this._navigateBack.bind(this)
    this._createEntry = this._createEntry.bind(this)

    this.state = {
      selectedColor: this.colors[0],
      date: this.props.date,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      animationType: 'slide',
      modalVisible: false,
      selectedWorkoutName: 'Custom',
      selectedWorkoutID: '1',
      workoutDataSource: this.ds.cloneWithRows({...this.props.presetWorkouts, ['1']: {name: 'Custom', exercises: {}}})
    }

  }

  componentDidMount() {

  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={styles.fullPageWrapper}>
       <View style={[styles.contentWrapper]}>
         <TouchableOpacity style={[cStyles.header]} onPress={(event) => this._setModalVisible(true,'dateSelect')} activeOpacity={0.7}>
           <SuperText style={[styles.textBold,styles.textPrimaryAlt, styles.textUnderline]}> {monthNames[this.state.date.getMonth()] + ' ' + this.state.date.getDate() + ', ' + this.state.date.getFullYear()}</SuperText>
         </TouchableOpacity>
         <View style={cStyles.colorSelectors}>
           {this.colors.map((color) => {
             return (<TouchableOpacity style={[cStyles.colorSelector,{backgroundColor:color},(color == this.state.selectedColor ? cStyles.colorSelected : null)]} key={color} onPress={(event) => this.setState({selectedColor:color})}/>)
           })}
         </View>
         <View style={[styles.row, styles.hCenter]}>
           <SuperText>select a <SuperText style={[styles.textBold]}>workout</SuperText></SuperText>
         </View>
         <ListView
           style={[cStyles.workoutList]}
           automaticallyAdjustContentInsets={false}
           removeClippedSubviews={false}
           dataSource={this.state.workoutDataSource}
           renderRow={this.renderWorkoutItem}
           enableEmptySections={true}
         />
       </View>
     <Modal
       animationType={this.state.animationType}
       transparent={true}
       visible={this.state.modalVisible}
       onRequestClose={() => {this._setModalVisible(false)}}
       >
       <View style={[cStyles.container]}>
         <TouchableOpacity style={styles.flex1} onPress={() => {this._setModalVisible(false)}}>
         </TouchableOpacity>
          {this._renderModal()}
       </View>
     </Modal>
     {this.renderFooterButtons()}
   </View>
    )
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
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._createEntry()}>
          <View style={styles.removeButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"check-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>save</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderWorkoutItem(workout,sectionID,rowID) {
    // rowID = key of object
    return (
      <TouchableHighlight style={[cStyles.workoutItem]} onPress={(event) => this._setWorkout(workout,rowID)} underlayColor={styles.colors.alt3}>
        <View>
          <View style={cStyles.workoutItemHeader}>
            <View style={styles.flexRow}>
              <SuperText style={[styles.textBold,(this.state.selectedWorkoutID == rowID ? styles.textPrimaryAlt : styles.textBase1 )]}>{workout.name}</SuperText>
              <View style={[styles.flex1, styles.rightAlign]}>
                {this._renderCheck(this.state.selectedWorkoutID == rowID)}
              </View>
            </View>
          </View>
          {Object.keys(workout.exercises).length ? Object.keys(workout.exercises).map((key,index) => {
            return (
              <View key={key}>
                <SuperText style={[styles.fontSize14,styles.textBase3]}>{workout.exercises[key].name}</SuperText>
              </View>
            )
          }) : <SuperText style={[styles.fontSize14,styles.textBase3]}>Add exercises as you go</SuperText>}
        </View>
      </TouchableHighlight>
    )
  }

  _renderCheck(selected) {
    if (selected) {
      return (
        <View style={cStyles.entryRowIcon}>
          <MaIcon style={[styles.textPrimaryAlt]} size={16} name="check" />
        </View>
      )
    }
  }

  _renderModal() {
    return (
      <View style={[styles.boxShadow,styles.bgWhite]}>
        <DatePickerIOS
          date={this.state.date}
          mode="date"
          timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
          onDateChange={this._onDateChange.bind(this)}
        />
        <View style={[styles.footerButtons]}>
          <TouchableOpacity style={[styles.footerButton]} onPress={this._setModalVisible.bind(this, false)}>
            <View style={styles.removeButton}>
              <MaIcon color={styles.colors.secondary} size={18} name={"cancel"} />
            </View>
            <SuperText style={[styles.fontSize16,styles.textSecondary]}>close</SuperText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //*************************
  // Events
  //*************************

  _onDateChange(date) {
    this.setState({date: date});
  }

  /*
  * Sets workout selection
  * @param {Object} workout
  * @param {String} id
  * @return undefined
  */

  _setWorkout(workout,id) {
    this.setState({
      selectedWorkoutName: workout.name,
      selectedWorkoutID: id,
      workoutDataSource: this.ds.cloneWithRows({...this.props.presetWorkouts, ['1']: {name: 'Custom', exercises: {}}}),
    })
  }

  // Modal Events

  _setModalVisible(visible, type) {
    this.setState({modalVisible: visible, modalType: type});
  }

  /*
  * Creates new entry based on select exercise, color, and date
  * @return undefined
  */

  _createEntry() {
    // create a unique ID TODO make better unique ID's
    const entryID = this.state.selectedWorkoutName + Date.now()

    let newExercises = {}

    // Get exercises of preset workout and save it into 'exercises' if not a custom workout
    if (this.state.selectedWorkoutID != 1) {
      newExercises = this.props.presetWorkouts[this.state.selectedWorkoutID].exercises
    }

    let newEntry = {
      day: this.state.date.getDate(),
      month: this.state.date.getMonth(),
      year: this.state.date.getFullYear(),
      fullDate: this.state.date.getTime(),
      id: entryID,
      name: this.state.selectedWorkoutName,
      presetWorkoutID: this.state.selectedWorkoutID,
      completed: false,
      color: this.state.selectedColor,
      exercises: Object.keys(newExercises)
    }

    // Save the entry + exercises
    this._saveEntry(entryID, newEntry, newExercises)
  }

  /*
  * Creates new entry
  * @param {String} entryID
  * @param {Object} entry
  * @param {Object} exercises
  * @return undefined
  */

  _saveEntry(entryID, entry, exercises) {

    let exerciseIDs = new Array()
    // Add the exercises for the workout to 'exercises', 1 at a time to create unique ID
    Object.keys(exercises).map(function(key,index) {
      const exercise = exercises[key],
        exerciseID = Date.now() + exercise.name
      // Add the sets 1 at a time to create unique id
      if (exercise.sets && Object.keys(exercise.sets).length) {
        Object.keys(exercise.sets).map(function(key,index) {
          const set =  exercise.sets[key],
            setID = Date.now() + 'set' + index
          this.props.actions.addSet(set,setID,exerciseID)
        },this)
      }

      this.props.actions.addExercise({
        tags: exercise.tags,
        name: exercise.name,
        type: exercise.type,
      },exerciseID,entryID)
      exerciseIDs.push(exerciseID)
    },this)

    // Add the new entry to 'entries' with the created exerciseID array
    this.props.actions.addEntry({...entry,exercises:exerciseIDs})

    // Navigate to overview page
    this._navigateBack()
  }

  //*************************
  // Navigation
  //*************************

  _navigateBack() {
    this.props.navigator.pop()
  }
}

var cStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  workoutItem: {
    padding: 16,
    backgroundColor: styles.colors.alt2,
    margin: 12,
    marginTop: 0,
    flex: 1,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    },
  },
  workoutList: {
    backgroundColor: styles.colors.alt1,
  },
  workoutItemHeader: {
    marginBottom: 4,
  },
  header: {
    backgroundColor: styles.colors.alt2,
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: styles.colors.alt1
  },
  colorSelectors: {
    flexDirection: 'row',
    backgroundColor: styles.colors.alt2,
    padding: 16,
  },
  colorSelector: {
    marginLeft: 12,
    marginRight: 12,
    flex: 1,
    height: 32,
  },
  colorSelected: {
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 2
    },
  }
})

export default connect(state => ({
    presetWorkouts: state.presetWorkouts
  }),
  (dispatch) => ({
    actions: bindActionCreators({...entryActions,...exerciseActions, ...setActions}, dispatch)
  })
)(EntryCreationScreen);
