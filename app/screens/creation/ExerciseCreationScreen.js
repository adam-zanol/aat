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
  ScrollView,
  Modal,
  TextInput,
  Alert,
  AlertIOS,
  Image
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import ActionBar from '../../components/ActionBar'
import SuperText from '../../components/SuperText'
import styles from '../../styles/styles.js'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as presetActions from '../../actions/presetActions'
import * as presetExerciseActions from '../../actions/presetExerciseActions'

class ExerciseCreationScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      date: this.props.date,
      animationType: 'slide',
      modalVisible: false,
      name: this.props.exercise ? this.props.exercise.name : '',
      type: this.props.exercise ? this.props.exercise.type :'strength',
      tags: this.props.exercise ? this.props.exercise.tags : [],
      tagInput: ''
    }
    this._saveExercise = this._saveExercise.bind(this)
  }

  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={[styles.fullPageWrapper]}>
        <View style={cStyles.pageHeader}>
          <View style={styles.inputWrapper}>
            <TextInput
                style={[styles.input]}
                onChangeText={(text) => this._setName(text)}
                value={this.state.name}
                placeholder={'name'}
                placeholderTextColor={styles.colors.alt3}
                keyboardAppearance="dark"
                autoCorrect={false}
              />
          </View>
        </View>
        <ScrollView style={styles.flex1}>
          <View style={cStyles.header}>
            <SuperText style={[styles.textBold,styles.textBase2]}>exercise type</SuperText>
          </View>
          {this.renderButtons()}
          <View style={cStyles.header}>
            <SuperText style={[styles.textBold,styles.textBase2]}>tags</SuperText>
          </View>
          {this.renderTags()}
        </ScrollView>
        {this.renderFooterButtons()}
      </View>
    )
  }

  renderButtons() {
    return(
      <View style={[cStyles.buttons,styles.listRowWrapper]}>
        <TouchableOpacity key='strength_button' onPress={(event) => this._setType('strength')} activeOpacity={0.7}>
          <View style={[cStyles.button, (this.state.type == 'strength' ? cStyles.selected : null)]}>
            <MaIcon color={this.state.type == 'strength' ? styles.colors.primary : styles.colors.alt1} size={44} name={"fitness-center"} />
          </View>
          <Text style={[cStyles.buttonText,(this.state.type == 'strength' ? styles.textPrimary : styles.textAlt1)]}>{'STRENGTH'}</Text>
        </TouchableOpacity>
        <TouchableOpacity key='cardio_button' onPress={(event) => this._setType('cardio')} activeOpacity={0.7}>
          <View style={[cStyles.button, (this.state.type == 'cardio' ? cStyles.selected : null)]}>
            <MaIcon color={this.state.type == 'cardio' ? styles.colors.primary : styles.colors.alt1} size={50} name={"directions-walk"} />
          </View>
          <Text style={[cStyles.buttonText,(this.state.type == 'cardio' ? styles.textPrimary : styles.textAlt1)]}>{'CARDIO'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._navigateBack()}>
          <View style={styles.removeButton}>
            <MaIcon color={styles.colors.secondary} size={18} name={"cancel"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textSecondary]}>cancel</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._doSaveExercise()}>
          <View style={styles.removeButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"check-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>save</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderTags() {
      return (
        <View style={cStyles.tags}>
          <ScrollView horizontal={true}>
            <TouchableOpacity style={cStyles.addTag} onPress={(event) => this._showPromptForNewTag()}>
              <MaIcon color={styles.colors.primary} size={14} name={"add"} />
              <SuperText style={styles.textPrimary}>tag</SuperText>
            </TouchableOpacity>
            {this.state.tags && this.state.tags.map((key,index) => {
              return this.renderTag(key,index)
            })}
          </ScrollView>
          <View style={styles.p1t}>
            <ScrollView horizontal={true}>
              {this.props.presets.tags && this.props.presets.tags.map((key,index) => {
                return this.renderExistingTag(key,index)
              })}
            </ScrollView>
          </View>
        </View>
      )

  }

  renderTag(text,index) {
    return (
      <TouchableOpacity key={index} style={cStyles.tag}>
        <SuperText style={styles.textAlt2}>{text}</SuperText>
      </TouchableOpacity>
    )
  }

  renderExistingTag(tag,index) {
    return (
      <TouchableOpacity key={index} style={[cStyles.tag,styles.bgBase1]} onPress={(event) => this._addTag(tag.name)}>
        <SuperText style={styles.textAlt2}>{tag.name}</SuperText>
      </TouchableOpacity>
    )
  }

  //*************************
  // Events
  //*************************

  _showPromptForNewTag() {
    AlertIOS.prompt(
      'Enter Tag',
      null,
      text => this._addTag(text),
      'plain-text',
    )
  }

  _setType(type) {
    this.setState({type: type})
  }

  _setName(newName) {
    this.setState({name: newName})
  }

  _addTag(tag) {
    let tags = this.state.tags ? this.state.tags : []
    if (tags && !tags.includes(tag)) {
      tags.push(tag.toLowerCase())
      this.setState({tags:tags})
    }
  }

  /*
  * Initiates save save exercise, checks if exercise has a name
  * @return undefined
  */

  _doSaveExercise() {
    // Check if name is not blank, error
    if (!this.state.name.length) {
      Alert.alert(
        'Failed to save exercise!',
        'Please give your exercise a name',
      )
      return
    }

    this._saveExercise()
  }

  /*
  * Creates exercise ID, Saves exercise, navigates back
  * @return undefined
  */

  _saveExercise() {
    let id = null
    if (this.props.id) {
      // use id of exisitng to update
      id = this.props.id
    } else {
      // create new unique id
      id = Date.now() + '_exercise'
    }
    this.props.actions.addPresetExercise(id,
      {
        name: this.state.name,
        tags: this.state.tags,
        type: this.state.type
      }
    )

    this._navigateBack()
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible})
  }

  //*************************
  // Navigation
  //*************************

  _navigateBack() {
    this.props.navigator.pop();
  }
}

var cStyles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: styles.colors.alt2,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex:1,
    justifyContent: 'center'
  },
  button: {
    borderWidth: 2,
    borderColor: styles.colors.alt3,
    height: 88,
    width: 88,
    padding: 16,
    margin: 16,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: styles.colors.primary
  },
  buttonText: {
    fontFamily: 'Trebuchet MS',
    fontWeight: '700',
    textAlign: 'center'
  },
  buttonImage: {
    width: 56,
    height: 56,
  },
  tags: {
    backgroundColor: styles.colors.alt2,
    padding: 16,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: styles.colors.alt3,
    margin: 16,
    marginTop: 0,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex:1
  },

  tag: {
    backgroundColor: styles.colors.primary,
    padding: 6,
    paddingLeft: 12,
    paddingRight: 12,
    marginRight: 6
  },
  addTag: {
    borderColor: styles.colors.primary,
    borderWidth: 1,
    padding: 5,
    paddingLeft: 12,
    paddingRight: 12,
    marginRight: 6,
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  header: {
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  pageHeader: {
    backgroundColor: styles.colors.alt2,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex:1
  }
});

function mapStateToProps(state,component) {
  return {
    presets: state.presets
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators({...presetActions,...presetExerciseActions}, dispatch)
  })
)(ExerciseCreationScreen)
