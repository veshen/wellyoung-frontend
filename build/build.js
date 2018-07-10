/**
 * Created by peiyuanwu_sagreen on 2017/3/2.
 */
var colors = require('colors');
var webpack = require('webpack');
var webpack_config=require('./build.config.js');

console.log('Start Building...'.green);
webpack(webpack_config, function (err, stats) {
    if (err) throw err;
    process.stdout.write(stats.toString({
            colors: true,
            chunks: false,
        }) + '\n')

    console.log('Complete Build'.green);

})
