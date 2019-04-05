var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var path = {
    app: "src/app/",
    pages: ["src/**/*.html"],
    typeScripts: ["src/app/**/*.ts"],
};

var fs = require("fs");
var del = require("del");

gulp.task("copy-html", function () {
    return gulp.src(path.pages)
        .pipe(gulp.dest("dist"));
});

/* var typeScripts = gulp.src("./src/app/**.ts", "src/main.ts");

var scripts = [];
fs.readdir(path.app, function(err, list) {
    list.forEach(function(value) {
        scripts.concat(value);
        console.log(value);
    });
});
    console.log("Test: " + scripts + "\n");
*/

gulp.task("clean:frontend", function() {
    return del(`dist/**/*`, `!dist/TestAng`);
});

gulp.task("default", gulp.series("clean:frontend", gulp.parallel("copy-html"), function() {

    return browserify({
        basedir: ".",
        cache: {},
        debug: true,
        entries: ["src/main.ts"],
        packageCache: {},
    })
    .plugin(tsify)
        .transform("babelify", {
            extensions: [".ts"],
            presets: ["@babel/preset-env"],
        })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist"));
}));

// var ts = require("gulp-typescript");
// var tsProject = ts.createProject("tsconfig.json");
// gulp.task("default", function () {
//     return tsProject.src()
//         .pipe(tsProject())
//         .js.pipe(gulp.dest("dist"));
// });
