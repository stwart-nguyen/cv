module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['style/*.css'],
        dest: 'index.css',
      },
    },
    uncss: {
      options: {
        ignoreSheets: [/font-awesome/]
      },
      dist: {
        files: {
          'index.css': 'converted_index.html'
        }
      }
    },
    cssmin: {
      options: {
        report: 'min'
      },
      target: {
        files: {
          'index.min.css': ['index.css']
        }
      }
    },
    processhtml: {
      options: {
        customBlockTypes: ['amp-css.js']
      },
      dist: {
        files: {
          'index.html': ['converted_index.html']
        }
      },
      pdf: {
        files: {
          'pdf_index.html': ['converted_index.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('convertslim', 'Convert slim to html', function () {
    let options = {
      cmd: 'slimrb',
      args: [
        'index.html.slim',
        'converted_index.html',
        '--pretty'
      ]
    };

    grunt.util.spawn(options, function (error, result, code) {
      if (code !== 0) { grunt.warn(error, code); }
    });
  });

  grunt.registerTask('generatepdf', 'Generate PDF', function () {
    let htmlPath = 'file://' + __dirname + '/pdf_index.html';
    let options = {
      cmd: 'chromehtml2pdf',
      args: [
        '--out=./resource/Stewart_Nguyen.pdf',
        '--format=A4',
        '--printBackground=true',
        htmlPath
      ]
    };

    grunt.util.spawn(options, function (error, result, code) {
      console.log(result);
      if (code !== 0) { grunt.warn(error, code); }
    });
  });

  grunt.registerTask('compilecss', ['concat', 'uncss', 'cssmin']);
  grunt.registerTask('compilehtml', ['convertslim', 'processhtml']);
  grunt.registerTask('deploy', ['compilecss', 'compilehtml', 'generatepdf'])
}
