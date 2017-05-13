const React = require('react-native')

const {StyleSheet} = React

let colors = {
  primaryAlt: '#179FE5',
  primaryLight: '#8ce517',
  primary: '#04c418',
  primaryDark: '#2e2e2e',
  secondary: '#D00000',
  tertiary: '#FFBA08',
  green: '#47D464',
  gray: '#e1e8ed',
  white: '#fefefe',
  grayLighter: '#F0F0F0',
  grayLight: '#CFCFCF',
  grayDark: '#212121',
  black: '#000000',
  warning: '#FF3B30',
}

const theme = 1

switch(theme) {
  case 1:
    colors.base1 = '#0d0f11'
    colors.base2 = '#616161'
    colors.base3 = '#777777'
    colors.alt1 = '#e9ebee'
    colors.alt2 = '#fefefe'
    colors.alt3 = '#e8e8e8'
    colors.alt4 = '#c3c3c3'
    break
}

const p1 = 16,
  p2 = 12,
  p3 = 8

var styles = StyleSheet.create({
  tabs: {
    borderTopWidth: 0
  },

  np: {
    padding: 0
  },

  npb: {
    paddingBottom: 0
  },

  p1: {
    padding: p1
  },

  p1t: {
    paddingTop: p1
  },

  p3t: {
    paddingTop: p3
  },

  p1b: {
    paddingBottom: 16
  },

  p1x: {
    paddingRight: 16,
    paddingLeft: 16
  },
  p2x: {
    paddingRight: p2,
    paddingLeft: p2
  },
  p1y: {
    paddingTop: 16,
    paddingBottom: 16
  },

  p2y: {
    paddingTop: p2,
    paddingBottom: p2
  },

  p2: {
    padding: 12
  },

  p3: {
    padding: 8
  },

  m1: {
    margin: 16
  },

  m1b: {
    marginBottom: 16
  },
  m1t: {
    marginTop: 16
  },
  m1x: {
    marginLeft: 16,
    marginRight: 16
  },
  m1y: {
    marginTop: 16,
    marginBottom: 16
  },

  // Page Layout

  fullPageWrapper: {
    backgroundColor: colors.alt1,
    flex: 1,
    paddingBottom: 48,
    paddingTop: 64
  },

  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.alt1,
  },

  scrollContentWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.alt1,
  },

  titleBarButton: {
    flex: 1,
    padding: 6,
    paddingTop: 10,
  },

  row: {
    padding: 16,
    overflow: 'hidden'
  },

  rowHeader: {
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: colors.alt1,
  },

  flex1: {
    flex: 1
  },

  listRow: {
    flex: 1,
    flexDirection: 'row',
  },

  listRowWrapper: {
    backgroundColor: colors.alt2,
    borderBottomWidth: 1,
    borderBottomColor: colors.alt3
  },

  listRowWrapperSlim: {
    backgroundColor: colors.alt2,
    marginRight: 12,
    marginLeft: 12,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 1
    },
  },

  rowContent: {
    paddingBottom: 16,
  },

  rowGutter: {
    paddingTop: 16,
  },

  rowFlex: {
    flexDirection: 'row',
  },

  rowLeft: {
    flex: 1
  },

  rowRight: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },

  rowHoriz: {
    paddingLeft: 16,
    paddingRight: 16
  },

  rowVert: {
    paddingTop: 16,
    paddingBottom: 16
  },

  rowDivider: {
    backgroundColor: colors.grayLighter,
  },

  gutter: {
    marginTop: 16
  },

  inputHeader: {
    paddingTop: 8
  },

  flexStretch: {
    alignSelf: 'stretch'
  },

  // Buttons
  placeholderButton: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.base2,
    padding: 8,
    borderRadius: 12,
    flexDirection: 'row'
  },

  buttonAlt3: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.alt3,
    padding: 8,
    borderRadius: 6
  },

  buttonAlt2: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.alt2,
    padding: 8,
    borderRadius: 6
  },


  buttonBase2: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.base2,
    padding: 8,
    borderRadius: 6
  },

  buttonBase3: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.base3,
    padding: 8,
    borderRadius: 6
  },

  buttonOptions: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },

  buttonOptionsSmall: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },

  buttonPrimaryLight: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: 8,
    borderRadius: 6
  },

  buttonPrimary: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 8,
    borderRadius: 6
  },

  buttonTertiary: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.tertiary,
    padding: 8,
    borderRadius: 6
  },

  buttonPrimaryAlt: {
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: colors.base1,
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 6
  },

  // Text colors
  textBase1: {
    color: colors.base1
  },
  textBase2: {
    color: colors.base2
  },
  textBase3: {
    color: colors.base3
  },
  textAlt1: {
    color: colors.alt1
  },
  textAlt2: {
    color: colors.alt2
  },
  textAlt3: {
    color: colors.alt3
  },
  textAlt4: {
    color: colors.alt4
  },
  textPrimary: {
    color: colors.primary
  },
  textPrimaryLight: {
    color: colors.primaryLight
  },
  textPrimaryAlt: {
    color: colors.primaryAlt
  },
  textPrimaryDark: {
    color: colors.primaryDark
  },
  textSecondary: {
    color: colors.secondary
  },
  textTertiary: {
    color: colors.tertiary
  },
  textDark: {
    color: colors.grayDark
  },
  textMedium: {
    color: colors.gray
  },
  textLight: {
    color: colors.grayLight
  },
  textLighter: {
    color: colors.grayLighter
  },
  textDanger: {
    color: colors.warning
  },
  textGreen: {
    color: colors.green
  },
  textWhite: {
    color: colors.white
  },
  bgTransparent: {
    backgroundColor: 'rgba(55,55,55,0.5)',
  },
  bgBase1: {
    backgroundColor: colors.base1
  },
  bgBase2: {
    backgroundColor: colors.base2
  },
  bgBase3: {
    backgroundColor: colors.base3
  },
  bgAlt1: {
    backgroundColor: colors.alt1
  },
  bgAlt2: {
    backgroundColor: colors.alt2
  },
  bgWhite: {
    backgroundColor: colors.white,
  },
  bgPrimary: {
    backgroundColor: colors.primary
  },
  bgPrimaryAlt: {
    backgroundColor: colors.primaryAlt
  },
  bgPrimaryDark: {
    backgroundColor: colors.primaryDark
  },
  bgPrimaryLight: {
    backgroundColor: colors.primaryLight
  },
  bgSecondary: {
    backgroundColor: colors.secondary,
  },
  bgLight: {
    backgroundColor: colors.grayLight
  },
  bgLighter: {
    backgroundColor: colors.grayLighter
  },
  bgTransparent: {
    backgroundColor: 'transparent',
  },
  textBold: {
    fontWeight: "bold",
    opacity: 0.9
  },
  textExtraBold: {
    fontWeight: "bold"
  },
  textItalic: {
    fontStyle: 'italic'
  },
  textUnderline: {
    textDecorationLine: 'underline'
  },

  // Text Sizes
  fontSize6: {
    fontSize: 8
  },
  fontSize8: {
    fontSize: 8
  },
  fontSize10: {
    fontSize: 10
  },
  fontSize12: {
    fontSize: 12
  },
  fontSize16: {
    fontSize: 16
  },
  fontSize18: {
    fontSize: 18
  },
  fontSize20: {
    fontSize: 20
  },
  fontSize24: {
    fontSize: 24
  },
  fontSize32: {
    fontSize: 32
  },
  fontSize40: {
    fontSize: 40
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },

  centerAlign: {
    alignItems: 'center'
  },

  rightAlign: {
    alignItems: 'flex-end'
  },

  centerSelf: {
    alignSelf: 'center'
  },

  // Modal

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalInnerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // Text Input

  input: {
    height: 16,
    color: colors.base2,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'helvetica',
  },

  inputLarge: {
    height: 32,
    color: colors.alt1,
    fontSize: 18,
    textAlign: 'center'
  },

  selectInput: {
    fontSize: 14
  },

  inputWrapper: {
    backgroundColor: colors.alt2,
    borderWidth: 1,
    borderColor: colors.alt4,
    backgroundColor: colors.alt1,
    padding: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 16,
    margin: 12,
  },
  inputWrapperStacked: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.alt4,
    borderRadius: 8,
    marginBottom: 16
  },

  inputBox: {
    padding: 32,
    backgroundColor: colors.alt2
  },

  // flex

  flex: {
    flex: 1
  },

  flex2: {
    flex: 2
  },

  flex3: {
    flex: 3
  },

  flexRow: {
    flex: 1,
    flexDirection: 'row'
  },

  flexCol: {
    flexDirection: 'column',
    alignItems: 'center'
  },

  contentEnd: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },

  contentStart: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },

  contentCenter: {
    justifyContent: 'center',
  },

  hCenter: {
    alignItems: 'center'
  },

  textCenter: {
    textAlign: 'center'
  },

  textRight: {
    textAlign: 'right'
  },

  boxShadow: {
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 0
    },
    zIndex: 1
  },
  boxShadowBottom: {
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    zIndex: 1
  },

  // Navigation
  navigator: {
    overflow: 'visible',
    backgroundColor: colors.alt2,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },

  navBar: {
    backgroundColor: colors.alt2,
    overflow: 'visible',
    shadowOpacity: 0.3,
    flex: 1,
    flexDirection: 'row',
  },

  navBarTitle: {
    padding: 12,
    color: colors.alt2,
    fontWeight: '800',
    fontFamily: 'avenir',
    fontSize: 14,
    textAlign: 'center'
  },

  navBarButton: {
    padding: 6,
    margin: 6,
  },

  // footer buttton bar
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: colors.alt2,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: -1,
      width: 0
    },
    zIndex: 1
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: colors.alt2,
    borderColor: colors.alt3,
    borderBottomWidth: 1
  },
  footerButton: {
    height: 50,
    paddingLeft: 0,
    paddingRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },

  addButton: {
    borderRadius: 10,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },

  removeButton: {
    borderRadius: 10,
    height: 18,
    width: 18,
    overflow: 'hidden',
    marginRight: 6
  },

  profileImage: {
    height: 72,
    width: 72
  },

  profileImageWrapper: {
    borderRadius: 36,
    height: 72,
    width: 72,
    overflow: 'hidden',
    backgroundColor: colors.alt3,
    margin: 16,
    marginRight: 0
  }
})

module.exports = styles
module.exports.colors = colors;
