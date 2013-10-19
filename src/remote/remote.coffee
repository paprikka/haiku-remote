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