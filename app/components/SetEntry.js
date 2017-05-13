'use strict'
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  LayoutAnimation,
  PickerIOS,
  ActionSheetIOS,
  Animated
 } from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import SuperText from './SuperText'

var PickerItemIOS = PickerIOS.Item;

import styles from '../styles/styles.js'

class SetEntry extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reps: this.props.set.reps ? this.props.set.reps.toString() : '',
      weight: this.props.set.weight ? this.props.set.weight.toString() : '',
      text: this.props.set.text ? this.props.set.text : '',
    }

    this.actionSheetButtons = [
      'Duplicate',
      'Delete',
      'Cancel'
    ]
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View ref="baseComponent">
        {this.renderSet()}
      </View>
    )
  }

  renderSet() {
    switch(this.props.set.type) {
      case 'strength':
        return (
          <View>
            <View style={[styles.rowContentSmall]}>
              <View style={[styles.rowFlex, cStyles.inputBox]}>
                <TouchableHighlight style={[styles.flex,styles.center,cStyles.inputWrapper,(this.props.setID === this.props.activeID && this.props.activeType === 'reps' ? styles.bgPrimaryDark : null)]} onPress={(event) => this.props.onSelect(this.props.setID,'reps')} underlayColor={styles.colors.base1}>
                  <View>
                    <SuperText style={[styles.fontSize24,(this.props.setID === this.props.activeID && this.props.activeType === 'reps' ? this.props.textColor : styles.textBase2 )]}>{this.props.set.reps ? this.props.set.reps : ''}</SuperText>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style={[styles.flex,styles.center,cStyles.inputWrapper,(this.props.setID === this.props.activeID && this.props.activeType === 'weight' ? styles.bgPrimaryDark : null)]} onPress={(event) => this.props.onSelect(this.props.setID,'weight')} underlayColor={styles.colors.base1}>
                  <View>
                    <SuperText style={[styles.fontSize24,(this.props.setID === this.props.activeID && this.props.activeType === 'weight'  ? this.props.textColor : styles.textBase2 )]}>{this.props.set.weight ? this.props.set.weight : ''}</SuperText>
                  </View>
                </TouchableHighlight>
                <View style={cStyles.inputButtonWrapper}>
                  <TouchableOpacity style={cStyles.inputButton} onPress={() => this.showActionSheet()}>
                      <MaIcon size={24} name="more-vert" color={styles.colors.base1}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )
      case 'cardio':
        return (
          <View>
            <View style={[styles.rowContentSmall]}>
              <View style={[styles.rowFlex, cStyles.inputBox]}>
                <TouchableHighlight style={[styles.flex,styles.center,cStyles.inputWrapper,(this.props.setID === this.props.activeID && this.props.activeType === 'time' ? styles.bgPrimaryDark : null)]} onPress={(event) => this.props.onSelect(this.props.setID,'time')} underlayColor={styles.colors.base1}>
                  <View>
                    <SuperText style={[styles.fontSize24,(this.props.setID === this.props.activeID && this.props.activeType === 'time' ? this.props.textColor : styles.textBase2)]}>{this.props.set.time ? this._formatTime(this.props.set.time) : ''}</SuperText>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style={[styles.flex,styles.center,cStyles.inputWrapper,(this.props.setID === this.props.activeID && this.props.activeType === 'distance' ? styles.bgPrimaryDark : null)]} onPress={(event) => this.props.onSelect(this.props.setID,'distance')} underlayColor={styles.colors.base1}>
                  <View>
                    <SuperText style={[styles.fontSize24,(this.props.setID === this.props.activeID && this.props.activeType === 'distance' ? this.props.textColor : styles.textBase2)]}>{this.props.set.distance ? this.props.set.distance : ''}</SuperText>
                  </View>
                </TouchableHighlight>
                <View style={cStyles.inputButtonWrapper}>
                  <TouchableOpacity
                    style={[cStyles.inputButton]}
                    onPress={() => this.showActionSheet()}>
                      <MaIcon size={24} name="more-vert" color={styles.colors.base1}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )
      default:
        return null
      }
  }


  //*************************
  // Events
  //*************************

  setPrompt = (fn) => {
    AlertIOS.prompt(
      'Enter Title',
      null,
      text => fn(text),
      'plain-text',
    );
  }

  showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: this.actionSheetButtons,
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1,
    },
    (buttonIndex) => {
      this.doAction(buttonIndex)
    })

  }

  doAction = (index) => {
    switch(index) {
      case 0:
        this.props.onDuplicate(this.props.exerciseID,this.props.set)
        break
      case 1:
        this.props.onDelete(this.props.exerciseID,this.props.setID)
        break
      default:
        null
    }
  }

  //*************************
  // Helpers/Misc
  //*************************

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


}

//*************************
// Component Styles
//*************************

const cStyles = StyleSheet.create({
  setButton: {
    backgroundColor: styles.colors.secondary,
    padding: 10,
    alignItems: 'center',
  },

  inputWrapper: {
    borderLeftWidth: 1,
    borderColor: styles.colors.base2,
    padding: 4,
    paddingLeft: 4,
    backgroundColor: styles.colors.alt2
  },

  inputButton: {
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },

  inputButtonWrapper: {
    borderLeftWidth: 1,
    borderColor: styles.colors.base2,
  },

  inputBox: {
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: styles.colors.base2,
    borderTopWidth: 0
  }

})

SetEntry.defaultProps = {
  textColor: styles.textPrimary
}

module.exports = SetEntry
