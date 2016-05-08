import angular from 'angular'

const [handlingStateChangeError, hasOtherwise, stateCounts] = [
  Symbol(), Symbol(), Symbol()
]

class RouterHelper {
  constructor (config, $stateProvider, $urlRouterProvider,
    $rootScope, $state, Logger, Resolve) {
    Object.assign(this, {config, $stateProvider, $urlRouterProvider,
    $rootScope, $state, Logger, Resolve})
    // private variable
    this[handlingStateChangeError] = false
    this[hasOtherwise] = false
    this[stateCounts] = {
      errors: 0,
      changes: 0
    }

    this.handleRoutingErrors()
    this.updateDocTitle()
  }

  configureStates (states, otherwisePath) {
    const self = this
    states.forEach((state) => {
      // add login check if requireLogin is true
      const data = state.config.data
      if (data && data.requireLogin === true) {
        state.config.resolve = angular.extend(
          state.config.resolve || {},
          {loginResolve: self.Resolve.login}
        )
      }
      state.config.resolve =
        angular.extend(state.config.resolve || {}, self.config.resolveAlways)
      this.$stateProvider.state(state.state, state.config)
    })
    if (otherwisePath && !this[hasOtherwise]) {
      this[hasOtherwise] = true
      this.$urlRouterProvider.otherwise(otherwisePath)
    }
  }

  handleRoutingErrors () {
    // Route cancellation:
    // On routing error, go to the dashboard.
    // Provide an exit clause if it tries to do it twice.
    this.$rootScope.$on('$stateChangeError',
      (event, toState, toParams, fromState, fromParams, error) => {
        if (this[handlingStateChangeError]) {
          return
        }
        this[stateCounts].errors++
        this[handlingStateChangeError] = true
        const destination = (toState &&
          (toState.title || toState.name || toState.loadedTemplateUrl)) ||
          'unknown target'
        const errorMessage = (error && error.message) || error
        const msg = `Error routing to ${destination}.
Reason: ${errorMessage}.`
        this.Logger.warning(msg)
        // handle requireLogin issue
        if (error === 'requireLogin') {
          this.$state.prev = {
            state: toState.name,
            params: toParams
          }
          this.$state.go('root.layout.login')
        } else {
          this.$state.go('root.layout.home')
        }
      }
    )
  }

  getStates () {
    return this.$state.get()
  }

  updateDocTitle () {
    this.$rootScope.$on('$stateChangeSuccess',
      (event, toState) => {
        this[stateCounts].changes++
        this[handlingStateChangeError] = false
        const title = `${toState.data.title} - ${this.config.mainTitle}`
        this.$rootScope.title = title; // data bind to <title>
        this.$rootScope._class = toState.data._class; // data bind to <body>
      }
    )
  }
}

RouterHelper.$inject = []

// Help configure the state-base ui.router
class RouterHelperProvider {
  constructor ($locationProvider, $stateProvider, $urlRouterProvider) {
    Object.assign(this, {$locationProvider, $stateProvider, $urlRouterProvider})

    this.config = {
      mainTitle: '',
      resolveAlways: {}
    }
    this.$locationProvider.html5Mode(true)
  }

  configure (cfg) {
    angular.extend(this.config, cfg)
  }

  $get ($rootScope, $state, Logger, Resolve) {
    return new RouterHelper(
      this.config, this.$stateProvider, this.$urlRouterProvider,
      $rootScope, $state, Logger, Resolve)
  }
}

RouterHelperProvider.prototype.$get.$inject = [
  '$rootScope', '$state', 'Logger', 'Resolve'
]

RouterHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider']

export default RouterHelperProvider
