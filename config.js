/*
 * ---------------------------------------------------------------------------------------
 * config.js
 * ---------------------------------------------------------------------------------------
 */

const path = require("path");

module.exports = {

    platform: process.platform,
    port: process.env.PORT || 4500,

    mode: {
        dev: "development",
        prod: "production"
    },

    project: {
        root: "./public/",
        index: "index.html"
    },

    html: {
        root: "./public/index.html",
        all: "./public/**/*.html"
    },

    libs: {
        root: "./public/libs",
        all: [
            "./node_modules/babel-polyfill/dist/polyfill.min.js",
            "./public/libs/*.js",
            "./node_modules/three/build/three.min.js",
            "./node_modules/three/examples/js/controls/FirstPersonControls.js",
            "./node_modules/three/examples/js/controls/OrbitControls.js"

        ]
    },

    js: {
        root: "./public/app",
        all: "./public/app/**/*.js",
        index: "./public/app/app.js",
        build: "./public/build/"
    },

    styles: {
        root: "./public/app/styles",
        sass: "./public/app/styles/**/*.scss",
        all: [
            "./public/app/styles/**/*.scss",
            "./public/app/components/**/*.scss"
        ]
    },

    build: {
        root: "./public/build/",
        libs: "./public/build/libs/",
        js: "./public/build/js/",
        styles: "./public/build/styles/",
        libs_all: "./public/build/libs/**/*.js",
        js_all: "./public/build/js/**/*.js",
        styles_all: "./public/build/styles/**/*.css",
    },


    assets: {
        root: path.join(__dirname, "public/app/assets/"),
    }

};
