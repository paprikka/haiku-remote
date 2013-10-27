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

angular.module('common.directives.selectAll', []).directive('haikuSelectAll', ->
  (scope, elm)->
    elm.on 'focus', -> @select()
)
angular.module('common.services.Dialog', []).service('Dialog', [

  '$window'

  ($window)->
    Dialog = 
      alert: (title) ->
        $window.alert title
      
      
      prompt: (title, callback)->
        result = $window.prompt title
        callback? result

])
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

      .when('/:roomID', 
        templateUrl: 'pages/remote.html', controller: 'HaikuRemoteCtrl'
      )

      # Catch all / 404
      .otherwise({redirectTo: '/404'})

    # Without server side setup html5 pushState support must be disabled.
    $locationProvider.html5Mode off

]).run()




angular.module('pl.paprikka.haiku-remote', [
  'pl.paprikka.haiku-remote.services.remote'
  'pl.paprikka.haiku-remote.directives.remote'
  'pl.paprikka.haiku-remote.controllers.remote'
])
angular.module('pl.paprikka.haiku-remote.controllers.remote', [ 

  'common.services.Dialog' 
  'common.directives.selectAll' 

  ]).controller('HaikuRemoteCtrl', [

  '$scope'
  '$routeParams'
  '$rootScope'
  'Dialog'
  'Remote'

  ($scope, $routeParams, $rootScope, Dialog, Remote) ->

    $scope.previewStatus = {}
    
    $scope.remote = new Remote
    $scope.roomID = $routeParams.roomID

    $rootScope.$on 'room:joined', (e, data)-> 
      console.log 'Joined: ', data
      $scope.remote.broadcastJoinedRemote $scope.roomID

    $scope.joinRoom =  (roomID) ->
      $scope.remote.join roomID
    
    if $scope.roomID then $scope.joinRoom $scope.roomID

])
angular.module('pl.paprikka.haiku-remote.directives.remote', []).directive('haikuRemote', [
  '$window'
  '$rootScope'

  ($window, $rootScope)->
    replace: yes
    restrict: 'AE'
    templateUrl: 'remote/remote.html'
    scope:
      remote: '='
      previewStatus: '='

    link: (scope, elm, attr) ->


        

      updateStatus = ->
        currCat = scope.previewStatus.currentCategory
        currSlide = scope.previewStatus.currentSlide

        scope.isLastCategory  = if currCat is scope.previewStatus.categories.length - 1 then yes else no
        scope.isLastSlide     = if currSlide is scope.previewStatus.categories[currCat]?.slides?.length - 1 then yes else no
        scope.isFirstCategory = if currCat is 0 then yes else no
        scope.isFirstSlide    = if currSlide is 0 then yes else no
        
      $rootScope.$on 'haiku:remote:update', (e, data)-> 
        console.log 'update!', data
        scope.$apply ->
          scope.previewStatus = data
          updateStatus()

      onKeyDown = (e) ->
        unless scope.$$phase then scope.$apply ->
          switch e.keyCode
            when 37 then scope.remote.go 'left'
            when 38 then scope.remote.go 'up'
            when 39 then scope.remote.go 'right'
            when 40 then scope.remote.go 'down'
        # e.preventDefault()
      $('body').on 'keydown', onKeyDown

      # TODO: create tap directive
      Hammer(elm.find('.remote__up')[0]).on 'tap', -> scope.remote.go 'up'
      Hammer(elm.find('.remote__right')[0]).on 'tap', -> scope.remote.go 'right'
      Hammer(elm.find('.remote__down')[0]).on 'tap', -> scope.remote.go 'down'
      Hammer(elm.find('.remote__left')[0]).on 'tap', -> scope.remote.go 'left'

])
angular.module('pl.paprikka.haiku-remote.services.remote', []).factory('Remote', [

  'WebSockets'
  '$rootScope'

  ( WebSockets, $rootScope ) ->
    HUB_LOCATION = 'http://haiku-hub.herokuapp.com:80'
    SOCKET_LOCATION = if location.hostname.split('.')[0] is '192' then location.hostname + ':8082' else HUB_LOCATION
    socket = WebSockets.connect SOCKET_LOCATION
    class Remote
      room: null
      constructor: ->
        socket.on 'room:joined', (data) =>
          @room = data.room
          $rootScope.$emit 'room:joined', data
        
        socket.on 'remote:update', (data)-> 
          $rootScope.$emit 'haiku:remote:update', data.data
        # socket.emit 'remote:update', {data, room}        
        
      go:( direction ) ->
        console.log {direction}
        message =
          command: 'direction'
          params:
            direction: direction
          room: @room
        socket.emit 'remote', message

      join:     (room) -> 
        socket.emit 'room:join', { room: room, isRemote: yes }

      broadcastJoinedRemote: (room) ->
        socket.emit 'remote:remoteJoined', { room }
        
      leave:    (room, cb) -> 
        socket.emit 'room:leave', { room: room }

      request:  (room) -> 
        socket.emit 'room:request', { room: room }

      # create:   (room) -> socket.emit 'room:create', { room: room }
      
    Remote  
])