/**
 * ---------------------------------------------------------------------------------------
 * webpack.prod.js
 * ---------------------------------------------------------------------------------------
 */

const webpack = require("webpack")
const { merge } = require("webpack-merge")
const TerserPlugin = require("terser-webpack-plugin")
const common = require("./webpack.common")

module.exports = merge(common, {
    mode: "production",
    plugins: [
        new webpack.DefinePlugin({
            "WEBPACK_MODE": `"production"`
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                    },
                    safari10: true
                },
            })
        ],
    }
})

