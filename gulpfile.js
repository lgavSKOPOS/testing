var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var watchify = require("watchify");
// var fancy_log = require("fancy-log");

var babelify = require("babelify");
// var connect = require('gulp-connect');
// var globby = require('globby');
// var gutil = require('gulp-util');
var jshint = require("gulp-jshint");

var path = {
    app: "src/app/",
    css: ["src/**/*.css"],
    pages: ["src/**/*.html"],
    typeScripts: ["src/app/**/*.ts"],
};
var fs = require("fs");
var del = require("del");

gulp.task("copy-html", function() {
    return gulp.src([
        "src/**/*.html",
        "src/**/*.css",
    ])
    .pipe(gulp.dest("dist"));
});

gulp.task("clean:frontend", function() {
    return del(`dist/**/*`, `!dist/TestAng/*`);
});

gulp.task("lint", function() {
    return gulp.src("src/app/**/*.ts")
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("browserify", () => {
    return browserify({
        basedir: ".",
        cache: {},
        debug: true,
        entries: ["src/main.ts"],
        packageCache: {},
    })
        .plugin(tsify)
        .transform("babelify", {
            babelrc: false,
            extensions: [".ts"],
            presets: [
                [
                    "@babel/preset-env", {
                    useBuiltIns: "entry",
                },
                ],
            ],
        })
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
})

gulp.task("default", gulp.series("clean:frontend", gulp.parallel("copy-html"), "browserify"));
