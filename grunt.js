/*global module:false*/
module.exports = function(grunt) {

  // Add our custom tasks.
  grunt.loadTasks('src/grunt');

  // Project configuration.
  grunt.initConfig({
    lint: {
      grunt: ['grunt.js', 'src/grunt/**/*.js'],
      gruntTest: ['test/grunt/**/*.js'],
      server: ['src/server/**/*.js'],
      serverTest: ['test/server/**/*.js'],
      client: ['src/client/**/*.js', 'test/client/**/*.js']
    },
    mocha: {
      grunt: ['test/grunt/**/*.test.js'],
      server: ['test/server/**/*.test.js']
    },
    jshint: {
      grunt: {
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
      gruntTest: {
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
      server: {
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
      serverTest: {
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
      client: {
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
          eqnull: true
        },
        globals: {
        }
      }
    },
    mochaConfig: {
      options: {
        reporter: 'nyan'        
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint mocha');
};
