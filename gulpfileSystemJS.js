var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var watchify = require("watchify");
var jshint = require("gulp-jshint");

var systemjsBuilder = require("gulp-systemjs-builder");
var tsc = require("gulp-typescript");
var tscConfig = require("./tsconfig.json");

//NOTE: For Vendoring
var concat = require("gulp-concat");

var fs = require("fs");
var del = require("del");

var path = {
    app: "src/app/",
    css: ["src/**/*.css"],
    pages: ["src/**/*.html"],
    typeScripts: ["src/app/**/*.ts"],
};

gulp.task("copy", function() {
    return gulp.src([
        "src/**/*.html",
        "src/**/*.css",
        "systemjs.config.js",
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

gulp.task("compile"/*, gulp.series("lint")*/, function() {
    return gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc(tscConfig.compilerOptions))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/js"));
});


gulp.task("bundle:app", function() {
    var builder = systemjsBuilder();
    builder.loadConfigSync("systemjs.config.js");

    builder.buildStatic("dist/js/main.js", "app.min.js", {})
        .pipe(gulp.dest("dist/js"));
});

//NOTE: Start Vendoring

var vendorJS = [
    "node_modules/core-js/client/shim.min.js",
    "node_modules/zone.js/dist/zone.js",
    "node_modules/systemjs/dist/system.src.js",
    "node_modules/jquery/dist/jquery.js",
];

gulp.task("vendor-js", function() {
    return gulp.src(vendorJS, { allowEmpty: true })
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest("dist/js"));
});

//NOTE: End Vendoring
gulp.task("build", gulp.series("clean:frontend", "compile", "vendor-js", gulp.parallel("copy"), "bundle:app"));
// gulp.task("run", gulp.series("build", "webserver"));
gulp.task("default", gulp.series("build"));
