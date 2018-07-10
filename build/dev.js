/**
 * Created by peiyuanwu_sagreen on 2017/3/2.
 */
var colors = require('colors');
var path = require("path");
var webpack = require('webpack');
var webpackConfig=require('./dev.config.js');
var WebpackDevServer = require('webpack-dev-server');

webpackConfig.entry['webpackDevServer']=("webpack-dev-server/client?http://localhost:8082/");

console.log('Start Dev...'.green);
var compiler =webpack(webpackConfig);
var server = new WebpackDevServer(compiler, {
    contentBase:'./dist/',
    publicPath:'/',
    //headers: { "X-Custom-Header": "yes" },
    //watchOptions: {
    //    aggregateTimeout: 300,
    //    poll: 1000
    //},
    //quiet: false,
    //noInfo: false,
    historyApiFallback:true,
    inline:true,
    //hot: true,
    progress: true,
    stats: {
            colors: true,
            chunks: false
    }
});
server.listen(8082, "localhost", function() {});
console.log('open localhost:8082');
