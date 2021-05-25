/**
 * ---------------------------------------------------------------------------------------
 * webpack.dev.js
 * ---------------------------------------------------------------------------------------
 */

const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common")

const host = '0.0.0.0'
const port = 8080
const distDir = path.resolve(__dirname, "build")

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        host: host,
        port: port,
        open: process.platform === "darwin" ? "Google Chrome" : "chrome.exe",
        contentBase: distDir,
        historyApiFallback: false,
        hot: true,
        inline: true,
        watchOptions: {
            poll: true
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            "WEBPACK_MODE": `"development"`
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
})

