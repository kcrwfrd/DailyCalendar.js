'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    /**
     * Vendor Files
     */
    vendor_files: {
      js: [
        'vendor/moment/moment.js',
        'vendor/lodash/dist/lodash.js'
      ]
    },

    /**
     * Jade compiles our templates into HTML
     */
    jade: {
      index: {
        options: {
          pretty: true
        },
        files: {
          'dist/index.html': 'src/index.jade'
        }
      }
    },

    /**
     * Lodash/Underscore templates are used for partials
     */
    jst: {
      compile: {
        options: {
          prettify: true,
          processName: function(filename) {
            // Remove the path and file extension
            return filename.split('/').pop().replace(/\.\w+$/i, '');
          }
        },
        files: [{
          src: [ 'src/templates/**/*.html' ],
          dest: 'dist/js/dc-templates.js'
        }]
      }
    },

    /**
     * Compiles SCSS stylesheets
     */
    compass: {
      build: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/css/',
          httpPath: '/',
          imagesDir: 'src/img',
          generatedImagesDir: 'dist/img',
          httpImagesPath: '../img',
          httpGeneratedImagesPath: '../img',
          fontsDir: 'src/fonts',
          httpFontsPath: '../fonts',
          environment: 'development',
          require: 'bootstrap-sass'
        }
      }
    },

    /**
     * Connect webserver
     */
    connect: {
      options: {
        port: 9001,
        livereload: true,
        hostname: '*'
      },
      livereload: {
        options: {
          open: true,
          base: [
            'dist'
          ]
        }
      }
    },

    /**
     * Clean our built assets.
     * NOTE: We do not want to remove `dist/.git`. `dist` is a clone of the repo
     * checked out to the gh-pages branch. This way we can deploy to github project pages.
     */
    clean: [ 'dist/*', '!dist/.git' ],

    /**
     * Copy over any images, fonts, etc.
     */
    copy: {
      assets: {
        files: [{
          cwd: 'src',
          src: [ 'fonts/**/*', 'img/**/*' ],
          dest: 'dist/',
          expand: true
        }]
      },

      src_js: {
        files: [{
          cwd: 'src',
          src: 'js/**/*.js',
          dest: 'dist/',
          expand: true
        }]
      },

      vendor_js: {
        files: [{
          cwd: '.',
          src: [ '<%= vendor_files.js %>' ],
          dest: 'dist/',
          expand: true
        }]
      }
    },

    /**
     * Watch files for changes
     */
    watch: {
      options: {
        livereload: true
      },

      jade: {
        files: 'src/index.jade',
        tasks: [ 'jade:index' ]
      },

      jst: {
        files: 'src/templates/*.html',
        tasks: [ 'jst:compile' ]
      },

      sass: {
        files: 'src/scss/**/*.scss',
        tasks: [ 'compass:build' ],
        livereload: true
      },

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'build' ]
      },

      src_js: {
        files: 'src/js/**/*.js',
        tasks: [ 'copy:src_js' ]
      },

      assets: {
        files: 'src/assets/**/*',
        tasks: [ 'copy:assets' ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jst');

  grunt.registerTask('develop', [
    'build',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy:assets',
    'copy:src_js',
    'copy:vendor_js',
    'jst',
    'compass:build',
    'jade:index'
  ]);

  grunt.registerTask('default', [
    'develop'
  ]);

};
