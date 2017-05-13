'use strict'
import React, {
  Component,
} from 'react';

import {
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Picker
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import SuperText from '../../components/SuperText'
import _ from 'lodash'
import styles from '../../styles/styles.js'
import {connect} from 'react-redux'

const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
]

class ExerciseHistoryScreen extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
      loading: false,
      modalVisible: false,
      animationType: 'slide',
      selectedYear: this.props.currentDate.getFullYear().toString(),
      dataSource: this.ds.cloneWithRows([]),
    }

    this.renderExerciseRow = this.renderExerciseRow.bind(this)

  }

  componentDidMount() {
    this._setExercises(this.props.currentDate.getFullYear())
  }


  render() {
    return (
      <View style={styles.fullPageWrapper}>
        <ScrollView style={styles.contentWrapper}>
          <ListView
            automaticallyAdjustContentInsets={false}
            removeClippedSubviews={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderExerciseRow}
            enableEmptySections={true}
          />
        </ScrollView>
      </View>
    )
  }

  renderExerciseRow(exercise) {
    let dateObj = new Date(exercise.date)
    let date =  monthNames[dateObj.getMonth()] + ' ' + dateObj.getDate() + ', ' + dateObj.getFullYear()
    return (
      <View style={styles.listRowWrapper}>
        <View style={[styles.p2,styles.listRow]}>
          <SuperText style={[styles.fontSize12, styles.textPrimaryAlt]}>{date}</SuperText>
          <View style={[styles.flex1,styles.contentEnd]}>
            {this.renderSets(exercise.sets,exercise.type)}
          </View>
        </View>
      </View>
    )
  }

  renderSets(sets,type) {
    if (Object.keys(sets).length) {
      return (
        Object.keys(sets).map((key,index) => {
          return this.renderSet(sets[key],type,index)
        })
      )
    } else {
      return (
        <SuperText style={styles.fontSize12}>No Sets</SuperText>
      )
    }
  }

  renderSet(set,type,index) {
    switch(set.type) {
      // Shouldn't need
      case 'default':
        return (
          <SuperText key={index}>{set.reps ? set.reps : '0' + ' @ ' + set.weight ? set.weight : '0'}</SuperText>
        )
      case 'strength':
        return (
          <SuperText key={index}>{(set.reps ? set.reps : '0') + ' @ ' + (set.weight ? set.weight : '0')}</SuperText>
        )
      case 'cardio':
        return (
          <SuperText key={index}>{(set.time ? this._formatTime(set.time)+ ', ' : '') + (set.distance ? set.distance + ' mi' : '')}</SuperText>
        )
      default:
        return (
          <SuperText key={index}>{'Uh oh, something went wrong. error 0001'}</SuperText>
        )
    }
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._setModalVisible(true)}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primaryLight} size={18} name={'date-range'} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimaryLight]}>{this.state.selectedYear}</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderModal() {
    let years = (Object.keys(this.props.exercises).length ? Object.keys(this.props.exercises) : ['2016'])

    return (
      <View style={[styles.boxShadow,styles.bgWhite]}>
        <View style={styles.rowFlex}>
          <Picker
            style={styles.flex1}
            selectedValue={this.state.selectedYear}
            onValueChange={(year) => this._setSelectedYear(year)}>
            {years.map((s, i) => {
              return <Picker.Item
                       key={i}
                       value={s}
                       label={s} />
             })}
          </Picker>
        </View>
        <View style={[styles.footerButtons]}>
          <TouchableOpacity style={[styles.footerButton]} onPress={this._setModalVisible.bind(this, false)}>
            <View style={styles.removeButton}>
              <MaIcon color={styles.colors.secondary} size={18} name={'cancel'} />
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

  _setExercises(year) {
    const exercises = this.props.exercises
    let selectedExercises = []

    {Object.keys(exercises).map((key,index) => {
      let exerciseSet = exercises[key]
      let entryID = key
      {Object.keys(exerciseSet).map((key,index) => {
        if (exerciseSet[key]['name'].toUpperCase() === this.props.name.toUpperCase()) {
          // Get entry and sets once exercise matches
          selectedExercises.push(
            {'sets':
              {...this.props.sets[key]},
              'date':this.props.entries[entryID].fullDate
            })
        }
      })}
    })}

    this.setState({
      dataSource: this.ds.cloneWithRows(selectedExercises)
    })
  }

  _setSelectedYear(year) {
    this.setState({selectedYear: year})
    this._setExercises(year)
  }

  _setModalVisible(visible, type) {
    this.setState({modalVisible: visible, modalType: type});
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
}


const cStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
});

function mapStateToProps(state,component) {
  return {
    sets: state.sets,
    exercises: state.exercises,
    entries: state.entries
  }
}

export default connect(mapStateToProps)(ExerciseHistoryScreen)
