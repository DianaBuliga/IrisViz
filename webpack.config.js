const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/app/index.tsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/app'),
		publicPath: '/', // Required for dev server
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
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/app/index.html',
		}),
	],
	devServer: {
		static: path.join(__dirname, 'dist/app'), // Serve from the output directory
		compress: true,
		port: 3000, // Change port if needed
		hot: true,
		historyApiFallback: true, // Ensures proper routing for SPAs
	},
};
