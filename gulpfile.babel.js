/**
 * ---------------------------------------------------------------------------------------
 * gulpfile.js
 * ---------------------------------------------------------------------------------------
 */


"use strict";

const
    gulp = require("gulp"),
    runSequence = require("run-sequence"),
    babelify = require("babelify"),
    browserSync = require("browser-sync"),
    concat = require("gulp-concat"),
    notify = require("gulp-notify"),
    rename = require("gulp-rename"),
    util = require("gulp-util"),
    uglify = require("gulp-uglify"),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require("gulp-sourcemaps"),
    sass = require("gulp-sass"),
    sassGlob = require('gulp-sass-glob'),    
    path = require("path"),
    nodemon = require("gulp-nodemon"),
    config = require("./config");

const browserSyncReloadDelay = {
    windows: 1500,
    osx: 100
};


gulp.task("build_libs", () => {
    return gulp.src(config.libs.all)
        .pipe(concat("libs.bundle.min.js"))
        .pipe(gulp.dest(config.build.libs))
});


gulp.task("build_js", () => {
    let mode = process.env.NODE_ENV === config.mode.dev;
    console.log(util.colors.red('\nMODE = ' + process.env.NODE_ENV));
    console.log(util.colors.red('PLATFORM = ' + config.platform + '\n'));

    return browserify({
        entries: config.js.index,
        cache: {},
        dev: true
    })
        .transform(babelify, {presets: ["env"], plugins: ["syntax-async-functions", "transform-async-to-generator"], sourceMaps: mode})
        .bundle()
        .pipe(source("app.bundle.min.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: mode}))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(config.build.js))
});


gulp.task("build_sass", () => {

    // let output_style = process.env.NODE_ENV == 'dev' ? 'expanded' : 'compressed';

    return gulp.src(config.styles.sass)
        .pipe(sassGlob({
            ignorePaths: [
                "**/drum-machine/**/*.scss"
            ]
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            // includePaths: ['node_modules/susy/sass'],       //include susy-framework from node_modules
        }).on('error', sass.logError))
        .pipe(rename('styles.css'))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(config.build.styles))
        .pipe(browserSync.stream())
});


gulp.task("node_server", (cb) => {
    return nodemon({
        script: "server.js"
        , ext: "js html"
        , env: { "NODE_ENV": "development" }
    }).once("start", () => {
        cb();
    })
});


gulp.task("browserSync_init", cb => {
    browserSync.init({
        browser: config.platform === "darwin" ? "google chrome" : "chrome.exe",
        notify: true,
        port: 3000,
        server: {
            baseDir: config.project.root,
            index: config.project.index,
            middleware: function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        // proxy: `http://localhost:${config.port}/`,
        reloadDelay: config.platform === "darwin" ? browserSyncReloadDelay.osx : browserSyncReloadDelay.windows,
        injectChanges: true
    }, cb);
});


gulp.task("browserSync_reload", (done) => {
    browserSync.reload({stream: false});
    done();
});


gulp.task("watch", () => {
    gulp.watch([config.js.all, config.assets.root]).on("change", () => {runSequence("build_js", "browserSync_reload")});
    gulp.watch(config.styles.all).on("change", () => {runSequence("build_sass")});
    gulp.watch(config.html.all).on("change", () => {runSequence("browserSync_reload")});
});


gulp.task("development_mode", done => {
    process.env.NODE_ENV = config.mode.dev;
    console.log(util.colors.blue('NODE_ENV = ' + process.env.NODE_ENV ));
    done();
});


gulp.task("production_mode", done => {
    process.env.NODE_ENV = config.mode.dev;
    console.log(util.colors.blue('NODE_ENV = ' + process.env.NODE_ENV ));
    done();
});



gulp.task("build_dev", cb => {
    runSequence("development_mode", ["build_libs", "build_js", "build_sass"], "browserSync_init", "watch", cb);
});

gulp.task("build_prod", cb => {
    runSequence("production_mode", ["build_libs", "build_js", "build_sass"], "browserSync_init", "watch", cb);
});

