/*global module:false*/
module.exports = function(grunt) {

  // Add mochaTest task
  grunt.loadNpmTasks('grunt-mocha-test');

  function getLintOptions() {
    return {
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
        es5: true
      },
      globals: {
      }
    };
  }
  
  function getNodeLintOptions() {
    var options = getLintOptions();
    options.options.node = true;
    return options;
  }
  
  function getBrowserLintOptions() {
    var options = getLintOptions();
    options.options.browser = true;
    return options;
  }

  // Project configuration.
  grunt.initConfig({
    lint: {
      node: ['grunt.js', 'src/Server/**/*.js', 'src/Runner/**/*.js', 'test/**/*.js'],
      browser: ['src/Listener/js/**/*.js']
    },
    jshint: {
      node: getNodeLintOptions(),
      browser: getBrowserLintOptions()
    },
    mochaTest: {
      files: ['test/**/*.test.js']
    },
    mochaTestConfig: {
      options: {
        globals: ['x'],
        reporter: 'nyan'        
      }
    },
    watch: {
      scripts: {
        files: ['<config.lint:files>'],
        tasks: 'default'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint mochaTest');
};
