const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

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
            exclude: /node_modules/,
            test: /\.tsx?$/,
          },
        ]
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
      },
      plugins: [
        new CleanWebpackPlugin(),
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
        new CspHtmlWebpackPlugin({
          'default-src': "'self'",
          'base-uri': "'self'",
          'object-src': "'none'",
          'script-src': ["'self'"],
          'style-src': ["'self'"]
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
