const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => ({
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader',
        ],
      },
      {
        test: /\.ts$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    configFile: 'tsconfig.development.json'
                }
            }
        ],
        exclude: /node_modules/
    }
    ]
  },
  plugins: [
    // Copy empty ServiceWorker so install doesn't blow up
    new CopyWebpackPlugin(['src/sw.js'])
  ],
  devtool: 'inline-source-map'
});
