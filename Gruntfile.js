module.exports = function(grunt)
{
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      jshint: {
        files: ['public/dev/scripts/app/**/*.js', 'public/dev/test/**/*.js'],
        options: {
          globals: {
            jQuery: true
            }
          }
        },
      uglify: {
        product_target: {
          options:{
            beautify: true,
          },
          files: [{
            expand: true,
            cwd: 'public/dev/scripts/',
            src: '**/*.js',
            dest: 'public/scripts'
          }]
        }
      },
      sass: {
        dist: {
          files: [{
            expand: true,
            cwd: 'public/dev/content/stylesheets/',
            src: ['**/*.scss'],
            dest: 'public/content/css/',
            ext: '.css'
          }]
        }
      },
      watch: {
        scripts: {
          files: 'public/dev/scripts/**/*.js',
          tasks: ['jshint', 'uglify'],
          options: {
            livereload: true
          },
        },
        css: {
          files: 'public/dev/content/stylesheets/**/*.scss',
          tasks: ['sass'],
          options: {
            livereload: true,
          }
        },
        html: {
            files: ['public/*.html'],
            tasks: ['jshint']
        }
      }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task(s).
    grunt.registerTask('production', 'Moving to production', function(){
      grunt.task.run('sass');
      grunt.task.run('jshint');
      grunt.config('uglify.product_target.options.beautify', false);
      grunt.task.run('uglify');
      grunt.task.run('watch');
    });
    //grunt.registerTask('default', ['sass', 'jshint', 'watch']); // Also known as debug
    grunt.registerTask('default', 'also known as debug', function(){
      grunt.task.run('sass');
      grunt.task.run('jshint');
      grunt.task.run('uglify');
      grunt.task.run('watch');
    });

};