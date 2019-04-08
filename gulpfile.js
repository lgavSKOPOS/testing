var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var watchify = require("watchify");
var fancy_log = require("fancy-log");

var path = {
    app: "src/app/",
    pages: ["src/**/*.html"],
    typeScripts: ["src/app/**/*.ts"],
};

var fs = require("fs");
var del = require("del");
// var polyfill = require("@babel/polyfill")

// import polyfill from "@babel/polyfill";
gulp.task("copy-html", function() {
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
    return del(`dist/**/*`, `!dist/TestAng/*`);
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
            babelrc: false,
            extensions: [".ts"],
            presets: [
                [
                    "@babel/preset-env", {
                    targets: {
                        browsers: [
                            "ios > 8",
                            "android > 4.2",
                            "and_chr > 38",
                            "and_ff > 56",
                            "and_qq > 1.1",
                            "and_uc > 9",
                            "ie_mob > 10",
                            "ie >= 7",
                        ],
                    },
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
}));


// Note: ---------------- Start Watch Browserify ----------------
var watchedBrowserify = watchify(browserify({
    basedir: ".",
    cache: {},
    debug: true,
    entries: ["src/main.ts"],
    packageCache: {},
}).plugin(tsify)
    .transform("babelify", {
        babelrc: false,
        extensions: [".ts"],
        presets: [
            [
                "@babel/preset-env", {
                targets: {
                    browsers: [
                        "ios > 8",
                        "android > 4.2",
                        "and_chr > 38",
                        "and_ff > 56",
                        "and_qq > 1.1",
                        "and_uc > 9",
                        "ie_mob > 10",
                        "ie >= 7",
                    ],
                },
                useBuiltIns: "entry",
            },
            ],
        ],
    }),
);

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist"));
}

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
// Note: ---------------- End Watch Browserify ----------------



// gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));

// var ts = require("gulp-typescript");
// var tsProject = ts.createProject("tsconfig.json");
// gulp.task("default", function () {
//     return tsProject.src()
//         .pipe(tsProject())
//         .js.pipe(gulp.dest("dist"));
// });
