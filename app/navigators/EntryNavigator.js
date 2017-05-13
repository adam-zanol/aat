'use strict'
import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  Navigator,
  NavigatorIOS,
  View,
  TouchableOpacity,
  ActionSheetIOS,
  InteractionManager,
  Picker,
  Image
} from 'react-native';

import EntryOverviewScreen from '../screens/entry/EntryOverviewScreen'
import EntryCreationScreen from '../screens/entry/EntryCreationScreen'
import EntryDetailScreen from '../screens/entry/EntryDetailScreen'
import ExerciseHistoryScreen from '../screens/other/ExerciseHistoryScreen'
import DataScreen from '../screens/entry/DataScreen'
import SuperText from '../components/SuperText'
import styles from '../styles/styles.js'
import MaIcon from 'react-native-vector-icons/MaterialIcons'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as entryActions from '../actions/entryActions';
import * as exerciseActions from '../actions/exerciseActions'
import * as setActions from '../actions/setActions'

class EntryNavigator extends Component {
  constructor(props) {
    super(props)

    this.editEntryActionSheetButtons = [
      'Edit Title',
      'Delete',
      'Cancel'
    ]
    this.currentDate = new Date()

    this.state = {
      modalVisible: false,
      years: []
    }

    this._renderScene = this._renderScene.bind(this)

  }

  componentDidMount() {

  }

  _renderScene(route, navigator) {
    var globalNavigatorProps = { navigator }
    switch(route.ident) {
      case "EntryOverview":
        return (
          <EntryOverviewScreen
            {...this.props}
            {...globalNavigatorProps}
            currentDate={this.currentDate} />
        )
      case "EntryCreation":
        return (
          <EntryCreationScreen
            {...this.props}
            {...globalNavigatorProps} />
      )
      case "EntryDetail":
        return (
            <EntryDetailScreen
              {...globalNavigatorProps}
              actions={this.props.actions}
              id={route.entryID}
              dateString={route.date}
              presetExercises={this.props.presetExercises}
              />
        )
      case "ExerciseHistory":
        return (
            <ExerciseHistoryScreen
              {...globalNavigatorProps}
              currentDate={this.currentDate}
              name={route.name}
              entries={this.props.entries}
              exercises={this.props.exercises} />
        )
      case "Data":
        return (
            <DataScreen
              {...globalNavigatorProps} />
        )
      default:
        return (
          <Text>{`YO YOU MESSED SOMETHING UP ${route}`}</Text>
        )
    }
  }

  render() {
    return (
      <Navigator
        style={styles.bgAlt1}
        sceneStyle={styles.navigator}
        initialRoute={this.props.initialRoute}
        ref="entryNavigator"
        renderScene={this._renderScene}
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.PushFromRight })}
          navigationBar={

       <Navigator.NavigationBar
         routeMapper={{
           LeftButton: (route, navigator, index, navState) =>
            { return this.renderLeftButton(route, navigator, index, navState) },
           RightButton: (route, navigator, index, navState) =>
            { return this.renderRightButton(route, navigator, index, navState) },
           Title: (route, navigator, index, navState) =>
            { return this.renderRouteTitle(route, navigator, index, navState) },
         }}
         style={[styles.navBar,{backgroundColor:styles.colors.primaryAlt}]}
         />
        }
      />
    )
  }

  renderLeftButton(route, navigator, index, navState) {
    switch(route.ident) {
      case "EntryOverview":
        return null
      case "EntryCreation":
        return (
          <TouchableOpacity style={styles.navBarButton} onPress={() => navigator.pop()}>
            <MaIcon style={styles.textAlt2} size={20} name="close" />
          </TouchableOpacity>
        )
      case "Data":
        return (
          <TouchableOpacity style={styles.navBarButton} onPress={() => navigator.pop()}>
            <MaIcon style={styles.textAlt2} size={20} name="close" />
          </TouchableOpacity>
        )
      default:
        return (
          <TouchableOpacity style={styles.navBarButton} onPress={() => navigator.pop()}>
            <MaIcon style={styles.textAlt2} size={20} name="arrow-back" />
          </TouchableOpacity>
        )
      }
  }

  renderRightButton(route, navigator, index, navState) {
    switch(route.ident) {
      case "EntryDetail":
        return (
          <TouchableOpacity style={styles.navBarButton} onPress={() => this.showEditActivityActionSheet(route.entry)}>
            <MaIcon style={styles.textAlt2} size={20} name="more-vert" />
          </TouchableOpacity>
        )
      default:
        return null
      }
  }

  renderRouteTitle(route, navigator, index, navState) {
    switch(index) {
      case 0:
      return (
        <View>
          <Image
            style={cStyles.logoImage}
            source={require('../../assets/img/logo.png')}
            resizeMode='contain'
            />
        </View>
      )
      default:
        return (
          <Text style={styles.navBarTitle} numberOfLines={1}>{route.title}</Text>
        )
      }
  }

  _setModalVisible(visible, type) {
    this.setState({modalVisible: visible, modalType: type});
  }


  _navigateToData(navigator) {
    navigator.push({
      ident: "Data",
      title: "Data",
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    })
  }

  // Entry detail action sheet

  showEditActivityActionSheet = (entry) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: this.editEntryActionSheetButtons,
      cancelButtonIndex: 2,
      destructiveButtonIndex: 1
    },
    (buttonIndex) => {
      this.doEditEntryAction(buttonIndex, entry)
    })
  }

  doEditEntryAction = (index,entry) => {
    switch(index) {
      case 1:
        this._deleteEntry(entry);
        break
      default:
        null
    }
  }

  _deleteEntry(entry) {
    // Remove sets of all exercises
    this.props.actions.removeEntry(entry.id)

    if(this.props.exercises[entry.id]) {
      Object.keys(this.props.exercises[entry.id]).map((key,index) => {
        this.props.actions.removeSets(key)
      })
      // Remove entries corresponding exercises
      this.props.actions.removeExercises(entry.id)
    }

    this.refs.entryNavigator.pop()

  }
}

const cStyles = StyleSheet.create({
  logoImage: {
    flexGrow: 1,
    width: 64,
    height: 22,
    margin: 10,
    marginLeft: 8
  }
});

export default connect(state => ({
    exercises: state.exercises,
    presetExercises: state.presetExercises
  }),
  (dispatch) => ({
    actions: bindActionCreators({...entryActions,...exerciseActions, ...setActions}, dispatch)
  })
)(EntryNavigator);
