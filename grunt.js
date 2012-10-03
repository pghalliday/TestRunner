/*global module:false*/
module.exports = function(grunt) {

  // Add mochaTest task
  grunt.loadNpmTasks('grunt-mocha-test');

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
      }
    },
    mochaTest: {
      files: ['test/**/*.test.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'        
      }
    },
    watch: {
      scripts: {
        files: ['grunt.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: 'default'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint mochaTest');
};
