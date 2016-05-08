const config = {
  appTitle: 'koala'
}

appConfig.$inject = ['RouterHelperProvider']
function appConfig (RouterHelperProvider) {
  RouterHelperProvider.configure({mainTitle: config.appTitle})
}

export default appConfig
