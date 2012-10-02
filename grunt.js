/*global module:false*/
module.exports = function(grunt) {

  // Add mochaTest task
  grunt.loadNpmTasks('grunt-mocha-test');

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },
    mochaTest: {
      files: ['test/**/*.test.js']
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
        describe: false,
        it: false
      }
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'        
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint mochaTest');
};
