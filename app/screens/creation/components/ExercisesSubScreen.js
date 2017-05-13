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
  AlertIOS,
  TextInput,
  LayoutAnimation
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import styles from '../../../styles/styles.js'
import firebaseApp from '../../../Firebase.js'
import SuperText from '../../../components/SuperText'
import _ from 'lodash'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as presetExerciseActions from '../../../actions/presetExerciseActions'

class ExercisesSubScreen extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => { r1 !== r2 },
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })

    this.state = {
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises()),
      editable: false,
      filterable: false,
      filterText: '',
      filterType: 'name'
    }

    this.renderExerciseRow = this.renderExerciseRow.bind(this)
    this._sectionizeExercises = this._sectionizeExercises.bind(this)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises(nextProps.presetExercises))
    })
  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={styles.contentWrapper}>
        {this.renderFilter()}
        <ScrollView style={styles.contentWrapper}>
          <ListView
            style={[styles.flex1,styles.p1b]}
            automaticallyAdjustContentInsets={false}
            removeClippedSubviews={false}
            dataSource={this.state.dataSource}
            renderRow={this.renderExerciseRow}
            renderSectionHeader={this.renderSectionHeader}
          />
        </ScrollView>
      {this.renderFooterButtons()}
      </View>
    )
  }

  renderExerciseRow(exercise,sectionID,rowID) {
    return(
      <TouchableHighlight style={styles.listRowWrapperSlim} underlayColor={styles.colors.alt3} onPress={() => this.props.onExercisePress(exercise,rowID)}>
        <View>
          <View style={[styles.listRow,styles.hCenter]}>
            <View style={[styles.flexRow]}>
              <SuperText style={[styles.textBase1, styles.fontSize12, styles.textBold, styles.p2]} numberOfLines={1}>{exercise.name}</SuperText>
              {exercise.tags && this.renderTags(exercise.tags)}
            </View>
          </View>
          {this.state.editable ?
          (<TouchableOpacity style={cStyles.delete} onPress={(event) => this._removeExercise(rowID)}>
            <MaIcon color={styles.colors.secondary} size={14} name={"remove-circle"} />
            <SuperText style={[styles.textSecondary,styles.fontSize12]}> delete</SuperText>
          </TouchableOpacity>) : null }
        </View>
      </TouchableHighlight>
    )
  }

  renderTags(tags) {
    return (
      <View style={cStyles.tags}>
        {tags.map((tag) => {
          return (
            <View style={cStyles.tag} key={tag}>
              <SuperText style={[styles.fontSize10,styles.textPrimary]}>{tag}</SuperText>
            </View>
          )
        })}
      </View>
    )
  }

  renderSectionHeader(sectionData,sectionID) {
    return (
      <View style={styles.p1}>
        <SuperText style={[styles.textBold,styles.textBase2,styles.bgTransparent]}>{sectionID}</SuperText>
      </View>
    )
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._toggleEditExercises()}>
          <View style={styles.addButton}>
            <MaIcon color={this.state.editable ? styles.colors.primaryAlt : styles.colors.grayLight} size={18} name={"edit"} />
          </View>
          <SuperText style={[styles.fontSize16,this.state.editable ? styles.textPrimaryAlt : styles.textLight]}>edit</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._toggleFilter()}>
          <View style={styles.addButton}>
            <MaIcon color={this.state.filterable ? styles.colors.tertiary : styles.colors.grayLight} size={18} name={"filter-list"} />
          </View>
          <SuperText style={[styles.fontSize16,this.state.filterable ? styles.textTertiary : styles.textLight]}>filter</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this.props.onExercisePress()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"add-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>exercise</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderFilter() {
    if (this.state.filterable) {
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
    } else return null
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

  _toggleEditExercises() {
    const status = this.state.editable
    this.setState({
      editable: !status,
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises())
    })
  }

  _toggleFilter() {
    const status = this.state.filterable
    LayoutAnimation.easeInEaseOut()
    this.setState({
      filterable: !status,
      filterText: '',
      dataSource: this.ds.cloneWithRowsAndSections(this._sectionizeExercises())
    })
  }

  _removeExercise(id) {
    this.props.actions.removePresetExercise(id)
  }

  _sectionizeExercises(exercises=this.props.presetExercises,filterText) {
    let exercisesCopy = exercises

    if (filterText) {
      exercisesCopy = this._filterExercises(exercises,filterText)
    }
    let transformedExercises = _.transform(exercisesCopy, function(result, item, name){
        result[item.name.substring(0,1)] = result[item.name.substring(0,1)] || {}
        result[item.name.substring(0,1)][name] = item
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

  //*************************
  // Navigation
  //*************************

  _navigateToExerciseCreation(exercise, exerciseID) {
    this.props.navigator.push({
      ident: "WorkoutCreation",
      title: exercise ? exercise.name : "NEW EXERCISE",
      exercise,
      exerciseID
    })
  }

}

const cStyles = StyleSheet.create({

  row: {
    backgroundColor: styles.colors.alt2,
    flex: 1,
    marginRight: 16,
    marginLeft: 16,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    },
  },

  header: {

  },

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
  },

  tags: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: 8,
    paddingBottom: 4
  },

  tag: {
    overflow: 'hidden',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: styles.colors.primary,
    padding: 4
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
    presetExercises: state.presetExercises
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators({...presetExerciseActions}, dispatch)
  })
)(ExercisesSubScreen)
