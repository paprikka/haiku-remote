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
    $scope.topMessage = 'Connecting...'

    $rootScope.$on 'room:joined', (e, data)->
      console.log 'Joined: ', data
      $scope.topMessage = $routeParams.roomID
      $scope.status = 'ready'
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

      scope.remoteStatus = 'no'

      updateStatus = ->
        currentCategory = scope.previewStatus.currentCategory
        currentSlide = scope.previewStatus.currentSlide

        scope.isLastCategory  = if currentCategory is scope.previewStatus.categories.length - 1 then yes else no
        scope.isLastSlide     = if currentSlide is scope.previewStatus.categories[currentCategory]?.slides?.length - 1 then yes else no
        scope.isFirstCategory = if currentCategory is 0 then yes else no
        scope.isFirstSlide    = if currentSlide is 0 then yes else no

      $rootScope.$on 'haiku:remote:update', (e, data)->
        scope.remoteStatus = 'ready'
        console.log 'update!', data
        scope.$apply ->
          scope.previewStatus = data
          updateStatus()

      keyCodes =
        37: 'left'
        38: 'up'
        39: 'right'
        40: 'down'


      scope.goto = (direction)->
        unless scope.$$phase then scope.$apply ->
          ps = scope.previewStatus
          position =
            currentSlide: ps.currentSlide
            currentCategory: ps.currentCategory
          switch direction
            when 'left'
              position.currentCategory = Math.max (position.currentCategory - 1), 0
              position.currentSlide = 0
            when 'up'
              position.currentSlide = Math.max (position.currentSlide - 1), 0
            when 'right'
              position.currentCategory = Math.min (ps.categories.length - 1), (position.currentCategory + 1)
              position.currentSlide = 0
            when 'down'
              position.currentSlide = Math.min (ps.categories[position.currentCategory].slides.length - 1), (position.currentSlide + 1)
          scope.remote.goto position


      onKeyDown = (e) ->
        if keyCodes[e.keyCode] then scope.goto keyCodes[e.keyCode]




      $('body').on 'keydown', onKeyDown

      # TODO: create tap directive
      Hammer(elm.find('.remote__up')[0]).on 'tap',    -> scope.goto 'up'
      Hammer(elm.find('.remote__right')[0]).on 'tap', -> scope.goto 'right'
      Hammer(elm.find('.remote__down')[0]).on 'tap',  -> scope.goto 'down'
      Hammer(elm.find('.remote__left')[0]).on 'tap',  -> scope.goto 'left'

])

# ## Remote
#
# ### How to initialise connection with player:
#
# -> outbound
# <- inbound
#
# 1. `room:join` ->
# 2. `room:joined` <-
# 3. `room:remoteJoined` ->
# 4. `remote:update` <-
#
# ### Control events:
#
# `remote` ->


angular.module('pl.paprikka.haiku-remote.services.remote', []).factory('Remote', [

  'WebSockets'
  '$rootScope'

  ( WebSockets, $rootScope ) ->
    SOCKET_LOCATION = haiku.config.hubURL
    socket = WebSockets.connect SOCKET_LOCATION
    class Remote
      room: null
      constructor: ->
        socket.on 'room:joined', (data) =>
          console.log 'Remote::room joined'
          @room = data.room
          $rootScope.$emit 'room:joined', data

        socket.on 'remote:update', (data)->
          console.log 'Remote::update received', data
          $rootScope.$emit 'haiku:remote:update', data.data
        # socket.emit 'remote:update', {data, room}

      goto: (position)->
        console.log position
        message =
          command:  'position'
          params:   position
          room:     @room
        console.log 'Remote::control goto'
        socket.emit 'remote', message

      go:( direction ) ->
        console.log {direction}
        message =
          command: 'direction'
          params:
            direction: direction
          room: @room
        console.log 'Remote::control direction (go)'
        socket.emit 'remote', message

      join:     (room) ->
        console.log 'Remote::joining room'
        socket.emit 'room:join', { room: room, isRemote: yes }

      broadcastJoinedRemote: (room) ->
        console.log 'Remote::broadcast join'
        socket.emit 'remote:remoteJoined', { room }

      leave:    (room, cb) ->
        console.log 'Remote::leave'
        socket.emit 'room:leave', { room: room }

      request:  (room) ->
        socket.emit 'room:request', { room: room }

      # create:   (room) -> socket.emit 'room:create', { room: room }

    Remote
])
