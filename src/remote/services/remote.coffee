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