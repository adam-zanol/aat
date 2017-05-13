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
  AlertIOS
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../styles/styles.js'
import SuperText from '../../components/SuperText'
import _ from 'lodash'

class SelectionScreen extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => { r1 !== r2 },
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.options),
      selected: this.props.selected
    }
    this.renderOption = this.renderOption.bind(this)
  }

  componentDidMount() {

  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={styles.fullPageWrapper}>
          <ListView
            style={[styles.flex1]}
            automaticallyAdjustContentInsets={false}
            removeClippedSubviews={false}
            dataSource={this.state.dataSource}
            renderRow={this.renderOption}
            enableEmptySections={true}
          />
      </View>
    )
  }

  renderOption(option) {
    return (
      <View style={styles.listRowWrapper}>
        <TouchableOpacity style={styles.listRow} onPress={() => this._doSelect(option)}>
          <SuperText style={[styles.p1,styles.flex1]}>{option}</SuperText>
          {this.state.selected == option &&
            <MaIcon style={styles.p1} color={styles.colors.base3} size={16} name={"check"} />
          }
        </TouchableOpacity>
      </View>
    )
  }

  //*************************
  // Events
  //*************************

  _doSelect(option) {
    this.setState({
      selected:option,
      dataSource: this.ds.cloneWithRows(this.props.options)
    })
    this.props.onSelect(option)
  }
}




const cStyles = StyleSheet.create({


});


export default SelectionScreen
