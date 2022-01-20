const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process"); // command 명령어 사용가능
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const apiMocker = require("connect-api-mocker");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/app.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  devServer: {
    overlay: true,
    stats: "errors-only",
    before: (app) => {
      // 미들웨어 추가
      app.use(apiMocker("/api", "mocks/api"));
    },
    // 핫 모듈 리플레이스먼트
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ], // 순서 중요함, 뒤에서 부터 실행
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          //publicPath: "./dist/", // live server 사용시 path를 못찾음 ./ => ../
          name: "[name].[ext]?[hash]", // hash 처리(캐시)
          limit: 20000, // 2kb 최대
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
      Build Date: ${new Date().toLocaleString()}
      Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")},
      Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    // 환경 변수 설정 (env)
    new webpack.DefinePlugin({
      TWO: JSON.stringify("1+1"),
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        // 디버깅쉽게 하기위해 production 환경에서만 설정
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, // 빈칸 제거
              removeComments: true, // 주석제거
            }
          : false,
    }),
    // dist Folder delete
    new CleanWebpackPlugin({}),
    // javascript css 뽑기(개발환경에는 필요가없음)
    // loader 설정이 추가로 필요함
    ...(process.env.NODE_ENV === "production"
      ? [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ]
      : []),
  ],
};
