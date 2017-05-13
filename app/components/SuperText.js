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

const SuperText = React.createClass({
  propTypes: {

  },

  getDefaultProps() {
    return {

    }
  },


  render() {
    return (
      <Text {...this.props} style={[cStyles.text,this.props.style]} >
      {this.props.children}
      </Text>
    );
  },
});

const cStyles = StyleSheet.create({
  text: {
    fontFamily: 'helvetica',
    letterSpacing: 0.2,
    fontWeight: '400',
  }
});

module.exports = SuperText;
