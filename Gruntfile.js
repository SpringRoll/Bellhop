module.exports = function(grunt)
{
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      bellhop: ['src/*']
    },
    concat: {
      options: {
        banner: '/* <%= pkg.name %> <%= pkg.version %> */\n'
      },
      bellhop: {
        src: ['src/BellhopEventDispatcher.js', 'src/Bellhop.js'],
        dest: 'dist/bellhop.js'
      }
    },
    uglify: {
      bellhop: {
        files: {
          'dist/bellhop.min.js' : ['dist/bellhop.js']
        }
      }
    },
    qunit: {
      bellhop: ['test/index.html']
    }
  });

  grunt.registerTask('default', ['eslint', 'qunit', 'concat', 'uglify']);
};
