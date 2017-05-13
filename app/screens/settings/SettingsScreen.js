'use strict'
import React, {
  Component,
} from 'react';

import {
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Switch,
  Alert
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../styles/styles.js'
import SuperText from '../../components/SuperText'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as settingsActions from '../../actions/settingsActions';
import {purgeEntries} from '../../actions/entryActions';
import {purgeExercises} from '../../actions/exerciseActions';
import {purgeSets} from '../../actions/setActions';

class SettingsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hideSocialTab: this.props.hideSocialTab,
    }

    this.unitOptions = ['Metric','Imperial']

    this._setUnits = this._setUnits.bind(this)
  }

  render() {
    return (
      <View style={styles.fullPageWrapper}>
        <ScrollView styles={[styles.flex, styles.bgBase2]} automaticallyAdjustContentInsets={false}>
          <View style={styles.listRowWrapper}>
            <View style={[styles.hCenter,styles.listRow]}>
              <SuperText style={[styles.p2,styles.flex1,styles.textBase2]}>Hide Social Tab</SuperText>
              <View style={styles.p2}>
                <Switch
                  onTintColor={styles.colors.secondary}
                  onValueChange={(value) => this._toggleSocialTabVisibility(value)}
                  value={this.state.hideSocialTab} />
              </View>
            </View>
          </View>
          <TouchableOpacity style={[styles.hCenter,styles.listRowWrapper]} onPress={() => this._navigateToSelection(this.unitOptions,'Units',this._setUnits, this.props.settings.units)}>
            <View style={styles.listRow}>
              <SuperText style={[styles.p2,styles.flex1,styles.textBase2]}>Units</SuperText>
              <MaIcon style={styles.p2} color={styles.colors.base3} size={18} name={"keyboard-arrow-right"} />
            </View>
          </TouchableOpacity>
          <View style={[styles.hCenter,styles.listRowWrapper]}>
            <View style={[styles.hCenter,styles.listRow]}>
              <SuperText style={[styles.p2,styles.flex1,styles.textBase2]}>Default Workout Log Settings</SuperText>
              <MaIcon style={styles.p2} color={styles.colors.base3} size={18} name={"keyboard-arrow-right"} />
            </View>
          </View>
          <View style={styles.m1y}>
            <TouchableOpacity style={[styles.hCenter,styles.listRowWrapper]} onPress={(event) => this._doDeleteLogEntries()}>
              <SuperText style={[styles.p2,styles.flex1,styles.textSecondary, styles.textCenter]}>Delete All Log Entries</SuperText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <SuperText style={[styles.fontSize16, styles.textCenter, styles.textBase2]}>created by @adamzanol</SuperText>
            <SuperText style={[styles.fontSize12, styles.textCenter, styles.textBase2, styles.textItalic]}>we're all gonna make it</SuperText>
          </View>
        </ScrollView>
      </View>
    )
  }

  //*************************
  // Events
  //*************************

  _setUnits(type) {
    this.props.actions.setUnits(type)
  }

  _doDeleteLogEntries() {
    // Ask user if they really want to purge all their data
    Alert.alert(
      'Are you sure you want to delete all log entries?',
      'This is cannot be undone!',
      [
        {text: 'Delete', onPress: () => this._deleteLogEntries()},
        {text: 'Cancel', null, style: 'cancel'}
      ]
    )
  }

  _deleteLogEntries() {
    // Remove sets, exercises, and entries
    this.props.actions.purgeEntries()
    this.props.actions.purgeExercises()
    this.props.actions.purgeSets()
  }

  _toggleSocialTabVisibility(value) {
    // Toggles the visibility of social tab
    this.setState({hideSocialTab:value})
    this.props.actions.toggleSocialTabVisibility(value)
  }

  _navigateToSelection(options,title,onSelect,selected) {
    this.props.navigator.push({
      ident: "Selection",
      options,
      title,
      onSelect,
      selected
    })
  }
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
  }

});

function mapStateToProps(state,component) {
  return {
    settings: state.settings,
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators({purgeEntries,purgeExercises,purgeSets,...settingsActions}, dispatch)
  })
)(SettingsScreen);
