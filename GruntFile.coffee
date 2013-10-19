module.exports = (grunt)->
  imports = grunt.file.readJSON 'imports.json'
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

 
    coffee:
      compile:
        files:
          'public/js/app.js' : ['src/**/*.coffee']
        options:
          sourceMap: yes
          join: yes
          bare: yes
        
      # precompile source and unit tests for code coverage tools
      compileForTests:
        options:
          bare: yes
        expand: yes
        flatten: no
        cwd: 'src'
        src: ['**/*.coffee']
        dest: 'test/js/'
        ext: '.js'

      compileTests:
        options:
          bare: yes
        expand:   yes
        flatten:  no
        cwd:      'test/unit/'
        src:      ['**/*.coffee']
        dest:     'test/js-unit/'
        ext:      '.spec.js'















    concat:
      options:
        separator: ';\n\n'
      vendorScripts:
        # Put specific bower-related vendor imports here. Don't include complete vendor dir, but select files explicitly to maintain control over loading order.
        src:  imports.scripts
        dest: 'public/js/vendor.js'















    watch:
      options:
        livereload: yes

      assets:  
        files: 'assets/**/*.*'
        tasks: ['copy:assets']

      scripts:  
        files: 'src/**/*.coffee'
        tasks: ['buildScripts']

      vendorScripts:
        files: imports.scripts
        tasks: ['concat:vendorScripts']

      templates:
        files: 'src/**/*.jade'
        tasks: ['buildTemplates']

      # styles:
      #   files:    ['styles/**/*.scss']
      #   tasks:    ['buildStyles']
      #   options: livereload: off

      css:
        files: ['public/css/*.css']
        tasks: 'livereload'

    jade:
      default:
        options:
          client:   no
          wrap:     no
          basePath: 'src'
          pretty:   yes
        files:
          'public/': ['src/**/*.jade']

    html2js:
      options:
        module: 'templates'
        base:   'public/'

      main:
        src:  'public/**/*.html'
        dest: 'public/js/templates.js'

    compass:
      compile:
        options:
          config: 'config.rb'
          # TODO: enable when compass gets updated with source maps support
          # raw: """
          #   sass_options = { 
          #     :sourcemap => true
          #   }
          #   """

    connect:
      server:
        options:
          hostname: '*'
          port: 8083
          base: 'public'
          keepalive: yes


      livereload:
        options:
          hostname: '*'
          port: 8083
          base: 'public'

    copy:
      assets:
        files:[
          src:['**'], dest:'public/', cwd:'assets/', expand: yes
        ]

    clean:
      public:
        src: ['public/*.*']
      templates:
        src: ['public/partials/**/*.*', 'public/index.html']
      scripts:
        src: ['public/js/app.js', 'public/js/vendor.js']
      testScripts:
        src: ['test/js/', 'test/coverage', 'test/js-unit']
      styles:
        src: ['public/css/']


  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-livereload'
  grunt.loadNpmTasks 'grunt-jade'
  grunt.loadNpmTasks 'grunt-html2js'

  grunt.registerTask 'buildScripts', [
    'clean:scripts'
    'coffee:compile'
    'concat:vendorScripts'
    'html2js:main'
    'livereload'
    'coffee:compileForTests'
    'coffee:compileTests'
  ]

  grunt.registerTask 'buildTemplates', ['clean:templates', 'jade', 'html2js:main', 'livereload']

  grunt.registerTask 'buildStyles', ['compass:compile']

  grunt.registerTask 'coverage', ['clean:testScripts', 'html2js:main', 'coffee:compileForTests', 'coffee:compileTests']

  grunt.registerTask 'default', [ 'connect:livereload', 'watch']
  
  grunt.registerTask 'init', [ 'buildTemplates', 'buildStyles', 'copy:assets', 'concat:vendorScripts'  ]

  # TODO: add new tasks
  # TODO: create INIT / Bootstrap task
  # grunt.registerTask 'base', ['clean:public', 'coffee', 'jade', 'compass']
