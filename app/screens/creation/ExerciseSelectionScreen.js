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
  TabBarIOS,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  DatePickerIOS,
  Modal,
  Navigator,
  PickerIOS,
  TextInput,
  InteractionManager,
  LayoutAnimation
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../styles/styles.js'
import ActionBar from '../../components/ActionBar'
import SuperText from '../../components/SuperText'

var _ = require('lodash')

class ExerciseSelectionScreen extends Component {

  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
      exerciseDataSource: this.ds.cloneWithRows(this.props.presetExercises),
      selectedExercises: []
    }

    this._updateExercises = this._updateExercises.bind(this)
    this.renderExerciseRow = this.renderExerciseRow.bind(this)
  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={styles.fullPageWrapper}>
        <View style={styles.row}>
          <SuperText style={[styles.textCenter, styles.fontSize12, styles.textBold, styles.textBase1]}>select <SuperText style={styles.textBold}>exercises to add</SuperText></SuperText>
        </View>
        {this.renderExcercises()}
        {this.renderFooterButtons()}
      </View>
    )
  }

  renderExcercises(){
    return (
      <ListView
        automaticallyAdjustContentInsets={false}
        removeClippedSubviews={false}
        dataSource={this.state.exerciseDataSource}
        renderRow={this.renderExerciseRow}
      />
    )
  }

  renderExerciseRow(exercise, sectionID, rowID){
    if(!Object.keys(this.props.selectedExercises).includes(rowID)) {
      return (
        <TouchableHighlight style={styles.bgAlt2} underlayColor={styles.colors.alt3} onPress={() => this._toggleSelection(rowID, exercise)}>
          <View style={styles.listRow}>
            <View style={styles.flex1}>
              <Text style={[(exercise.selected ? styles.textBase1 : styles.textBase2), (exercise.selected ? styles.textBold : null)]} numberOfLines={1}> {exercise.name} </Text>
            </View>
            {this.renderCheck(rowID, exercise.selected)}
          </View>
        </TouchableHighlight>
      )
    } else return null

  }

  renderCheck(exerciseID,selected) {
    if (Object.keys(this.state.selectedExercises).includes(exerciseID)) {
      return (
        <View style={cStyles.entryRowIcon}>
          <MaIcon style={[styles.textSecondary]} size={16} name="check" />
        </View>
      )
    }
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._updateExercises()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"add"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>add</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  //*************************
  // Events
  //*************************

  _updateExercises() {
    this.props.onChange(this.state.selectedExercises)
    this._navigateBack()
  }

  _toggleSelection(exerciseID,exercise) {
    let tempItems = this.state.selectedExercises

    tempItems[exerciseID] = exercise

    this.setState({
      selectedExercises: tempItems,
      exerciseDataSource: this.ds.cloneWithRows(this.props.presetExercises)
    })

  }

  //*************************
  // Navigation
  //*************************

  _navigateBack() {
    this.props.navigator.pop();
  }

  //*************************
  // Helpers/Misc
  //*************************

  animate() {
    // Animate the update
    LayoutAnimation.easeInEaseOut();
  }

}

var cStyles = StyleSheet.create({

});

module.exports = ExerciseSelectionScreen
