'use strict'

 import React, {
   Component,
 } from 'react';
 import {
   AppRegistry,
   Image,
   ListView,
   StyleSheet,
   Text,
   View,
   StatusBar,
   ActivityIndicator
 } from 'react-native';

import styles from './app/styles/styles.js'
import App from './app/App'

// packages
import MaIcon from 'react-native-vector-icons/MaterialIcons'

// redux
import { Provider } from 'react-redux/'

import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './app/reducers/index'
import {persistStore, autoRehydrate} from 'redux-persist'
var {AsyncStorage} = require('react-native')

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)
const store = autoRehydrate()(createStoreWithMiddleware)(rootReducer)

export default class aat extends Component {
  constructor(props) {
      super(props)
      // Dont' render until store is rehydrated from async storage
      this.state = { rehydrated: false }
  }

  componentWillMount() {
  persistStore(store, {storage: AsyncStorage, blacklist: ['setInputKeyboard']}, () => {
    this.setState({ rehydrated: true })
  })
}

  render() {
   if(!this.state.rehydrated) {
     return (
       <View style={[styles.pageWrapper,styles.center]}>
         <ActivityIndicator
           size={'large'}
           color={styles.colors.primaryAlt} />
       </View>
     )
   } else {
     return (
       <Provider store={store}>
         <App
           selectedTab="tab1" />
       </Provider>
     )
   }

 }

}

AppRegistry.registerComponent('aat', () => aat);
