'use strict';
/* Controllers*/

var App;

angular.module('app.controllers', []).controller('AppCtrl', [
  '$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
    var setActiveNavId;
    $scope.application = {
      initialized: true
    };
    $scope.$location = $location;
    $scope.activeNavId = '/';
    setActiveNavId = function(path) {
      return $scope.activeNavId = path || '/';
    };
    $scope.$watch('$location.path()', setActiveNavId);
    return $scope.getClass = function(id) {
      var _ref;
      if (((_ref = $scope.activeNavId) != null ? _ref.substring(0, id.length) : void 0) === id) {
        return 'active';
      } else {
        return '';
      }
    };
  }
]).run();

angular.module('common.directives.selectAll', []).directive('haikuSelectAll', function() {
  return function(scope, elm) {
    return elm.on('focus', function() {
      return this.select();
    });
  };
});

angular.module('common.services.Dialog', []).service('Dialog', [
  '$window', function($window) {
    var Dialog;
    return Dialog = {
      alert: function(title) {
        return $window.alert(title);
      },
      prompt: function(title, callback) {
        var result;
        result = $window.prompt(title);
        return typeof callback === "function" ? callback(result) : void 0;
      }
    };
  }
]);

angular.module('app.common.webSockets', []).service('WebSockets', [
  '$window', function($window) {
    return window.io;
  }
]);

'use strict';

App = angular.module('app', ['templates', 'ngCookies', 'ngResource', 'app.controllers', 'app.common.webSockets', 'pl.paprikka.haiku-remote']);

App.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/404', {
      templateUrl: 'pages/404.html'
    }).when('/:roomID', {
      templateUrl: 'pages/remote.html',
      controller: 'HaikuRemoteCtrl'
    }).otherwise({
      redirectTo: '/404'
    });
    return $locationProvider.html5Mode(false);
  }
]).run();

angular.module('pl.paprikka.haiku-remote', ['pl.paprikka.haiku-remote.services.remote', 'pl.paprikka.haiku-remote.directives.remote', 'pl.paprikka.haiku-remote.controllers.remote']);

angular.module('pl.paprikka.haiku-remote.controllers.remote', ['common.services.Dialog', 'common.directives.selectAll']).controller('HaikuRemoteCtrl', [
  '$scope', '$routeParams', '$rootScope', 'Dialog', 'Remote', function($scope, $routeParams, $rootScope, Dialog, Remote) {
    $scope.previewStatus = {};
    $scope.remote = new Remote;
    $scope.roomID = $routeParams.roomID;
    $scope.topMessage = 'Connecting...';
    $rootScope.$on('room:joined', function(e, data) {
      console.log('Joined: ', data);
      $scope.topMessage = $routeParams.roomID;
      $scope.status = 'ready';
      return $scope.remote.broadcastJoinedRemote($scope.roomID);
    });
    $scope.joinRoom = function(roomID) {
      return $scope.remote.join(roomID);
    };
    if ($scope.roomID) {
      return $scope.joinRoom($scope.roomID);
    }
  }
]);

angular.module('pl.paprikka.haiku-remote.directives.remote', []).directive('haikuRemote', [
  '$window', '$rootScope', function($window, $rootScope) {
    return {
      replace: true,
      restrict: 'AE',
      templateUrl: 'remote/remote.html',
      scope: {
        remote: '=',
        previewStatus: '='
      },
      link: function(scope, elm, attr) {
        var keyCodes, onKeyDown, updateStatus;
        scope.remoteStatus = 'no';
        updateStatus = function() {
          var currentCategory, currentSlide, _ref, _ref1;
          currentCategory = scope.previewStatus.currentCategory;
          currentSlide = scope.previewStatus.currentSlide;
          scope.isLastCategory = currentCategory === scope.previewStatus.categories.length - 1 ? true : false;
          scope.isLastSlide = currentSlide === ((_ref = scope.previewStatus.categories[currentCategory]) != null ? (_ref1 = _ref.slides) != null ? _ref1.length : void 0 : void 0) - 1 ? true : false;
          scope.isFirstCategory = currentCategory === 0 ? true : false;
          return scope.isFirstSlide = currentSlide === 0 ? true : false;
        };
        $rootScope.$on('haiku:remote:update', function(e, data) {
          scope.remoteStatus = 'ready';
          console.log('update!', data);
          return scope.$apply(function() {
            scope.previewStatus = data;
            return updateStatus();
          });
        });
        keyCodes = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        };
        scope.goto = function(direction) {
          if (!scope.$$phase) {
            return scope.$apply(function() {
              var position, ps;
              ps = scope.previewStatus;
              position = {
                currentSlide: ps.currentSlide,
                currentCategory: ps.currentCategory
              };
              switch (direction) {
                case 'left':
                  position.currentCategory = Math.max(position.currentCategory - 1, 0);
                  position.currentSlide = 0;
                  break;
                case 'up':
                  position.currentSlide = Math.max(position.currentSlide - 1, 0);
                  break;
                case 'right':
                  position.currentCategory = Math.min(ps.categories.length - 1, position.currentCategory + 1);
                  position.currentSlide = 0;
                  break;
                case 'down':
                  position.currentSlide = Math.min(ps.categories[position.currentCategory].slides.length - 1, position.currentSlide + 1);
              }
              return scope.remote.goto(position);
            });
          }
        };
        onKeyDown = function(e) {
          if (keyCodes[e.keyCode]) {
            return scope.goto(keyCodes[e.keyCode]);
          }
        };
        $('body').on('keydown', onKeyDown);
        Hammer(elm.find('.remote__up')[0]).on('tap', function() {
          return scope.goto('up');
        });
        Hammer(elm.find('.remote__right')[0]).on('tap', function() {
          return scope.goto('right');
        });
        Hammer(elm.find('.remote__down')[0]).on('tap', function() {
          return scope.goto('down');
        });
        return Hammer(elm.find('.remote__left')[0]).on('tap', function() {
          return scope.goto('left');
        });
      }
    };
  }
]);

angular.module('pl.paprikka.haiku-remote.services.remote', []).factory('Remote', [
  'WebSockets', '$rootScope', function(WebSockets, $rootScope) {
    var Remote, SOCKET_LOCATION, socket;
    SOCKET_LOCATION = haiku.config.hubURL;
    socket = WebSockets.connect(SOCKET_LOCATION);
    Remote = (function() {
      Remote.prototype.room = null;

      function Remote() {
        var _this = this;
        socket.on('room:joined', function(data) {
          console.log('Remote::room joined');
          _this.room = data.room;
          return $rootScope.$emit('room:joined', data);
        });
        socket.on('remote:update', function(data) {
          console.log('Remote::update received', data);
          return $rootScope.$emit('haiku:remote:update', data.data);
        });
      }

      Remote.prototype.goto = function(position) {
        var message;
        console.log(position);
        message = {
          command: 'position',
          params: position,
          room: this.room
        };
        console.log('Remote::control goto');
        return socket.emit('remote', message);
      };

      Remote.prototype.go = function(direction) {
        var message;
        console.log({
          direction: direction
        });
        message = {
          command: 'direction',
          params: {
            direction: direction
          },
          room: this.room
        };
        console.log('Remote::control direction (go)');
        return socket.emit('remote', message);
      };

      Remote.prototype.join = function(room) {
        console.log('Remote::joining room');
        return socket.emit('room:join', {
          room: room,
          isRemote: true
        });
      };

      Remote.prototype.broadcastJoinedRemote = function(room) {
        console.log('Remote::broadcast join');
        return socket.emit('remote:remoteJoined', {
          room: room
        });
      };

      Remote.prototype.leave = function(room, cb) {
        console.log('Remote::leave');
        return socket.emit('room:leave', {
          room: room
        });
      };

      Remote.prototype.request = function(room) {
        return socket.emit('room:request', {
          room: room
        });
      };

      return Remote;

    })();
    return Remote;
  }
]);

/*
//@ sourceMappingURL=app.js.map
*/