'use strict'
import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  LayoutAnimation
} from 'react-native'

import styles from '../styles/styles.js'
import SuperText from './SuperText'
import MaIcon from 'react-native-vector-icons/MaterialIcons'
import EvIcon from 'react-native-vector-icons/EvilIcons'

import {bindActionCreators} from 'redux'

class Keyboard extends Component{

  constructor(props) {
    super(props)
    this.buttons = {
      keyboardButtonsTop: [
        {
          value:1,
          type:'basic'
        },
        {
          value:2,
          type:'basic'
        },
        {
          value:3,
          type:'basic'
        },
        {
          value: 0,
          type:'basic'
        }
      ],
      keyboardButtonsMiddle: [
        {
          value:4,
          type:'basic'
        },
        {
          value:5,
          type:'basic'
        },
        {
          value:6,
          type:'basic'
        },
        {
          value:'.',
          type:'basic'
        }
      ],

      keyboardButtonsBottom: [
        {
          value:7,
          type:'basic'
        },
        {
          value:8,
          type:'basic'
        },
        {
          value:9,
          type:'basic'
        }
      ]
    }
  }

  render() {
      return (
        <View style={[cStyles.keyboard]}>
          <View style={[cStyles.keyboardHeader]}>
            <TouchableOpacity style={cStyles.addButton} onPress={(event) => this._addSet()}>
              <MaIcon color={this.props.color} size={32} name={"add"} />
            </TouchableOpacity>
            <TouchableOpacity style={cStyles.addButton} onPress={(event) => this.props.onPrevious()}>
              <MaIcon color={this.props.color} size={32} name={"keyboard-arrow-left"} />
            </TouchableOpacity>
            <TouchableOpacity style={cStyles.addButton} onPress={(event) => this.props.onNext()}>
              <MaIcon color={this.props.color} size={32} name={"keyboard-arrow-right"} />
            </TouchableOpacity>
          </View>
          <View style={cStyles.keyboardRow}>
            {this.buttons.keyboardButtonsTop.map((object) => {
              return this.renderButton(object)
            })}
          </View>
          <View style={cStyles.keyboardRow}>
            {this.buttons.keyboardButtonsMiddle.map((object) => {
              return this.renderButton(object)
            })}
          </View>
          <View style={cStyles.keyboardRow}>
            {this.buttons.keyboardButtonsBottom.map((object) => {
              return this.renderButton(object)
            })}
            <View key={'back-button'} style={cStyles.keyboardButtonWrapper}>
              <TouchableOpacity style style={[styles.flex1,cStyles.keyboardButton]}  onPress={(event) => this._doAction({type:'delete'})}>
                <MaIcon style={[styles.flex1,styles.center]} color={styles.colors.white} size={30} name={"backspace"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
  }

  renderButton(object) {
    return(
      <View key={object.value} style={cStyles.keyboardButtonWrapper} >
        <TouchableOpacity style={cStyles.keyboardButton} onPress={(event) => this._doAction(object)} >
          <SuperText style={[styles.textWhite, styles.fontSize24]}>{object.value}</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  _doAction(object) {
    switch (object.type){
      case 'basic':
        (this.props.activeID && this._addToValue(object.value))
        break
      case 'delete':
        this._removeFromValue()
        break
      case 'clear':
        this._clearValue()
        break
      default:
        null
    }
  }


  _addSet(type) {
    this.props.onAddSet(this.props.exerciseID)
  }


  _addToValue(value) {
    const maxLength = 5
    // Do decimal places in time strings dude
    if (this.props.activeType == 'time' && value == '.')
      return

    if (this.props.activeSet[this.props.activeType] && this.props.activeSet[this.props.activeType].length < maxLength || !this.props.activeSet[this.props.activeType]) {
      let newVal = (this.props.activeSet[this.props.activeType] ? this.props.activeSet[this.props.activeType] + value.toString(): value.toString())
      this.props.onUpdate(this.props.exerciseID,this.props.activeID,this.props.activeType,newVal)
    }
  }

  _removeFromValue() {
    if (this.props.activeID && this.props.activeSet[this.props.activeType]) {
      let newVal = this.props.activeSet[this.props.activeType].substring(0,this.props.activeSet[this.props.activeType].length-1)
      this.props.onUpdate(this.props.exerciseID,this.props.activeID,this.props.activeType,newVal)
    }
  }

  _getLabel(type) {
    switch(type) {
      case 'time':
       return ''
      case 'weight':
        return 'lbs'
      case 'distance':
        return 'mi'
      default: return type
    }
  }

  _getValue(value,type) {
    if (type == 'time')
      return this._formatTime(value)
    else return value
  }

  _getPlaceholder(type) {
    if (type == 'time')
      return '-:--'
    else return '-'
  }

  _formatTime(time) {
    let stringA = ''
    if (time.length < 3) {
      stringA = (time.length == 1 ? '00'+time : '0'+time)
    } else {
      stringA = time
    }

    switch(stringA.length) {
      case 3:
        return stringA.slice(0,1) + ':' + stringA.slice(1)
      case 4:
        return stringA.slice(0,2) + ':' + stringA.slice(2,4)
      case 5:
        return stringA.slice(0,1) + ':' + stringA.slice(1,3) + ':' + stringA.slice(3)
    }
  }

  _selectNext() {
    console.log(this.props)
    // TODO clean up
    if (this.props.sets) {
      const exerciseType = this.props.exerciseType,
        setTargetID = this.props.activeID,
        setIDs = Object.keys(this.props.sets),
        numSets = setIDs.length,
        setIndex = setIDs.indexOf(setTargetID)+1

      if (this.props.activeType == 'reps' || this.props.activeType == 'time') {
        // set activeType to distance or weight
        this.props.actions.onSelect(setTargetID, exerciseType == 'cardio' ? 'distance' : 'weight', this.props.sets[setTargetID][exerciseType == 'cardio' ? 'distance' : 'weight'])
      } else {
        if (numSets > setIndex) {
          // set targetID to id of next set
          this.props.actions.onSelect(setIDs[setIndex], exerciseType == 'cardio' ? 'time' : 'reps', this.props.sets[setIDs[setIndex]][exerciseType == 'cardio' ? 'time' : 'reps'])
        }
      }
    }
  }

  _selectPrevious() {
    if (this.props.sets) {
      const exerciseType = this.props.exerciseType,
        setTargetID = this.props.activeID,
        setIDs = Object.keys(this.props.sets),
        numSets = setIDs.length,
        setIndex = setIDs.indexOf(setTargetID)+1

      if (this.props.activeType == 'weight' || this.props.activeType == 'distance') {
        // set activeType to distance or weight
        this.props.actions.setInputTarget(setTargetID, exerciseType == 'cardio' ? 'time' : 'reps', this.props.sets[setTargetID][exerciseType == 'cardio' ? 'time' : 'reps'])

        // update set target id
      } else {
        // if current set is not first go to previous set
        if (setIndex > 1) {
          // set targetID to id of next set
          this.props.actions.setInputTarget(setIDs[setIndex-2], exerciseType == 'cardio' ? 'distance' : 'weight', this.props.sets[setIDs[setIndex-2]][exerciseType == 'cardio' ? 'distance' : 'weight'])
        }
      }
    }
  }
}

const cStyles = StyleSheet.create({
  keyboard: {
    borderColor: styles.colors.base1,
    borderTopWidth: 1,
    backgroundColor: styles.colors.black,
    flexDirection: 'column',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 0
    },
    margin: 0,
    marginTop: 0
  },
  keyboardRow: {
    flexDirection: 'row',
    borderColor: styles.colors.black,
    borderBottomWidth: 1
  },
  keyboardButton: {
    backgroundColor: styles.colors.primaryDark,
    padding: 12,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardButtonWrapper: {
    borderColor: styles.colors.black,
    borderRightWidth: 1,
    flex: 1
  },
  keyboardActionButton: {
    flex:1,
    backgroundColor: styles.colors.secondary,
    padding: 12,
    alignItems: 'center'
  },

  keyboardHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: styles.colors.black,
    backgroundColor: styles.colors.primaryDark,
    padding: 8,
    justifyContent: 'flex-end'
  },

  closeButton: {
    borderLeftWidth: 1,
    borderColor: styles.colors.black,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
  },

  addButton: {
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  }
})

Keyboard.defaultProps = {
  color: styles.colors.primary
}

export default Keyboard
