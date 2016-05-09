var rjs = require('requirejs'),
    through = require('through2'),
    gutil = require('gulp-util');

function rjsWrapper (options) {
  var _nameFn = null;

  // a function was given to resolve the module name, cache it
  if (typeof options.name === 'function') {
    _nameFn = options.name;
  }

  // creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    var _this = this,
        resultText = null;

    if (file.isNull()) {
      this.emit('error', new gutil.PluginError('empty file not supported!'));
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('streaming not supported!'));
      return cb();
    }

    // a function was given to resolve the module name, use it then.
    // it accepts the current file in the stream queue as it's argument.
    if (_nameFn) {
      options.name = _nameFn(file);
    }

    // now we catch the output text, later we'll use it to form a new vinyl
    // file and push it into the stream.
    options.out = function (text) {
      resultText = text;
    };

    // TODO no ideas what's happening here :(, the first file in the queue
    // always lacks of the trailing slash while all other files don't.
    options.baseUrl = options.baseUrl.substr(-1) === '/' ? options.baseUrl :
      options.baseUrl + "/";

    rjs.optimize(options, function(optimizedFileList){
      /* finished successfully */
      var optFile = new gutil.File({
        cwd: "",
        base: "",
        path: file.path.replace(options.baseUrl, ''),
        contents: new Buffer(resultText)
      });

      _this.push(optFile);

      cb();
    }, function(err){
      _this.emit('error', new gutil.PluginError(err));

      cb();
    });
  });
}

module.exports = rjsWrapper;
