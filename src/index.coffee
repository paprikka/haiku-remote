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


