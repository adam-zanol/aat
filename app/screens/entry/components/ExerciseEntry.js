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
  KeyboardAvoidingView,
  TouchableHighlight,
  TextInput,
  AlertIOS,
  ActionSheetIOS,
  InteractionManager,
  ScrollView
 } from 'react-native';

import SuperText from '../../../components/SuperText'
import MaIcon from 'react-native-vector-icons/MaterialIcons'

import styles from '../../../styles/styles.js'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as exerciseActions from '../../../actions/exerciseActions'
import * as setActions from '../../../actions/setActions'

class ExerciseEntry extends Component {
  constructor(props) {
    super(props)

  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={cStyles.exerciseItem} key={this.props.id}>
        <View style={styles.flexRow}>
          <TouchableOpacity style={cStyles.heading} onPress={() => this.props.onPress(this.props.id,this.props.exercise)} underlayColor={styles.colors.alt3}>
            <View style={styles.flexRow}>
              <SuperText style={[styles.fontSize12,styles.textPrimaryAlt,styles.textBold,styles.textUnderline]}>{this.props.exercise.name} </SuperText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={cStyles.buttonOptions} onPress={() => this.props.onOptionsPress(this.props.exercise.name,this.props.id)}>
              <MaIcon size={16} name="more-vert" color={styles.colors.base2}/>
          </TouchableOpacity>
        </View>
        {this.renderSets()}
        {this.props.editable ?
          (<View style={cStyles.delete}>
            <TouchableOpacity style={[styles.flexRow,styles.center,styles.flex1]} onPress={(event) => this.props.onDelete(this.props.entryID,this.props.id)}>
              <MaIcon color={styles.colors.secondary} size={14} name={"remove-circle"} />
              <SuperText style={[styles.textSecondary,styles.fontSize12]}> delete</SuperText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.center]} onPress={(event) => this.props.onOrderChange(this.props.id,'up')}>
              <MaIcon color={styles.colors.base1} size={20} name={"arrow-drop-up"} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.center]} onPress={(event) => this.props.onOrderChange(this.props.id,'down')}>
              <MaIcon color={styles.colors.base1} size={20} name={"arrow-drop-down"} />
            </TouchableOpacity>
          </View>) : null }
      </View>
    )
  }

  renderSets() {
    if (this.props.sets && Object.keys(this.props.sets).length) {
      return (
        <View style={cStyles.sets}>
          {Object.keys(this.props.sets).map((key,index) => {
            return this.renderSet(this.props.sets[key],this.props.sets[key].type,index)
          })}
        </View>
      )
    } else {
      return (
        null
      )
    }
  }

  renderSet(set,type,index) {
    switch(set.type) {
      // Shouldn't need=
      case 'default':
        return (
          <SuperText style={cStyles.set} key={index}><SuperText style={cStyles.set}>{index+'.'}</SuperText>{set.reps ? set.reps : '0' + " @ " + set.weight ? set.weight : '0'}</SuperText>
        )
      case 'strength':
        return (
          <SuperText style={cStyles.set} key={index}>{(set.reps ? set.reps : '0') + " reps " + (set.weight ? set.weight : '0') + ' lbs'}</SuperText>
        )
      case 'cardio':
        if (set.time || set.distance) {
          return (
            <SuperText style={cStyles.set} key={index}>{(set.time ? this._formatTime(set.time)+ ' ' : '') + (set.distance ? set.distance + ' mi' : '')}</SuperText>
          )
        } else return <SuperText key={index}>-</SuperText>

      default:
        return (
          <SuperText style={cStyles.set} key={index}>{'Uh oh, something went wrong. error 0001'}</SuperText>
        )
    }
  }

  //*************************
  // Events
  //*************************


  //*************************
  // Navigation
  //*************************

  _navigateToHistory() {
    this.props.navigator.push({
      ident: "ExerciseHistory",
      title: 'History of '+this.props.name,
      name: this.props.name
    })
  }

  _navigateToExerciseInfo() {

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

  animate() {
    // Animate the update
    LayoutAnimation.easeInEaseOut();
  }

}

//*************************
// Component Styles
//*************************

const cStyles = StyleSheet.create({
  exerciseItem: {
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
    marginRight: 16
  },

  buttonOptions: {
    padding: 16,
    paddingBottom: 0
  },

  sets: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12
  },

  set: {
    color: styles.colors.base2,
  },

  heading: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    flex: 1
  },

  delete: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center'
  }
})

function mapStateToProps(state,component) {
  return {
    sets: state.sets[component.id],
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators({...exerciseActions,...setActions}, dispatch)
  })
)(ExerciseEntry)
