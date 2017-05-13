'use strict'
import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity
} from 'react-native'

import styles from '../styles/styles.js'
import SuperText from '../components/SuperText'

class ActionBar extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <View style={[cStyles.buttons]}>
        {this.props.buttons.map((object) => {
          return this.renderButton(object.name, object.action, object.bgColor)
        })}
      </View>
    )
  }

  renderButton(name,action,bgColor) {
    return (
      <TouchableOpacity
        style={[cStyles.button,{backgroundColor: bgColor ? bgColor : '#000' }]}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => action()}>
        <SuperText style={[styles.textAlt2, styles.textBold, styles.fontSize10]}> {name} </SuperText>
      </TouchableOpacity>
    )
  }
}

const cStyles = StyleSheet.create({
  buttons: {
    position: 'absolute',
    right: 25,
    bottom: 75,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    height: 70,
    width: 70,
    borderRadius: 35,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {
      height: 6,
      width: 0
    }
  },
});

module.exports = ActionBar
