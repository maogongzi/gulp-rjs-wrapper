# gulp-rjs-wrapper
Samelessly integrate `r.js` with gulp.

# how to use

```
...
var foo = require('gulp-foo'),
    rjsWrapper = require('gulp-rjs-wrapper'),
    bar = require('gulp-bar');

gulp.task('js-amd', function(){
    var jsBase = path.join(assetRoot, 'js'),
        jsSrc = [
            path.join(jsBase, './base.js'),
            path.join(jsBase, './sections/*.js'),
            path.join(jsBase, './pages/*.js')
        ],
        jsDst = path.join(buildRoot, 'js');

    gulp.src(jsSrc)
        .pipe(plumber())
        .pipe(rjsWrapper({
            baseUrl: jsBase,
            paths: {
                app: "empty:",
                jquery: "empty:",
                underscore: "empty:",
                backbone: "empty:",
                'handlebars.runtime': "empty:"
            },
            // name: path.basename(file.path, '.js'),
            // a wrapper on the original `name` property which will be called 
            // to resolve the module name inside the wrapper.
            name: function(file){
              // ASSET_ROOT/pages/home.js -> pages/home
              return file.path.replace(jsBase + '/', '')
                  .replace(path.extname(file.path), '');
            },
            // 'optimize: none' -> do not compress the built file.
            // 'optimize: uglify/uglify2' -> compress the built file using given tool.
            // to catch errors, use callbacks as below:
            // https://github.com/requirejs/r.js/issues/376
            //
            // you should always set this to none since you can use a dedicated
            // task(e.g. uglify) to optimize the generated js later.
            optimize: 'none'
        }))
        .pipe(gulp.dest(jsDst));
});
```

# FAQs

