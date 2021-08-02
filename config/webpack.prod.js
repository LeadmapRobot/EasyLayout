const { path } = require('./config.js');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; //打包后的canvas可视化分析插件

module.exports = {
    entry: {
        main: "./src/index.jsx"
    },
    output: {
        publicPath: "",
        filename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "../dist")
      },
    mode: "production",
    target: "web",
    devtool: false,

    resolve: {
        extensions: [".js", ".jsx", "json", ".css", ".less"],
        alias: {

            "@assets": path.resolve(__dirname,"../assets")
        },
        fallback: {
            "path": require.resolve("path-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                }]
            },
            {
                test: /\.less$/,
                oneOf: [
                    {
                        resourceQuery: /css_modules/,//判断css文件是否有后缀
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options:  {
                                    // publicPath: "/css/"
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    modules: true, //开启 css modules选项
                                    modules: {
                                        localIdentName: "[name]__[local]--[hash:base64:5]",//自定义modules名
                                    },
                                    importLoaders: 2 //处理@import引入的css代码
                                }
                            },
                            "less-loader", // 将 Less 编译为 css
                            "postcss-loader",
                        ]
                    },
                    {
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options:  {
                                    // publicPath: "/css/"
                                }
                            },
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders: 2 //处理@import引入的css代码
                                }
                            },
                            "less-loader", // 将 Less 编译为 css
                            "postcss-loader",
                        ]
                    }
                ]
            },

            {
                test:/\.(jpe?g|png|gif|svg)$/,
                loader: "image-webpack-loader",//图片优化
                // 保证优先级                
                enforce: "pre"
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "url-loader",//url-loader默认是优先将资源Base64引入
                    options: {
                        limit: 3 * 1024,
                        esModule: false,
                        name: "imgs/[name].[hash:6].[ext]"
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    esModule: false,
                    sources: {
                        list: [
                            // All default supported tags and attributes
                            '...',
                            {
                                tag: "img",
                                attribute: "src",
                                type: "src",
                            }
                        ],
                    },
                },
            },
        ],
    },

    //优化设置
    optimization: {
        minimizer: [
          new TerserPlugin({
            parallel: true,//开启多线程压缩
            // sourceMap: true, // 如果在生产环境中使用 source-maps，必须设置为 true
          }),
        ],
        // splitChunks: {
        //     chunks: "async",
        //     cacheGroups: {
                
        //         commons: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all',
        //         }
        //     }

        // },
        runtimeChunk: "single"//把runtimeChunk部分的代码单独打包

    },

    //添加plugin
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",

        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        // new HtmlWebpackPlugin(),
        new HtmlWebpackPlugin({  // Also generate a test.html
            filename: 'index.html',
            template: "./public/index.html"
        }),
        new BundleAnalyzerPlugin()
    ]
}