import webpack from 'webpack';
import fs from 'fs';
import path from 'path';
var nodeExternals = require('webpack-node-externals');

export default {
    cache: true,
    entry: [
        'webpack/hot/poll?1000',
        './src/app.js'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    target: 'node',
    externals: [nodeExternals({
      whitelist: ['webpack/hot/poll?1000', 'parse']
    })],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [
                path.resolve(__dirname, "node_modules"),
            ],
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        //new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['*', '.js', '.json']
    }
}