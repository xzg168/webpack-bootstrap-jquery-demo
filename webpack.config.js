const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const CssUrlRelativePlugin = require("css-url-relative-plugin");
const glob = require("glob");

const IS_DEV = process.env.NODE_ENV === "dev";

const config = {
  mode: IS_DEV ? "development" : "production",
  devtool: IS_DEV ? "eval" : "source-map",
  entry: {
    index: path.resolve(__dirname, "./src/js/index.js"),
    //routecss: path.resolve(__dirname, './src/css/route.css'),
    route: path.resolve(__dirname, "./src/js/route.js")
  },
  output: {
    filename: "js/[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
    chunkFilename: IS_DEV ? "js/[name].js" : "js/[name]-[chunkhash:8].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss|\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: IS_DEV
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[name].[ext]",
              fallback: "file-loader",
              outputPath: "public/images"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              pngquant: {
                quality: "65-90",
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10,
          enforce: true
        }
      }
    },
    minimizer: []
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "windows.jQuery": "jquery"
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/public",
        to: "public"
      }
    ]),
    new MiniCssExtractPlugin({
      filename: IS_DEV ? "css/[name].css" : "css/[name].[contenthash].css",
      chunkFilename: "css/[id].css"
    }),
    new webpack.HashedModuleIdsPlugin(),
    new PreloadWebpackPlugin({
      include: "initial"
    }),
    new CssUrlRelativePlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "src")
  }
};

if (!IS_DEV) {
  const TerserPlugin = require("terser-webpack-plugin");
  const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

  config.optimization.minimizer.push(
    new TerserPlugin(),
    new OptimizeCSSAssetsPlugin({})
  );
}

const files = glob.sync("./src/*.html");

files.forEach(file => {
  config.plugins.push(
    new HtmlWebPackPlugin({
      filename: path.basename(file),
      template: file,
      favicon: path.resolve(__dirname, "./src/public/icon.ico"),
      minify: !IS_DEV,
      chunks: ["index"]
    })
  );
});
const routeFiles = glob.sync("./src/routes/*.html");
routeFiles.forEach(file => {
  console.log("routeFiles", routeFiles);
  config.plugins.push(
    new HtmlWebPackPlugin({
      filename: "./routes/" + path.basename(file),
      template: file,
      favicon: path.resolve(__dirname, "./src/public/icon.ico"),
      minify: !IS_DEV,
      chunks: ["route"]
      // inject: 'body',
      // hash: true,
    })
  );
});
module.exports = config;
