const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const assets = [
  {
    from: 'src/img',
    to: 'img/'
  }
];

module.exports = (env) => {
   return ({
      entry: './src/index.ts',
      output: {
        filename: 'bundle.js',
        path: env.outputFolder,
      },
      module: {
        rules: [
          {
            exclude: /node_modules|modules/,
            test: /\.tsx?$/,
          },
        ]
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
      },
      plugins: [
        new CleanWebpackPlugin([env.outputFolder]),
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/index.html',
          minify: {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
          }
        }),
        new CopyWebpackPlugin([...assets], {
          ignore: ['.DS_Store']
        })
      ],
      watchOptions: {
        ignored: /node_modules/
    },
  });
};
