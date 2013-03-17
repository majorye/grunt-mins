/*
 * grunt-mins
 * https://github.com/majorye/grunt-mins
 *
 * Copyright (c) 2013 zhouquan.yezq
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var path = require('path'),
  fs = require('fs');
  var contrib = require('grunt-lib-contrib').init(grunt);
  var uglify = require('./lib/uglify').init(grunt);
  grunt.log.writeln('Author: 内外前端团队 Alibaba-inc');
  grunt.file.defaultEncoding = 'utf8';
  grunt.registerMultiTask('mins', 'Minify files with UglifyJS.', function() {
  grunt.log.writeln('+++++++++++++++++start mins file for every module +++++++++++++++ "');

  var me=this;
  var _process=function(_name,_path){
        if(fs.statSync(_path+'/'+_name).isDirectory() && _name!==".svn"){
          var dirList = fs.readdirSync(path.normalize(_path+'/'+_name));
          var _path=_path+'/'+_name;
          dirList.forEach(function(item){
                _process(item,_path);
          });
        }else if(fs.statSync(_path+"/"+_name).isFile()){
           if(/^\w+.js$/.test(_name)){
                var files = grunt.file.expand(_path + '/'+_name);
                grunt.log.writeln("mins file name:"+_path + '/' +_name.split(".js")[0]+"-min.js")
                //grunt.file.write(_path + '/' + _name.split(".js")[0]+"-min.js", min);
                var result;
                var options ={
                  banner: '',
                  compress: {
                    warnings: false
                  },
                  mangle: {},
                  beautify: false
                };
                try {
                    result = uglify.minify([_path + '/' + _name],_path + '/' + _name.split(".js")[0]+"-min.js",options);
                  } catch (e) {
                    var err = new Error('Uglification failed.');
                    if (e.msg) {
                    err.message += ', ' + e.msg + '.';
                  }
                  err.origError = e;
                  grunt.fail.warn(err);
                }
                //var result = grunt.task.run('min', [_path + '/' + _name]);
                grunt.file.write(_path + '/' + _name.split(".js")[0]+"-min.js", result.min);
            }
        }
    };

    for(var i=0; i<this.data.src.length;i++){
      grunt.log.writeln("Minify the "+this.data.src[i]+" folder :");
      grunt.log.writeln("------------------------------");
      _process(this.data.src[i],'.');
    }
    grunt.log.writeln('+++++++++++++++++End mins file for every module+++++++++++++++ "');

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }

  });

};
