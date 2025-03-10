'use strict';
const webpack = require("webpack");
// pull in the 'path' module from node
const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/app/index.tsx',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist/app'),
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
		},
			{
				test: /\.scss$/,
				use: [
					"style-loader",
					"css-loader",
					"postcss-loader",
					"sass-loader"
				]
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // HMR support
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
};