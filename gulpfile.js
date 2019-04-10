var babelify = require("babelify");
var browserify = require("browserify");

var exec = require("child_process").exec;
var del = require("del");
var fs = require("fs");

var gulp = require("gulp");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var watch = require("gulp-watch");
var jshint = require("gulp-jshint");

var tsify = require("tsify");

var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");

var watchify = require("watchify");

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
        "src/**/*.ico",

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
    .transform(babelify.configure({
        babelrc: false,
        extensions: [".ts"],
        presets: [
            [
                "@babel/preset-env", {
                    corejs: "2.6.5",
                    useBuiltIns: "entry",
            },
            ],
        ],
    }))
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    // .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist"));
});

gulp.task("lite-server", function() {
    exec("npm run dev-dist", function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});

gulp.task("watch", () => {
     watch([
            "main.ts",
            "src/app/**/*.ts",
            "index.html",
            "src/app/**/*.html",
            "gulpfile.js",
         ],
        gulp.series(
            "clean:frontend",
            "copy",
            "browserify",
            "lite-server",
        ),
     );
});

gulp.task("default", gulp.series("clean:frontend", gulp.parallel("copy"), "browserify", "lite-server", "watch"));
