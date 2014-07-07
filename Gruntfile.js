'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  var bannerContent = '/*! <%= pkg.name %> v<%= pkg.version %> - ' +
                      '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
                      ' * License: <%= pkg.license %> */\n';

  var name = '<%= pkg.name %>-v<%= pkg.version %>';
  var latest = '<%= pkg.name %>';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        banner: bannerContent
      },
      target : {
        src : ['src/**/*.js'],
        dest : name + '.js'
      }
    },

    uglify: {
      options : {
        banner: bannerContent
      },
      target : {
        src : [ 'src/**/*.js' ],
        dest : name + '.min.js'
      }
    },


    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'ts.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
            '!dist/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    copy: {
      development: {
        src: name + '.js',
        dest: latest + '.js'
      },
      minified:{
        src: name + '.min.js',
        dest: latest + '.min.js'
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },
    //

    // Watch for build, test and jshint
    watch: {
      src: {
        files : [
          'src/**/*.js',
          'Gruntfile.js'
          ],
        tasks : [ 'build', 'test:unit', 'jshint' ]
      }
    },


    // Test settings
    karma: {
      e2e: {
        configFile: 'karma-e2e.conf.js',
        singleRun: true
      },
      unit: {
        configFile: 'karma.conf.js',
        singleRun: false
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test:unit', [
    'clean:server',
    'karma:unit'
  ]);

  grunt.registerTask('test:e2e', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'karma:e2e'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'uglify',
    'copy'
  ]);

  grunt.registerTask('default', [
    'build',
    'watch'
  ]);
};
