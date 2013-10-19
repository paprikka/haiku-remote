'use strict'

### Controllers ###


#  ## Main Application Controller
angular.module('app.controllers', [])
.controller('AppCtrl', [
  
  '$scope'
  '$location'
  '$rootScope'


  ($scope, $location, $rootScope) ->


    $scope.application =
      initialized: yes


    # TODO: enable watch unit testing on Karma

    # 1. Uses the url to determine if the selected
    # menu item should have the class `active`.
    # 2. Add $location ref to scope, so it could be watched
    $scope.$location = $location

    $scope.activeNavId = '/'
    setActiveNavId = (path) -> $scope.activeNavId = path or '/'

    $scope.$watch '$location.path()', setActiveNavId

    # Improved agular-seed version, runs even if no path was invoked yet.
    $scope.getClass = (id) ->
      if $scope.activeNavId?.substring(0, id.length) is id
        'active'
      else
        ''

]).run()

angular.module('app.common.webSockets', []).service('WebSockets', [
  '$window'
  ($window)->
    window.io
])
'use strict'

# All dependencies should be loaded in the main app module
App = angular.module('app', [

  # ## Vendor modules / components
  'templates'
  'ngCookies'
  'ngResource'


  # ## Application components
  'app.controllers'

  'app.common.webSockets'
  'pl.paprikka.haiku-remote'

])











App.config([
  '$routeProvider'
  '$locationProvider'
  ($routeProvider, $locationProvider) ->

    $routeProvider

      .when('/404', {templateUrl: 'pages/404.html'})

      .when('/', 
        templateUrl: 'pages/remote.html'
      )

      # Catch all / 404
      .otherwise({redirectTo: '/404'})

    # Without server side setup html5 pushState support must be disabled.
    $locationProvider.html5Mode off

]).run()




angular.module('pl.paprikka.haiku-remote', [
  'pl.paprikka.haiku-remote.services.remote'
  'pl.paprikka.haiku-remote.directives.remote'
])
angular.module('pl.paprikka.haiku-remote.directives.remote', []).directive('haikuRemote', [
  'Remote'
  '$window'

  (Remote, $window)->
    replace: yes
    restrict: 'AE'
    templateUrl: 'remote/remote.html'
    link: (scope, elm, attr) ->
      remote = new Remote

      onKeyDown = (e) ->
        unless scope.$$phase then scope.$apply ->
          switch e.keyCode
            when 37 then remote.go 'left'
            when 38 then remote.go 'up'
            when 39 then remote.go 'right'
            when 40 then remote.go 'down'
        # e.preventDefault()
      $('body').on 'keydown', onKeyDown

      # TODO: create tap directive
      Hammer(elm.find('.remote__up')[0]).on 'tap', -> remote.go 'up'
      Hammer(elm.find('.remote__right')[0]).on 'tap', -> remote.go 'right'
      Hammer(elm.find('.remote__down')[0]).on 'tap', -> remote.go 'down'
      Hammer(elm.find('.remote__left')[0]).on 'tap', -> remote.go 'left'

])
angular.module('pl.paprikka.haiku-remote.services.remote', []).factory('Remote', [
  'WebSockets'
  ( WebSockets) ->
    socket = WebSockets.connect 'http://haiku-hub.herokuapp.com:80'
    class Remote
      go:( direction ) ->
        console.log {direction}
        socket.emit 'remote', {command: 'direction', params: direction: direction}

    Remote  
])