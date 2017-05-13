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
  AlertIOS
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../../styles/styles.js'
import firebaseApp from '../../../Firebase.js'
import SuperText from '../../../components/SuperText'
import _ from 'lodash'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as presetWorkoutActions from '../../../actions/presetWorkoutActions'

class WorkoutsSubScreen extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.state = {
        dataSource: this.ds.cloneWithRows(this.props.presetWorkouts),
        editable: false
    }
    this.renderWorkoutRow = this.renderWorkoutRow.bind(this)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.ds.cloneWithRows(nextProps.presetWorkouts),
    })
  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={[styles.contentWrapper]}>
        <ListView
          style={styles.flex1}
          automaticallyAdjustContentInsets={false}
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderWorkoutRow}
          enableEmptySections={true}
        />
      {this.renderFooterButtons()}
      </View>
    )
  }

  renderWorkoutRow(workout,sectionID,rowID) {
    return(
      <TouchableHighlight style={[styles.listRowWrapperSlim, styles.m1t]} underlayColor={styles.colors.alt3} onPress={() => this.props.onWorkoutPress(workout,rowID)}>
        <View>
          <View style={[styles.flexRow, styles.hCenter]}>
            <View style={[styles.p2,styles.flexRow]}>
              <View style={[styles.flex2]}>
                <SuperText style={[styles.textBase1, styles.fontSize12, styles.textBold]}>{workout.name}</SuperText>
              </View>
              <View style={styles.flex1}>
                <SuperText style={[styles.textBase3,styles.fontSize12,styles.textCenter]}>{Object.keys(workout.exercises).length} exercises</SuperText>
              </View>
              <View style={styles.flex1}>
                <SuperText style={[styles.textPrimary,styles.fontSize12,styles.textRight]}>@adamzanol</SuperText>
              </View>
            </View>
          </View>
          {this.state.editable ?
          (<TouchableOpacity style={cStyles.delete} onPress={(event) => this._deleteWorkout(rowID)}>
            <MaIcon color={styles.colors.secondary} size={14} name={"remove-circle"} />
            <SuperText style={[styles.textSecondary,styles.fontSize12]}> delete</SuperText>
          </TouchableOpacity>) : null}
        </View>
      </TouchableHighlight>
    )
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._toggleEditWorkouts()}>
          <View style={styles.addButton}>
            <MaIcon color={this.state.editable ? styles.colors.primaryAlt : styles.colors.grayLight} size={18} name={"edit"} />
          </View>
          <SuperText style={[styles.fontSize16,this.state.editable ? styles.textPrimaryAlt : styles.textLight]}>edit</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this.props.onWorkoutPress()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"add-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>new workout</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  //*************************
  // Events
  //*************************

  _toggleEditWorkouts() {
    const status = this.state.editable
    this.setState({
      editable: !status,
      dataSource: this.ds.cloneWithRows(this.props.presetWorkouts)
    })
  }

  _deleteWorkout(id) {
    this.props.actions.deleteWorkout(id)
  }

  //*************************
  // Navigation
  //*************************


}


const cStyles = StyleSheet.create({
  titleBarButton: {
    flex: 1,
    padding: 10
  },

  textWhite: {
    color: 'white'
  },

  pageWrapper: {
    backgroundColor: 'white',
    flex: 1,
  },

  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  delete: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center'
  }

});

function mapStateToProps(state,component) {
  return {
    presetWorkouts: state.presetWorkouts
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators({...presetWorkoutActions}, dispatch)
  })
)(WorkoutsSubScreen)
