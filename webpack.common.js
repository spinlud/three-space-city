/**
 * ---------------------------------------------------------------------------------------
 * webpack.common.js
 * ---------------------------------------------------------------------------------------
 */

const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const distDir = path.resolve(__dirname, "build")

const files = [
    "@babel/polyfill",
    "./node_modules/three/examples/js/controls/FirstPersonControls.js",
    "./node_modules/three/examples/js/controls/OrbitControls.js",
    "./public/app/app.js"
]

module.exports = {

    entry: {
        bundle: files
    },

    output: {
        path: distDir,
        filename: "[name].[hash].js"
    },

    // resolve: {
    //
    //     alias: {
    //         "vue-runtime-alias": path.resolve(__dirname, "node_modules/vue/dist/vue.runtime.esm.js"),
    //         "vue-router-alias": path.resolve(__dirname, "node_modules/vue-router/dist/vue-router.esm.js"),
    //         "vuex-alias": path.resolve(__dirname, "node_modules/vuex/dist/vuex.esm.js"),
    //
    //         // Leaved name as three because some packages (e.g. postprocessing) requires a 'three' dependency
    //         "three": path.resolve(__dirname, "src/libs/three_0.104.0/build/three.module.js"),
    //
    //         "postprocessing-alias": path.resolve(__dirname, "src/libs/postprocessing_6.3.2/build/postprocessing.esm.js"),
    //         "three-pathfinding-alias": path.resolve(__dirname, "src/libs/three-pathfinding_0.10.0/dist/three-pathfinding.module.js"),
    //         "three-nebula-alias": path.resolve(__dirname, "src/libs/three-nebula_4.0.3/src/index.js"),
    //     }
    //
    // },

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "modules": false,
                                }
                            ]
                        ]
                    }
                }
            },

            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },

            {
                test: /\.scss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },

            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    "file-loader",
                    {
                        loader: "image-webpack-loader",
                        options: {
                            disable: true, // webpack@2.x and newer
                        },
                    },
                ]
            },

            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets/fonts"
                    }
                }]
            }


        ]
    },

    plugins: [

        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [ distDir ]
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            THREE: "three"
        }),

        new HtmlWebpackPlugin({
            template: "public/index.html",
            filename: "index.html",
            inject: true
        }),

        new CopyWebpackPlugin({
            patterns: [
                { from: "public/app/assets", to: "app/assets" },
            ]
        }),
    ]

}
