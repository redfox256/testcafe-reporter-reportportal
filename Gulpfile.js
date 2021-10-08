var gulp    = require('gulp');
var babel   = require('gulp-babel');
var mocha   = require('gulp-mocha');
var del     = require('del');

function clean() {
    return del('lib');
}

function test() {
    return gulp
        .src('test/**.js')
        .pipe(mocha({
            ui:       'bdd',
            reporter: 'spec',
            timeout:  typeof v8debug === 'undefined' ? 2000 : Infinity // NOTE: disable timeouts in debug
        }));
}

function build() {
    return gulp
        .src('src/**/*.js')
        .pipe(babel( { optional: ['runtime'] } ))
        .pipe(gulp.dest('lib'));
}

exports.build = gulp.series(clean, build);
exports.test = gulp.series(build, test);
