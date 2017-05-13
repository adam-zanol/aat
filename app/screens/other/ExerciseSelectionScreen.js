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
  LayoutAnimation,
  TextInput
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import SuperText from '../../components/SuperText'
import _ from 'lodash'
import styles from '../../styles/styles.js'
import {connect} from 'react-redux'


class ExerciseSelectionScreen extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => { r1 !== r2 },
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises()),
      selectedExercises: {},
      filterable: false,
      filterText: '',
      filterType: 'name'
    }

    this.renderExerciseRow = this.renderExerciseRow.bind(this)
    this._doFilter = this._doFilter.bind(this)
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={cStyles.modalWrapper}>
        <View style={[cStyles.header,this.props.headerColor ? {backgroundColor:this.props.headerColor} : null]}>
          <TouchableOpacity style={cStyles.headerButton} onPress={(event) => this.props.onCancel(false)}>
            <MaIcon color={styles.colors.alt2} size={20} name="close" />
          </TouchableOpacity>
          <SuperText style={[styles.navBarTitle,styles.p1,styles.flex1]}>select exercises to add</SuperText>
          <View style={cStyles.headerButton}>
            <MaIcon color={this.props.headerColor ? this.props.headerColor : styles.colors.primary} size={16} name="close" />
          </View>
        </View>
        {this.renderFilter()}
        <ScrollView style={styles.contentWrapper}>
          <ListView
            automaticallyAdjustContentInsets={false}
            removeClippedSubviews={false}
            dataSource={this.state.dataSource}
            renderRow={this.renderExerciseRow}
            enableEmptySections={true}
            renderSectionHeader={this.renderSectionHeader}
            stickySectionHeadersEnabled={false}
          />
        </ScrollView>
        {this.renderFooterButtons()}
      </View>
    )
  }

  renderExerciseRow(exercise,sectionID,rowID) {
    return (
      <TouchableHighlight style={[styles.listRowWrapper]} onPress={(event) => this._toggleSelection(rowID,exercise)} underlayColor={styles.colors.alt3}>
        <View style={[styles.flexRow,styles.hCenter]}>
          <View style={[styles.p2,styles.flex1]}>
            <SuperText style={[styles.textBase1, styles.fontSize12]}>{exercise.name}</SuperText>
          </View>
          {this.renderCheck(rowID)}
        </View>
      </TouchableHighlight>
    )
  }

  renderSectionHeader(sectionData,sectionID) {
    return (
      <View style={styles.p2}>
        <SuperText style={[styles.textExtraBold,styles.textBase1, styles.bgTransparent]}>{sectionID}</SuperText>
      </View>
    )
  }

  renderCheck(exerciseID) {
    if (Object.keys(this.state.selectedExercises).includes(exerciseID)) {
      return (
        <View style={styles.p2x}>
          <MaIcon color={this.props.headerColor ? this.props.headerColor : styles.colors.primary} size={16} name="check" />
        </View>
      )
    } else {
      return null
    }
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this.props.onCancel(false)}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.secondary } size={18} name={"cancel"} />
          </View>
          <SuperText style={[styles.textSecondary]}>cancel</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton,this.props.headerColor ? {backgroundColor:this.props.headerColor} : styles.bgPrimary]} onPress={(event) => this.props.onSave(this.state.selectedExercises)}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.alt2} size={18} name={"check-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textAlt2]}>{'add ' + Object.keys(this.state.selectedExercises).length + ' exercises'}</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderFilter() {
      return (
        <View style={[styles.listRowWrapper,styles.p2]}>
          <View style={cStyles.filter}>
            <View style={cStyles.inputWrapper}>
              <TextInput
                  style={cStyles.input}
                  onChangeText={(text) => this._doFilter(text)}
                  value={this.state.filterText}
                  placeholder={'Type...'}
                  keyboardAppearance="dark"
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  placeholderTextColor={styles.colors.alt4}
                />
            </View>
            <View style={cStyles.filterButtons}>
              <TouchableOpacity style={cStyles.filterButton} onPress={() => this._toggleFilterOption('name')}>
                <SuperText style={[this.state.filterType === 'name' ? styles.textBase1 : styles.textAlt4]}>name</SuperText>
              </TouchableOpacity>
              <TouchableOpacity style={cStyles.filterButton} onPress={() => this._toggleFilterOption('tag')}>
                <SuperText style={[this.state.filterType === 'tag' ? styles.textBase1 : styles.textAlt4]}>tag</SuperText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
  }

  //*************************
  // Events
  //*************************

  _doFilter(text) {
    this.setState({
      filterText: text,
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises(this.props.presetExercises,text))
    })
  }

  _toggleFilterOption(option) {
    this.setState({
      filterType: option,
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises())
    })
  }

  _toggleSelection(exerciseID,exercise) {

    let tempItems = this.state.selectedExercises

    if (Object.keys(this.state.selectedExercises).includes(exerciseID)) {
      delete tempItems[exerciseID]
    } else {
      tempItems[exerciseID] = exercise
    }

    this.setState({
      selectedExercises: tempItems,
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises(this.props.presetExercises,this.state.filterText))
    })

    return this
  }

  _sectionizeExercises(exercises=this.props.presetExercises,filterText) {

    let exercisesCopy = exercises

    if (filterText) {
      exercisesCopy = this._filterExercises(exercises,filterText)
    }
    let transformedExercises = _.transform(exercisesCopy, function(result, item, name){
        result[item.name.substring(0,1)] = result[item.name.substring(0,1)] || {};
        result[item.name.substring(0,1)][name] = item;
      })

    return Object.keys(transformedExercises).sort().reduce((r, k) => (r[k] = transformedExercises[k], r), {})
  }

  _filterExercises(exercises,filterText) {
    let filteredExercises

    Object.keys(exercises).map(function(key,index) {
      if (this.state.filterType == 'name') {
        if (exercises[key].name.toLowerCase().includes(filterText)) {
          filteredExercises = {...filteredExercises,[key]:exercises[key]}
        }
      } else {
        if (exercises[key].tags && exercises[key].tags.includes(filterText)) {
          filteredExercises = {...filteredExercises,[key]:exercises[key]}
        }
      }
    }.bind(this))

    return filteredExercises
  }
}


const cStyles = StyleSheet.create({
    modalWrapper: {
      backgroundColor: styles.colors.alt2,
      flex: 1,
    },
    modalHeader: {
      padding: 16,
    },
    header: {
      paddingTop: 16,
      backgroundColor: styles.colors.primary,
      flexDirection: 'row'
    },
    headerButton: {
      padding: 16,
      paddingLeft: 12,
      paddingRight: 12
    },
    filter: {
      backgroundColor: styles.colors.alt2,
      borderWidth: 1,
      borderColor: styles.colors.alt4,
      backgroundColor: styles.colors.alt1,
      padding: 6,
      borderRadius: 16,
      flexDirection: 'row',
    },

    filterButtons: {
      flexDirection: 'row',
    },

    filterButton: {
      marginLeft: 10,
      marginRight: 10
    },

    input: {
      height: 24,
      color: styles.colors.base1,
      fontSize: 14,
      flex: 1
    },

    inputWrapper: {
      flex: 1,
      marginLeft: 10,
      marginRight: 10
    }

});

function mapStateToProps(state,component) {
  return {
    presetExercises: state.presetExercises
  }
}

export default connect(mapStateToProps)(ExerciseSelectionScreen)
