'use strict'
import React, {
  Component,
} from 'react';

import {
  ListView,
  StyleSheet,
  Navigator,
  View,
  TouchableOpacity,
  TouchableHighlight,
  LayoutAnimation,
  Modal,
  Picker
} from 'react-native';

import MaIcon from 'react-native-vector-icons/MaterialIcons'
import SuperText from '../../components/SuperText'
import ActionBar from '../../components/ActionBar'
import _ from 'lodash'
import styles from '../../styles/styles.js'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as entryActions from '../../actions/entryActions';

const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
]

class EntryScreen extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => { r1 !== r2 }})

    this.currentDate = new Date()

    this.state = {
        dataSource: this.ds.cloneWithRows([]),
        loading: false,
        entries: this.props.entries,
        modalVisible: false,
        animationType: 'slide',
        selectedYear: this.currentDate.getFullYear().toString(),
        selectedMonth: this.currentDate.getMonth()
      }

    // Binding functions
    this.renderEntryRow = this.renderEntryRow.bind(this)

  }

  componentDidMount() {
    this.setNewEntries(this.state.selectedYear,this.state.selectedMonth)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.entries !== this.props.entries || nextProps.exercises !== this.props.exercises) {
      this.setNewEntries(this.state.selectedYear,this.state.selectedMonth,nextProps)
     }
  }

  setNewEntries(year,month,props=this.props) {
    let entries = this.filterEntries(props.entries,year,month)
    // this.animate()
    this.setState({
     entries: props.entries,
     dataSource: this.ds.cloneWithRows(entries)
    })
  }


  //*************************
  // Render
  //*************************

  render() {
    return (
      <View style={[styles.fullPageWrapper]}>
        <View style={styles.contentWrapper}>
          {this.renderContent()}
        </View>
        {this.renderFooterButtons()}
        <Modal
          animationType={this.state.animationType}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {this._setModalVisible(false)}}
          >
          <View style={cStyles.modalContainer}>
            <TouchableOpacity style={cStyles.modalSpacer} onPress={() => {this._setModalVisible(false)}}>
            </TouchableOpacity>
            {this.renderModal()}
          </View>
        </Modal>
      </View>
    )
  }

  renderFooterButtons() {
    return (
      <View style={[styles.footerButtons]}>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._setModalVisible(true)}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primaryAlt} size={18} name={"date-range"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimaryAlt]}>{monthNames[this.state.selectedMonth] + ' ' + this.state.selectedYear}</SuperText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._navigateToEntryCreation()}>
          <View style={styles.addButton}>
            <MaIcon color={styles.colors.primary} size={18} name={"add-circle"} />
          </View>
          <SuperText style={[styles.fontSize16,styles.textPrimary]}>new workout</SuperText>
        </TouchableOpacity>
      </View>
    )
  }

  renderContent() {
    if (this.state.dataSource._cachedRowCount) {
      return (
        <ListView
          automaticallyAdjustContentInsets={false}
          removeClippedSubviews={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderEntryRow}
          enableEmptySections={true}
        />
      )
    } else {
      return (
        <View style={cStyles.placeholder}>
          <SuperText style={[styles.fontSize20,styles.m1b]}>no workouts for <SuperText style={[styles.textBold, styles.fontSize20]}>{monthNames[this.state.selectedMonth] + ' ' + this.state.selectedYear}</SuperText></SuperText>
          <TouchableOpacity style={[styles.placeholderButton]} onPress={(event) => this._navigateToEntryCreation()}>
            <View style={styles.addButton}>
              <MaIcon color={styles.colors.base2} size={18} name={"add-circle"} />
            </View>
            <SuperText style={[styles.fontSize16,styles.textBase2]}>create new workout</SuperText>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderEntryRow(entry) {
    let date = (this.props.currentDate.getDate() == entry.day && this.props.currentDate.getMonth() == entry.month && this.props.currentDate.getFullYear() == entry.year) ? 'Today' : monthNames[entry.month] + ' ' + entry.day + ', ' + entry.year
    let exercises = this.props.exercises[entry.id]
    return (
      <TouchableHighlight style={cStyles.entryRow} onPress={(event) => this._navigateToEntryDetail(entry,date,entry.id)} underlayColor={styles.colors.alt3}>
        <View style={cStyles.entryRowWrapper}>
          <View style={cStyles.entryRowDayWrapper}>
            <View style={[cStyles.entryRowDay,{backgroundColor:entry.color ? entry.color : styles.colors.primaryDark}]}>
              <SuperText style={[styles.textPrimaryAlt, styles.fontSize18, styles.textBold, styles.textAlt2]}> {entry.day} </SuperText>
            </View>
          </View>
          <View style={cStyles.entryRowInfo}>
            <View style={[styles.rowFlex, styles.flex, styles.contentStart]}>
              <View style={styles.flex}>
                <View style={styles.rowFlex}>
                  <View style={styles.flex1}>
                    <SuperText style={[styles.textBase1,styles.fontSize13,styles.textBold]}>{entry.name}</SuperText>
                  </View>
                  <SuperText style={[styles.textPrimaryAlt,styles.fontSize10, styles.textBold]}>{date}</SuperText>
                </View>
                <View style={styles.rowFlex}>
                  <View style={styles.flex1}>
                    <SuperText style={[styles.textBase3,styles.fontSize12]}>{(entry.exercises ? entry.exercises.length : 0) + " exercises"}</SuperText>
                  </View>
                  {entry.shared ?
                    <View style={cStyles.sharedIcon}>
                      <MaIcon color={styles.colors.alt2} size={12} name={"share"} />
                    </View>
                    : null }
                  {entry.completed ?
                    <View style={cStyles.completedIcon}>
                      <MaIcon color={styles.colors.alt2} size={12} name={"check"} />
                    </View>
                     : null }
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  renderModal() {
    let years = ['2016','2017']

    return (
      <View style={[styles.boxShadow,styles.bgWhite]}>
        <View style={styles.rowFlex}>
          <Picker
            style={styles.flex1}
            selectedValue={this.state.selectedYear}
            onValueChange={(year) => this._setSelectedYear(year)}>
            {years.map((s, i) => {
              return <Picker.Item
                       key={i}
                       value={s}
                       label={s} />
             })}
          </Picker>
          <Picker
            style={styles.flex1}
            selectedValue={monthNames[this.state.selectedMonth]}
            onValueChange={(month,i) => this._setSelectedMonth(i)}>
            {monthNames.map((s, i) => {
              return <Picker.Item
                       key={i}
                       value={s}
                       label={s} />
             })}
          </Picker>
        </View>
        <View style={[styles.footerButtons]}>
          <TouchableOpacity style={[styles.footerButton]} onPress={(event) => this._setModalVisible(false)}>
            <View style={styles.removeButton}>
              <MaIcon color={styles.colors.secondary} size={18} name={"cancel"} />
            </View>
            <SuperText style={[styles.fontSize16,styles.textSecondary]}>close</SuperText>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //*************************
  // Navigation
  //*************************

  _navigateToEntryDetail(entry, date, id) {
    this.props.navigator.push({
      ident: "EntryDetail",
      title: entry.name,
      date,
      entryID: entry.id,
      entry
    })
  }


  _navigateToEntryCreation() {
    this.props.navigator.push({
      ident: "EntryCreation",
      title: 'NEW WORKOUT',
      sceneConfig: Navigator.SceneConfigs.FadeAndroid
    })
  }

  //*************************
  // Events
  //*************************


  _setSelectedYear(year) {
    this.setState({selectedYear: year})
    this.setNewEntries(year, this.state.selectedMonth)
  }

  _setSelectedMonth(month) {
    this.setState({selectedMonth: month})
    this.setNewEntries(this.state.selectedYear,month)
  }

  _setModalVisible(visible, type) {
    this.setState({modalVisible: visible, modalType: type});
  }

  //*************************
  // Helpers/Misc
  //*************************

  animate() {
    // Animate the update
    LayoutAnimation.easeInEaseOut();
  }

  /*
  * Helper function to sort an array of workout entries by month
  * @param {Number} a
  * @param {Number} b
  * @return {Boolean}
  */

  _compareMonth(a,b) {
    let x = a.month,
        y = b.month

    return (x < y) ? 1 : ((y < x) ? -1 : 0);
  }

  /*
  * Helper function to sort an array of workout entries by day
  * @param {Number} a
  * @param {Number} b
  * @return {Boolean}
  */

  _compareDay(a,b) {
    let x = a.day,
        y = b.day

    return (x < y) ? 1 : ((y < x) ? -1 : 0);
  }

  /*
  * Sort workout entries by month and year and return matching entries
  * @param {} entries
  * @param {Number} month
  * @param {String} year
  * @return [] entries
  */

  filterEntries(entries,year,month) {
    // Group entries into arrays by years
    let filteredEntries = _.groupBy(entries, 'year')

    // Get all entries matching month
    filteredEntries = _.filter(filteredEntries[year] , function(o) {
      return o.month == month
     })

    return (filteredEntries ? filteredEntries.sort(this._compareDay) : [])
  }

}


const cStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  modalSpacer: {
    flex: 1,
  },
  entryRow: {
    backgroundColor: styles.colors.alt2,
    borderBottomWidth: 1,
    borderColor: styles.colors.alt1,
  },
  entryRowWrapper: {
    flex: 1,
    flexDirection: 'row',

  },
  entryRowDayWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  entryRowDay: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  entryRowIcon: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryRowInfo: {
    flex: 4,
    padding: 12
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  sharedIcon: {
    overflow: 'hidden',
    backgroundColor: styles.colors.tertiary,
    borderRadius: 9,
    height: 18,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  completedIcon: {
    overflow: 'hidden',
    backgroundColor: styles.colors.primaryAlt,
    borderRadius: 9,
    height: 18,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4
  }
})

function mapStateToProps(state,component) {
  return {
    entries: state.entries,
    exercises: state.exercises
  }
}

export default connect(mapStateToProps,
  (dispatch) => ({
    actions: bindActionCreators(entryActions, dispatch)
  })
)(EntryScreen);
