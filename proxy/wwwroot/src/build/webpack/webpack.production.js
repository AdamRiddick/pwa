const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
        ]
      },
      {
        test: /\.ts$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    configFile: 'tsconfig.production.json'
                }
            }
        ],
        exclude: /node_modules/
    }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
});
