module.exports = function (grunt) {

  // 1. All configuration goes here 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'dev/js/*.js', // All JS in the dev folder
        ],
        dest: 'prod/js/main.js',
      }
    },
    uglify: {
      my_target: {
        files: {
          'prod/js/main.min.js': ['prod/js/main.js']
        }
      }
    },
    clean: ["temp"],
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'dev/sass/imgs/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'prod/imgs/'
        }]
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['dev/js/*.js', 'dev/sass/*.scss', 'dev/sass/imgs'],
        tasks: ['concat', 'imagemin', 'uglify', 'sass', 'autoprefixer', 'clean'],
        options: {
          spawn: false,
        },
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'temp/main-unprefixed.css': 'dev/sass/main.scss'
        }
      }
    },
    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 35 versions']
        },
        files: {
          'prod/css/main.css': 'temp/main-unprefixed.css'
        }
      }
    }

  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.loadNpmTasks('grunt-contrib-clean');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['watch']);

};