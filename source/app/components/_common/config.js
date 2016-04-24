const config = {
    appTitle: 'koala0'
};

appConfig.$inject = ['RouterHelperProvider'];
function appConfig (RouterHelperProvider) {
    RouterHelperProvider.configure({mainTitle: config.appTitle});
}

export default appConfig;
