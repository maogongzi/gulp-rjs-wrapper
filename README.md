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
                'backbone-associations': "empty:",
                'handlebars.runtime': "empty:"
            },
            // name: path.basename(file.path, '.js'),
            // a wrapper for the original `name` attribute which will be called 
            // to resolve the module name inside the wrapper .
            name: function(file){
                return file.path.replace(jsBase + '/', '')
                    .replace(path.extname(file.path), '');
            },

            // exclude: path.basename(file.path, '.js'),
            // a wrapper for the original `exclude` attribute which will be called 
            // to resolve the dependents to be excluded for this module.
            // if it's a function, it should return an array including the
            // module IDs to be excluded.
            exclude: function (file) {
                var curModuleId = file.path.replace(jsBase + '/', '')
                    .replace(path.extname(file.path), '');

                // the 'base' module.
                // this module served as a container to hold all basic modules
                // to be used across the whole APP, therefore it should not
                // 'exclude' itself.
                return curModuleId === 'base' ? [] : ['base'];
            },

            // 'optimize: none' -> do not compress the built file.
            // 'optimize: uglify/uglify2' -> compress the built file using given tool.
            // to catch errors, use callbacks as below:
            // https://github.com/requirejs/r.js/issues/376
            //
            // you should always set this to none since you can use a dedicated
            // task to optimize the generated js later.
            optimize: 'none'
        }));
        .pipe(gulp.dest(jsDst));
});
```

# FAQs

