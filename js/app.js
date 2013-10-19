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
    }).when('/', {
      templateUrl: 'pages/remote.html'
    }).otherwise({
      redirectTo: '/404'
    });
    return $locationProvider.html5Mode(false);
  }
]).run();

angular.module('pl.paprikka.haiku-remote', ['pl.paprikka.haiku-remote.services.remote', 'pl.paprikka.haiku-remote.directives.remote']);

angular.module('pl.paprikka.haiku-remote.directives.remote', []).directive('haikuRemote', [
  'Remote', '$window', function(Remote, $window) {
    return {
      replace: true,
      restrict: 'AE',
      templateUrl: 'remote/remote.html',
      link: function(scope, elm, attr) {
        var onKeyDown, remote;
        remote = new Remote;
        onKeyDown = function(e) {
          if (!scope.$$phase) {
            return scope.$apply(function() {
              switch (e.keyCode) {
                case 37:
                  return remote.go('left');
                case 38:
                  return remote.go('up');
                case 39:
                  return remote.go('right');
                case 40:
                  return remote.go('down');
              }
            });
          }
        };
        $('body').on('keydown', onKeyDown);
        Hammer(elm.find('.remote__up')[0]).on('tap', function() {
          return remote.go('up');
        });
        Hammer(elm.find('.remote__right')[0]).on('tap', function() {
          return remote.go('right');
        });
        Hammer(elm.find('.remote__down')[0]).on('tap', function() {
          return remote.go('down');
        });
        return Hammer(elm.find('.remote__left')[0]).on('tap', function() {
          return remote.go('left');
        });
      }
    };
  }
]);

angular.module('pl.paprikka.haiku-remote.services.remote', []).factory('Remote', [
  'WebSockets', function(WebSockets) {
    var Remote, socket;
    socket = WebSockets.connect('http://haiku-hub.herokuapp.com:80');
    Remote = (function() {
      function Remote() {}

      Remote.prototype.go = function(direction) {
        console.log({
          direction: direction
        });
        return socket.emit('remote', {
          command: 'direction',
          params: {
            direction: direction
          }
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