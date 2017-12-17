let _ = require('lodash');
let webpack = require('webpack');
let path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

let babelOptions = {
    "presets": "node6"
};
let entries = {
    index: './src/index.ts'
};

module.exports = {
    entry: entries,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: nodeModules,
    module: {
        rules: [{
            test: /\.ts(x?)$/,
            exclude: ['/node_modules/', '/dist/'],
            use: [{
                loader: 'babel-loader',
                options: babelOptions
            }, {
                loader: 'ts-loader'
            }]
        }]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    target: 'node',
    plugins: []
}