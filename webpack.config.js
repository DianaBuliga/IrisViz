const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: 'production',
	entry: './src/app/index.tsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/app'),
		// when create a package, change to './'
		publicPath: './',
	},
	externals: {
		electron: "require('electron')",
	},
	module: {
		rules: [
			{
				test: /\.(js|ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
			},
		],
	},
	resolve: {
		fallback: {
			fs: false,
			path: require.resolve("path-browserify"),
		},
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/app/index.html',
		}),
		new CopyPlugin({
			patterns: [{from: "src/preload.js", to: "../electron/preload.js"}],
		}),
	],
	devServer: {
		static: path.join(__dirname, 'dist/app'),
		compress: true,
		port: 3000,
		hot: true,
		historyApiFallback: true,
	},
};
