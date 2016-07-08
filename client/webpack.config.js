module.exports = {
	
	entry : './src/main.js',

	output: {
		path: __dirname,
		filename: './dist/app.js'
	},

	module: {

		loaders: [
			{
				test:/\.vue$/,
				loader:'vue'
			},{
				test: /\.js$/,
				loader: 'babel',
		        exclude: /node_modules/,
		        query: {
		        	presets: ['es2015']
		        }
		    },{
		        // edit this for additional asset file types
		        test: /\.(png|jpg|gif)$/,
		        loader: 'url',
		        query: {
		        	limit: 10000,
		          	// inline files smaller then 10kb as base64 dataURL
		          	name: '[name].[ext]?[hash]'
		          	// fallback to file-loader with this naming scheme
		        }
		      }
		]

	}
}