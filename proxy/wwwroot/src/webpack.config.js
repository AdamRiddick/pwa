const path = require('path');
const webpackMerge = require('webpack-merge');

const webpackConfig = require('./build/webpack/webpack.js');
const modeConfig = env => require(`./build/webpack/webpack.${env.mode}.js`)(env);
const loadPresets = require('./build/webpack/loadPresets');

module.exports = ({ mode, presets }) => {
  return webpackMerge(
    webpackConfig({ mode, presets }),
    modeConfig({ mode, presets }),
    loadPresets({ mode, presets }),
    {
      output: {
        path: path.resolve(__dirname, '../dist'),
      },
    }
  );
};
