angular.module('templates', ['head.html', 'index.html', 'pages/404.html', 'pages/partials/intro.html', 'pages/remote.html', 'remote/remote.html']);

angular.module("head.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("head.html",
    "\n" +
    "<head>\n" +
    "  <meta charset=\"utf-8\"/>\n" +
    "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\"/>\n" +
    "  <meta name=\"HandheldFriendly\" content=\"True\"/>\n" +
    "  <meta name=\"MobileOptimized\" content=\"320\"/>\n" +
    "  <meta content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" name=\"viewport\"/>\n" +
    "  <meta http-equiv=\"cleartype\" content=\"on\"/>\n" +
    "  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\"/>\n" +
    "  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\"/>\n" +
    "  <meta name=\"apple-mobile-web-app-title\" content=\"Haiku\"/>\n" +
    "  <meta name=\"description\" content=\"\"/>\n" +
    "  <meta name=\"author\" content=\"Rafał Pastuszak &lt;rafal@paprikka.pl&gt;\"/>\n" +
    "  <meta name=\"robots\" content=\"noindex\"/>\n" +
    "  <title>Haiku - remote</title>\n" +
    "  <link rel=\"stylesheet\" href=\"css/app.css\"/>\n" +
    "  <script>\n" +
    "    (function() {\n" +
    "      var method;\n" +
    "      var noop = function noop() {};\n" +
    "      var methods = [\n" +
    "          'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',\n" +
    "          'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',\n" +
    "          'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',\n" +
    "          'timeStamp', 'trace', 'warn'\n" +
    "      ];\n" +
    "      var length = methods.length;\n" +
    "      var console = (window.console = window.console || {});\n" +
    "      \n" +
    "      while (length--) {\n" +
    "          method = methods[length];\n" +
    "          \n" +
    "          // Only stub undefined methods.\n" +
    "          if (!console[method]) {\n" +
    "              console[method] = noop;\n" +
    "          }\n" +
    "      }\n" +
    "    }());\n" +
    "  </script><!--[if lte IE 8]>\n" +
    "  <script src=\"//html5shiv.googlecode.com/svn/trunk/html5.js\"></script><![endif]-->\n" +
    "  <script src=\"js/modernizr.js\"></script>\n" +
    "  <script src=\"http://haiku-hub.herokuapp.com/socket.io/socket.io.js\"></script>\n" +
    "  <script src=\"js/vendor.js\"></script>\n" +
    "  <script src=\"js/templates.js\"></script>\n" +
    "  <script src=\"js/app.js\"></script>\n" +
    "</head>");
}]);

angular.module("index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("index.html",
    "<!DOCTYPE html><!--[if lt IE 7]><html class=\"no-js lt-ie9 lt-ie8 lt-ie7\" lang=\"en\"><![endif]--><!--[if IE 7]><html class=\"no-js lt-ie9 lt-ie8\" lang=\"en\"><![endif]--><!--[if IE 8]><html class=\"no-js lt-ie9\" lang=\"en\"><![endif]--><!--[if gt IE 8]><!-->\n" +
    "<html lang=\"en\" class=\"no-js\">\n" +
    "  <!-- <![endif]-->\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n" +
    "    <meta name=\"HandheldFriendly\" content=\"True\">\n" +
    "    <meta name=\"MobileOptimized\" content=\"320\">\n" +
    "    <meta content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" name=\"viewport\">\n" +
    "    <meta http-equiv=\"cleartype\" content=\"on\">\n" +
    "    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n" +
    "    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">\n" +
    "    <meta name=\"apple-mobile-web-app-title\" content=\"Haiku\">\n" +
    "    <meta name=\"description\" content=\"\">\n" +
    "    <meta name=\"author\" content=\"Rafał Pastuszak &lt;rafal@paprikka.pl&gt;\">\n" +
    "    <meta name=\"robots\" content=\"noindex\">\n" +
    "    <title>Haiku - remote</title>\n" +
    "    <link rel=\"stylesheet\" href=\"css/app.css\">\n" +
    "    <script>\n" +
    "      (function() {\n" +
    "        var method;\n" +
    "        var noop = function noop() {};\n" +
    "        var methods = [\n" +
    "            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',\n" +
    "            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',\n" +
    "            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',\n" +
    "            'timeStamp', 'trace', 'warn'\n" +
    "        ];\n" +
    "        var length = methods.length;\n" +
    "        var console = (window.console = window.console || {});\n" +
    "        \n" +
    "        while (length--) {\n" +
    "            method = methods[length];\n" +
    "            \n" +
    "            // Only stub undefined methods.\n" +
    "            if (!console[method]) {\n" +
    "                console[method] = noop;\n" +
    "            }\n" +
    "        }\n" +
    "      }());\n" +
    "    </script><!--[if lte IE 8]>\n" +
    "    <script src=\"//html5shiv.googlecode.com/svn/trunk/html5.js\"></script><![endif]-->\n" +
    "    <script src=\"js/modernizr.js\"></script>\n" +
    "    <script src=\"http://haiku-hub.herokuapp.com/socket.io/socket.io.js\"></script>\n" +
    "    <script src=\"js/vendor.js\"></script>\n" +
    "    <script src=\"js/templates.js\"></script>\n" +
    "    <script src=\"js/app.js\"></script>\n" +
    "  </head>\n" +
    "  <body ng-controller=\"AppCtrl\" ng-app=\"app\" id=\"ng-app\">\n" +
    "    <div class=\"viewport\">\n" +
    "      <div ng-view class=\"viewport__content\"></div>\n" +
    "    </div>\n" +
    "    <script>\n" +
    "      $('body').on('touchmove', function (e) {\n" +
    "         if (!$('.scrollable').has($(e.target)).length) e.preventDefault();\n" +
    "      });\n" +
    "    </script>\n" +
    "  </body>\n" +
    "</html>");
}]);

angular.module("pages/404.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pages/404.html",
    "\n" +
    "<h1 class=\"alpha deco\">Four oh Four</h1>");
}]);

angular.module("pages/partials/intro.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pages/partials/intro.html",
    "\n" +
    "<div class=\"page-content\">\n" +
    "  <div class=\"intro-wrapper\">\n" +
    "    <haiku></haiku>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("pages/remote.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pages/remote.html",
    "\n" +
    "<div>\n" +
    "  <form ng-submit=\"joinRoom(roomID)\" class=\"remote__tools\">\n" +
    "    <input placeholder=\"Enter room ID\" haiku-select-all=\"haiku-select-all\" ng-model=\"roomID\" readonly=\"readonly\" class=\"remote__room\"/>\n" +
    "  </form>\n" +
    "  <haiku-remote remote=\"remote\" preview-status=\"previewStatus\"></haiku-remote>\n" +
    "</div>");
}]);

angular.module("remote/remote.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("remote/remote.html",
    "\n" +
    "<div class=\"remote\">\n" +
    "  <div class=\"remote__nav\">\n" +
    "    <button ng-class=\" {'remote__btn--disabled' : isFirstSlide} \" class=\"remote__up\"></button>\n" +
    "    <button ng-class=\" {'remote__btn--disabled' : isLastCategory} \" class=\"remote__right\"></button>\n" +
    "    <button ng-class=\" {'remote__btn--disabled' : isLastSlide} \" class=\"remote__down\"></button>\n" +
    "    <button ng-class=\" {'remote__btn--disabled' : isFirstCategory} \" class=\"remote__left\"></button>\n" +
    "  </div>\n" +
    "</div>");
}]);
