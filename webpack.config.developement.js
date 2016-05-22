var config = require('./webpack.config.js');

var webpack = require('webpack');

var WebpackShellPlugin = require('webpack-shell-plugin');

config.plugins.push(
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("development")
    }
  })
);

config.plugins.push(
    new WebpackShellPlugin({
        dev: false, // set to false or it will only build once
        onBuildEnd:[
            'echo SENDING ANDROID BUILD COMMAND TO TMUX SESSION "android_dev"',
            'python ~/p/run-buddy/run_buddy.py android_dev ./dev-android.sh'
            //'./dev-android.sh',
        ]
    })
)
//config.devtool = 'eval-source-map'

module.exports = config;
