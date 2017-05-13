'use strict'
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ListView,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  TouchableHighlight,
  TextInput,
  AlertIOS,
  ActionSheetIOS,
  ScrollView
 } from 'react-native';

import SuperText from '../../../components/SuperText'
import MaIcon from 'react-native-vector-icons/MaterialIcons'
import SetEntry from '../../../components/SetEntry'
import Keyboard from '../../../components/Keyboard'

import styles from '../../../styles/styles.js'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as exerciseActions from '../../../actions/exerciseActions'
import * as setActions from '../../../actions/setActions'

class ExerciseEditScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSetId: null,
      loading: false,
      activeSetID: null,
      activeSetType: null,
    }

    this.actionSheetButtons = [
      'Edit Title',
      'Exercise Info',
      'History',
      'Delete',
      'Cancel'
    ]

    // console.log(this.props)
    this._addSet = this._addSet.bind(this)
    this._duplicateSet = this._duplicateSet.bind(this)
    this._deleteSet = this._deleteSet.bind(this)
    this._updateSet = this._updateSet.bind(this)
    this._setActiveSet = this._setActiveSet.bind(this)
    this._selectNext = this._selectNext.bind(this)
    this._selectPrevious = this._selectPrevious.bind(this)
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {

  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={cStyles.modalWrapper}>
        <View style={cStyles.box}>
          <View style={[cStyles.header]}>
            <View style={[styles.flexRow, styles.p1]}>
              <SuperText style={[styles.textAlt2,styles.textExtraBold,styles.flex1]}>{this.props.exercise.name}</SuperText>
            </View>
          </View>
          {this.renderContent()}
        </View>
        <Keyboard
          actions={this.props.actions}
          entryID={this.props.entryID}
          exerciseID={this.props.exerciseID}
          onAddSet={this._addSet}
          onUpdate={this._updateSet}
          onNext={this._selectNext}
          onPrevious={this._selectPrevious}
          activeID={this.state.activeSetID}
          activeType={this.state.activeSetType}
          activeSet={this.props.sets ? this.props.sets[this.state.activeSetID] : null}
          color={styles.colors.primaryAlt}
          />
        {this.renderFooterButtons()}
      </View>
    )
  }

  renderContent() {
    return (
      <ScrollView style={[styles.p1,styles.flex1]} removeClippedSubviews={true}>
        {this.props.sets && Object.keys(this.props.sets).length > 0 && this.renderSetsHeader()}
        {this.renderSets()}
      </ScrollView>
    )
  }

  renderSets() {
    if (this.props.sets && Object.keys(this.props.sets).length) {
      return (
        <View style={cStyles.setRow}>
          {Object.keys(this.props.sets).map((key,index) => {
            return this.renderSetRow(this.props.sets[key], key)
          })}
        </View>
      )
    } else {
      return (
        <View style={[cStyles.placeholder]}>
          <SuperText style={[styles.textBase2,styles.textBold,styles.textItalic, styles.fontSize12]}>No Sets</SuperText>
        </View>
      )
    }
  }

  renderFooterButtons() {
    return (
      <View style={cStyles.footerButtons}>
        <TouchableOpacity style={[cStyles.footerButton]} onPress={(event) => this.props.onCancel(false)}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.secondary} size={18} name={"cancel"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textSecondary, styles.textExtraBold]}>close</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderFooter() {
    if (this.props.exercise.type == 'cardio') {
      return (
        <View style={cStyles.footer}>
          <TouchableOpacity style={cStyles.addButton} onPress={() => this._addSet('cardio')}>
            <MaIcon size={18} name="add-circle" color={styles.colors.primaryAlt}/>
            <SuperText style={[styles.textBold,styles.textPrimaryAlt, styles.fontSize14]}> set</SuperText>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={cStyles.footer}>
        </View>
      )
    }
  }

  renderSetRow (obj,key) {
    return (
      <SetEntry
        textColor={styles.textPrimaryAlt}
        ref={key}
        key={key}
        setID={key}
        set={obj}
        activeID={this.state.activeSetID}
        activeType={this.state.activeSetType}
        exerciseID={this.props.id}
        onDuplicate={this._duplicateSet}
        onDelete={this._deleteSet}
        onUpdate={this._updateSet}
        onSelect={this._setActiveSet}
         />
    )
  }

  renderSetsHeader() {
    switch (this.props.exercise.type) {
      case 'cardio':
        return (
          <View style={styles.flexRow}>
            <View style={styles.flex1}>
              <SuperText style={[styles.textBase2, styles.fontSize12, styles.textBold]}>{'time (h:mm:ss)'}</SuperText>
            </View>
            <View style={styles.flex1}>
              <SuperText style={[styles.textBase2, styles.fontSize12, styles.textBold]}>{'distance'}</SuperText>
            </View>
            <TouchableOpacity style={[cStyles.inputButton]}>
                <MaIcon size={24} name="edit" color={styles.colors.alt2}/>
            </TouchableOpacity>
          </View>
        )
      case 'strength':
        return (
          <View style={styles.flexRow}>
            <View style={styles.flex1}>
              <SuperText style={[styles.textBase2, styles.fontSize12, styles.textBold]}>{'reps'}</SuperText>
            </View>
            <View style={styles.flex1}>
              <SuperText style={[styles.textBase2, styles.fontSize12, styles.textBold]}>{'weight'}</SuperText>
            </View>
            <TouchableOpacity style={[cStyles.inputButton]}>
                <MaIcon size={24} name="edit" color={styles.colors.alt2}/>
            </TouchableOpacity>
          </View>
        )
    }
  }

  //*************************
  // Events
  //*************************

  _showPromptForTitle() {
    AlertIOS.prompt(
      'Enter Title',
      null,
      text => this._setTitle(text),
      'plain-text',
    );
  }

  _setTitle(newTitle) {
    this.setState({title:newTitle})
  }

  _deleteActivity() {
    this.props.onDelete(this.props.entryID,this.props.exerciseID)
  }

  _setActiveSet(setID,type) {
    this.setState({
      activeSetID: setID,
      activeSetType: type
    })
  }

  _addSet(exerciseID) {
    const setID = Date.now()+'_set'
    this.props.actions.addSet({type:this.props.exercise.type},setID,this.props.exerciseID)
  }

  _updateSet(exerciseID,setID,type,value) {
    this.props.actions.updateSetValue(this.props.exerciseID,setID,type,value)
  }

  _duplicateSet(exerciseID,set) {
    const newSetID = Date.now()+'_set'
    this.props.actions.duplicateSet(set, newSetID, this.props.exerciseID)
  }

  _deleteSet(exerciseID,setID) {
    // If set to be removed is currently active for input then clear kearbord
    if (this.state.activeSetID === setID) {
      this.setState({
        activeSetID: null,
        activeSetType: null
      })
    }
    this.props.actions.removeSet(this.props.exerciseID,setID)
  }

  showActionSheet = (title) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: this.actionSheetButtons,
      cancelButtonIndex: 4,
      destructiveButtonIndex: 3,
      title: title
    },
    (buttonIndex) => {
      this.setState({ clicked: this.actionSheetButtons[buttonIndex] })
      this.doAction(buttonIndex)
    })
  }

  doAction = (index) => {
    switch(index) {
      case 0:
        this._showPromptForTitle()
        break
      case 1:
        this._navigateToExerciseInfo()
        break
      case 2:
        this._navigateToHistory()
        break
      case 3:
        this._deleteActivity()
        break
      default:
        null
    }
  }

  _selectNext() {
    if (this.props.sets) {
      const exerciseType = this.props.exercise.type,
        setTargetID = this.state.activeSetID,
        setIDs = Object.keys(this.props.sets),
        numSets = setIDs.length,
        setIndex = setIDs.indexOf(setTargetID)+1

      if (this.state.activeSetType == 'reps' || this.state.activeSetType == 'time') {
        // set activeType to distance or weight
        this.setState({
          activeSetID: setTargetID,
          activeSetType: exerciseType == 'cardio' ? 'distance' : 'weight'
        })
      } else {
        if (numSets > setIndex) {
          // set targetID to id of next set
          this.setState({
            activeSetID: setIDs[setIndex],
            activeSetType: exerciseType == 'cardio' ? 'time' : 'reps'
          })
        }
      }
    }
  }

  _selectPrevious() {
    if (this.props.sets) {
      const exerciseType = this.props.exercise.type,
        setTargetID = this.state.activeSetID,
        setIDs = Object.keys(this.props.sets),
        numSets = setIDs.length,
        setIndex = setIDs.indexOf(setTargetID)+1

      if (this.state.activeSetType == 'weight' || this.state.activeSetType == 'distance') {
        // set activeType to distance or weight
        this.setState({
          activeSetID: setTargetID,
          activeSetType: exerciseType == 'cardio' ? 'time' : 'reps',
        })
      } else {
        // if current set is not first go to previous set
        if (setIndex > 1) {
          this.setState({
            activeSetID: setIDs[setIndex-2],
            activeSetType: exerciseType == 'cardio' ? 'distance' : 'weight'
          })
        }
      }
    }
  }

  //*************************
  // Helpers/Misc
  //*************************

  animate() {
    // Animate the update
    LayoutAnimation.easeInEaseOut();
  }

}

//*************************
// Component Styles
//*************************

const cStyles = StyleSheet.create({
  box: {
    backgroundColor: styles.colors.alt2,
    margin: 12,
    marginBottom: 16,
    flex: 1,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex: 1
  },

  header: {
    backgroundColor: styles.colors.primaryAlt,
    flexDirection: 'row'
  },

  setRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderColor: styles.colors.base2
  },

  addButton: {
    padding: 16,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  inputButton: {
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },

  footer: {
    flexDirection: 'row',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: -1,
      width: 0
    },
    zIndex: 1
  },

  placeholder: {
    padding: 12,
    alignItems: 'center'
  },
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    flex: 1,
    paddingTop: 20
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: styles.colors.primaryDark,
  },
  footerButton: {
    padding: 14,
    paddingLeft: 0,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
})

function mapStateToProps(state,component) {
  return {
    sets: state.sets[component.exerciseID],
    keyboard: state.keyboard
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators({...exerciseActions,...setActions}, dispatch)
  })
)(ExerciseEditScreen)
