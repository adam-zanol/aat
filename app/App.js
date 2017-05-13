'use strict'
import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TabBarIOS,
} from 'react-native';

import EntryNavigator from './navigators/EntryNavigator'
import CreationNavigator from './navigators/CreationNavigator'
import SocialNavigator from './navigators/SocialNavigator'
import SettingsNavigator from './navigators/SettingsNavigator'
import styles from './styles/styles.js'
import MaIcon from 'react-native-vector-icons/MaterialIcons'
import EnIcon from 'react-native-vector-icons/Entypo'
import {connect} from 'react-redux'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedTab: this.props.selectedTab,
      tabColor: styles.colors.primaryAlt
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <TabBarIOS
        style={styles.tabs}
        tintColor={this.state.tabColor}
        barTintColor={styles.colors.black}
        selectedTab={this.state.selectedTab}>
        <EnIcon.TabBarItemIOS
          title=""
          selected={this.state.selectedTab === "tab1"}
          iconName="list"
          onPress={() => this.setState({selectedTab: "tab1",tabColor: styles.colors.primaryAlt})}>
          <EntryNavigator
            {...this.props}
            initialRoute={{ident: "EntryOverview"}} />
        </EnIcon.TabBarItemIOS>
        <EnIcon.TabBarItemIOS
          title=""
          selected={this.state.selectedTab === "tab2"}
          iconName="tools"
          onPress={() => this.setState({selectedTab: "tab2",tabColor: styles.colors.primary})}>
          <CreationNavigator
            initialRoute={{ident: "CreationOverview"}} />
        </EnIcon.TabBarItemIOS>
        {!this.props.settings.hideSocialTab ?
          <EnIcon.TabBarItemIOS
            title=""
            selected={this.state.selectedTab === "tab3"}
            iconName="users"
            onPress={() => this.setState({selectedTab: "tab3",tabColor: styles.colors.tertiary})}>
            <SocialNavigator
              initialRoute={{ident: "SocialOverview"}}  />
          </EnIcon.TabBarItemIOS>
        : null}
        <MaIcon.TabBarItemIOS
          title=""
          selected={this.state.selectedTab === "tab4"}
          iconName="settings"
          onPress={() => this.setState({selectedTab: "tab4", tabColor: styles.colors.secondary})}>
          <SettingsNavigator
            initialRoute={{ident: "Settings"}}  />
        </MaIcon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
}


function mapStateToProps(state,component) {
  return {
    settings: state.settings,
  }
}

export default connect(mapStateToProps)(App);
