angular.module('app.common.webSockets', []).service('WebSockets', [
  '$window'
  ($window)->
    window.io
])