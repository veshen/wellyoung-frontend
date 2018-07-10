/**
 * Created by peiyuanwu on 16/12/4.
 */
var webpack = require('webpack');
var path = require("path");
var glob = require('glob');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
//var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
// var babelpolyfill = require("babel-polyfill")
// 多入口文件
function getEntrys() {

    var entrys = {};
    var _path=__dirname.replace('/build','');
    var src = new RegExp(_path.replace(/\\/g, "/") + "/source/js/app");
    glob.sync(_path + '/source/js/app/*.js').forEach(function(name) {

        // 前缀
        var entry = name.replace(src, "");

        // 后缀
        entry = entry.replace(/\.js$/, "");
        entrys[entry] = name;

    });


    entrys['commons'] =['react','react-dom','weixin-js-sdk'];
    return entrys;
}


module.exports={
    //devtool: 'inline-source-map',
    devtool: false,
    entry:getEntrys(),
    output:{
        path: '/dist',
        publicPath: '../',
        filename: 'static/js/[name].js'
    },
    //插件项
    plugins: [
        //new webpack.ProvidePlugin({
        //    $: "jquery",
        //    jQuery: "jquery",
        //    "window.jQuery": "jquery"
        //}),
        new webpack.optimize.CommonsChunkPlugin('commons',"static/js/commons/commons.js"),
        new webpack.HotModuleReplacementPlugin(),
        //new ExtractTextPlugin("css/[name].css"),
        /*
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
        })
        */
    ],
    module:{
        loaders:[
            //.css 文件使用 style-loader 和 css-loader 来处理
            {
                test: /\.css|scss$/,
                loader: 'style-loader!css-loader!sass-loader!postcss-loader'
            },
            //.js 文件使用 babel-loader 来编译处理
            //{
            //    test: path.join(__dirname,"./source/js/lib/jquery-2.1.4.min.js"),
            //    loader: 'expose?jQuery,$'
            //},
            {
                test: /\.js|jsx$/,
                loader:'babel',
                query: {
                    presets: ['react','es2015','stage-2'],
                    plugins:[[
                        "transform-runtime",
                        {
                          "helpers": false,
                          "polyfill": false,
                          "regenerator": true,
                          "moduleName": "babel-runtime"
                        }
                      ],['import', { libraryName: 'antd-mobile', style: 'css' }]]
                }
            },
            //图片文件使用 url-loader 来处理，小于16kb的直接转为base64
            { test: /\.(gif|png|jpg)$/, loader: 'url-loader?limit=16384&name=static/'+'/img/'+'[name].[ext]'},
            { test: /\.(woff|svg|eot|ttf)$/, loader: 'url-loader?limit=1638400&name=static/'+'/font/'+'[name].[ext]'}
        ]
    },
    postcss: [autoprefixer()],
    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['', '.web.js', '.js', '.json'],
    },
    watch: true
};
