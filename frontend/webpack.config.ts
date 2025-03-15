import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
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
