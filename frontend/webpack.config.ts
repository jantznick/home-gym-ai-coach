import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(path.resolve(), "dist"),
    filename: "bundle.js",
    clean: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
		test: /\.(sass|less|css)$/,
		use: ["style-loader", "css-loader", 'sass-loader'],
      },
	  {
		test: /\.(?:ts|tsx)$/,
		use: {loader: 'babel-loader'},
		exclude: /node_modules/
	  }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html"
    })
  ],
  devServer: {
    static: "./public",
    hot: true
  }
};