class HeaderController {
  constructor ($rootScope, Event) {
    Object.assign(this, {$rootScope, Event})

    // udpate header based on auth event
    this.$rootScope.$on(this.Event.AUTH_LOGIN, this.updateHeader.bind(this))
    this.$rootScope.$on(this.Event.AUTH_LOGOUT, this.updateHeader.bind(this))
    this.$rootScope.$on(this.Event.AUTH_SESSION_VALID, this.updateHeader.bind(this))
  }

  updateHeader (e, userInfo) {
    if (userInfo) {
      this.isLoggedIn = true
      this.userInfo = userInfo
    } else {
      this.isLoggedIn = false
      this.userInfo = null
    }
  }

  switchSidebar () {
    this.$rootScope.showSidebar = !this.$rootScope.showSidebar
  }
}

HeaderController.$inject = ['$rootScope', 'Event']

export default HeaderController
