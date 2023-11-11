const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./public/index.html"
  })],
  module: {
    rules: [
      {
        test: /[\.js]$/,
        exclude: /node_module/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_module/,
        use: {
          loader: "ts-loader"
        },
      },
    ],
  },
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
    extensions:[".js",".css", ".ts"]
	},
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    port: 3000
  },
  devtool: 'eval'
}
