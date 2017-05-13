'use strict'
import React, {
  Component,
} from 'react';

import {
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  LayoutAnimation
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import SuperText from '../../components/SuperText'
import _ from 'lodash'
import styles from '../../styles/styles.js'
import {connect} from 'react-redux'

class DataScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: 0
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={styles.fullPageWrapper}>
        {this.state.selected == 0 || this.state.selected == 1 ?
        <TouchableHighlight style={cStyles.box} onPress={() => this._setSelectedSection(1)} underlayColor={styles.colors.alt3}>
          <View style={[styles.center,styles.flexRow]}>
            <MaIcon style={styles.textBase1} size={32} name="graphic-eq" />
            <SuperText style={[styles.textBold,styles.fontSize32]}> Activity</SuperText>
          </View>
        </TouchableHighlight> : null}
        {this.state.selected == 0 || this.state.selected == 2 ?
        <TouchableHighlight style={cStyles.box} onPress={() => this._setSelectedSection(2)} underlayColor={styles.colors.alt3}>
          <View style={[styles.center,styles.flexRow]}>
            <MaIcon style={styles.textBase1} size={32} name="fitness-center" />
            <SuperText style={[styles.textBold,styles.fontSize32]}> Exercises</SuperText>
          </View>
        </TouchableHighlight>: null}
      </View>
    )
  }

  //*************************
  // Events
  //*************************

  _setSelectedSection(value) {
    if (this.state.selected == value) {
      LayoutAnimation.easeInEaseOut()
      this.setState({selected: 0})
    } else {
      LayoutAnimation.easeInEaseOut()
      this.setState({selected: value})
    }
  }
}

const cStyles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: styles.colors.alt2,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: styles.colors.alt1,
    flexDirection: 'row'
  }
})

function mapStateToProps(state,component) {
  return {
    entries: state.entries
  }
}

export default connect(mapStateToProps)(DataScreen)
