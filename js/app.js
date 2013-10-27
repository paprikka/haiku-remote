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
    $rootScope.$on('room:joined', function(e, data) {
      console.log('Joined: ', data);
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
        var onKeyDown, updateStatus;
        updateStatus = function() {
          var currCat, currSlide, _ref, _ref1;
          currCat = scope.previewStatus.currentCategory;
          currSlide = scope.previewStatus.currentSlide;
          scope.isLastCategory = currCat === scope.previewStatus.categories.length - 1 ? true : false;
          scope.isLastSlide = currSlide === ((_ref = scope.previewStatus.categories[currCat]) != null ? (_ref1 = _ref.slides) != null ? _ref1.length : void 0 : void 0) - 1 ? true : false;
          scope.isFirstCategory = currCat === 0 ? true : false;
          return scope.isFirstSlide = currSlide === 0 ? true : false;
        };
        $rootScope.$on('haiku:remote:update', function(e, data) {
          console.log('update!', data);
          return scope.$apply(function() {
            scope.previewStatus = data;
            return updateStatus();
          });
        });
        onKeyDown = function(e) {
          if (!scope.$$phase) {
            return scope.$apply(function() {
              switch (e.keyCode) {
                case 37:
                  return scope.remote.go('left');
                case 38:
                  return scope.remote.go('up');
                case 39:
                  return scope.remote.go('right');
                case 40:
                  return scope.remote.go('down');
              }
            });
          }
        };
        $('body').on('keydown', onKeyDown);
        Hammer(elm.find('.remote__up')[0]).on('tap', function() {
          return scope.remote.go('up');
        });
        Hammer(elm.find('.remote__right')[0]).on('tap', function() {
          return scope.remote.go('right');
        });
        Hammer(elm.find('.remote__down')[0]).on('tap', function() {
          return scope.remote.go('down');
        });
        return Hammer(elm.find('.remote__left')[0]).on('tap', function() {
          return scope.remote.go('left');
        });
      }
    };
  }
]);

angular.module('pl.paprikka.haiku-remote.services.remote', []).factory('Remote', [
  'WebSockets', '$rootScope', function(WebSockets, $rootScope) {
    var HUB_LOCATION, Remote, SOCKET_LOCATION, socket;
    HUB_LOCATION = 'http://haiku-hub.herokuapp.com:80';
    SOCKET_LOCATION = location.hostname.split('.')[0] === '192' ? location.hostname + ':8082' : HUB_LOCATION;
    socket = WebSockets.connect(SOCKET_LOCATION);
    Remote = (function() {
      Remote.prototype.room = null;

      function Remote() {
        var _this = this;
        socket.on('room:joined', function(data) {
          _this.room = data.room;
          return $rootScope.$emit('room:joined', data);
        });
        socket.on('remote:update', function(data) {
          return $rootScope.$emit('haiku:remote:update', data.data);
        });
      }

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
        return socket.emit('remote', message);
      };

      Remote.prototype.join = function(room) {
        return socket.emit('room:join', {
          room: room,
          isRemote: true
        });
      };

      Remote.prototype.broadcastJoinedRemote = function(room) {
        return socket.emit('remote:remoteJoined', {
          room: room
        });
      };

      Remote.prototype.leave = function(room, cb) {
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