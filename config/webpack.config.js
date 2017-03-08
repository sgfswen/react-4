const {
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
  LoaderOptionsPlugin,
  EnvironmentPlugin,
  ProvidePlugin,
  DefinePlugin,
  optimize
} = require('webpack');

const {
  AggressiveMergingPlugin,
  CommonsChunkPlugin,
  UglifyJsPlugin,
} = optimize;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const babel = {
  presets: [
    [ 'es2015', { modules: false } ],
    'stage-0',
    'react',
  ],
  plugins: [
    'react-html-attrs',
    'add-module-exports',
    'syntax-dynamic-import',
    'transform-class-properties',
    'transform-decorators-legacy',
  ],
};

const { resolve } = require('path');
const pathTo = rel => resolve(process.cwd(), rel);

const isProd = env => env !== 'development';
const publicPath = env => env === 'ghpages' ? '/react/' : '/';
const jsonEnv = env => JSON.stringify(isProd(env) ? 'production' : 'development');
const minimize = env => isProd(env) ? '&minimize' : '';

const use = env => [
  `css-loader?{"module":true,"importLoaders":1,"minimize":${isProd(env)}`,
  `postcss-loader${isProd(env) ? '' : '?{"sourceMap":"inline"}'}`,
];
const loaders = env => [
  'exports-loader?module.exports.toString()',
  ...use(env),
];
const include = pathTo('./src');
const styleIncludes = [
  include,
  pathTo('./node_modules/normalize.css/'),
  pathTo('./node_modules/bootstrap/dist/'),
  pathTo('./node_modules/bootswatch/'),
];
const includesLoader = (env, id) => ExtractTextWebpackPlugin.extract({
  use: id === 'css' ? use(env) : [
    ...use(env),
    `${id}-loader`,
  ],
  fallback: 'style-loader',
  publicPath: publicPath(env),
});

const exclude = /\/node_modules\//i;
const fonts = /\.(otf|eot|woff2?|ttf)$/i;
const images = /\.(raw|gif|png|jpe?g|svg|ico)$/i;

const precss = require('precss');
const rucksackCss = require('rucksack-css');

const { version } = require('../package.json');
const filename = ext => `[name].${ext}?v=${version}`;

const proxy = () => ({
  target: 'http://localhost:8080',
  changeOrign: false,
  secure: false,
});

module.exports = env => ({

  entry: {
    polyfills: './src/polyfills.js',
    vendors: './src/vendors.js',
    app: './src/main.js',
  },

  output: {
    path: pathTo('./dist'),
    filename: filename('js'),
    publicPath: publicPath(env),
    chunkFilename: `[id].chunk.js?v=${version}`,
    jsonpFunction: 'w',
  },

  module: {
    rules: [
      // html
      {
        test: /\.hbs$/,
        include,
        loader: 'handlebars-loader'
      },
      {
        test: /\.html/,
        include,
        loader: 'html-loader'
      },
      // scripts
      {
        test: /\.js$/i,
        include,
        loader: 'babel-loader',
        options: babel,
      },
      // styles (vendors)
      {
        test: /\.css$/i,
        exclude: styleIncludes,
        loaders: loaders(env),
      },
      {
        test: /\.less/i,
        exclude: styleIncludes,
        loaders: [
          ...loaders(env),
          'less-loader',
        ],
      },
      {
        test: /\.(scss|sass)$/i,
        exclude: styleIncludes,
        loaders: [
          ...loaders(env),
          'sass-loader',
        ],
      },
      {
        test: /\.styl$/i,
        exclude: styleIncludes,
        loaders: [
          ...loaders(env),
          'stylus-loader',
        ],
      },
      // styles
      {
        test: /\.css$/i,
        include: styleIncludes,
        use: includesLoader(env, 'css'),
      },
      {
        test: /\.less$/i,
        include: styleIncludes,
        use: includesLoader(env, 'less'),
      },
      {
        test: /\.(sass|scss)$/i,
        include: styleIncludes,
        use: includesLoader(env, 'sass'),
      },
      {
        test: /\.styl/i,
        include: styleIncludes,
        use: includesLoader(env, 'stylus'),
      },
      // fonts (vendors)
      {
        test: fonts,
        include: exclude,
        use: `file-loader?name=vendors/[1]?v=${version}&regExp=node_modules/(.*)`,
      },
      // fonts
      {
        test: fonts,
        exclude,
        use: `file-loader?hash=sha512&digest=hex&name=[path]/[name].[hash].[ext]?v=${version}`,
      },
      // images (vendors)
      {
        test: images,
        include: exclude,
        loaders: [
          `file-loader?name=vendors/[1]?v=${version}&regExp=node_modules/(.*)`,
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ]
      },
      // images
      {
        test: images,
        include,
        loaders: [
          `file-loader?hash=sha512&digest=hex&name=[path]/[name].[hash].[ext]?v=${version}`,
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ].filter(r => !!r),
  },

  resolve: {
    extensions: [
      '.js',
      '.css',
      '.less',
      '.scss',
      '.sass',
      '.styl',
      '.hbs',
    ],
    modules: [
      pathTo('./src'),
      'node_modules',
    ],
  },

  plugins: [

    new ProvidePlugin({
      'jQuery': 'jquery', // bootstrap/dist/js/bootstrap.js required jQuery from jquery
      'React': 'react',
      'ReactDOM': 'react-dom',
    }),

    new LoaderOptionsPlugin({
      options: {
        content: pathTo('.'),
        babel,
        postcss: [
          precss,
          rucksackCss({
            fallbacks: true,
            autoprefixer: {
              browsers: [
                'last 4 versions',
              ],
            },
          }),
        ],
        minimize: isProd(env),
        debug: !isProd(env),
      },
    }),

    !isProd(env) ? new HotModuleReplacementPlugin(): undefined,

    isProd(env) ? new UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }) : undefined,

    new NoEmitOnErrorsPlugin(),

    new ExtractTextWebpackPlugin({
      disable: false,
      allChunks: true,
      publicPath: publicPath(env),
      filename: filename('css'),
    }),

    new EnvironmentPlugin({ // use DefinePlugin instead
      'NODE_ENV': isProd(env) ? 'production' : 'development',
    }),

    new DefinePlugin({
      'process.env': {
        NODE_ENV: jsonEnv(env),
      },
    }),

    new CommonsChunkPlugin({
      name: 'vendors',
      chunks: [
        'app',
        'vendors',
      ],
    }),

    isProd(env) ? new AggressiveMergingPlugin() : undefined,

    new BaseHrefWebpackPlugin({
      baseHref: publicPath(env),
    }),

    new HtmlWebpackPlugin({
      cache: true,
      showErrors: true,
      excludeChunks: [],
      xhtml: true,
      chunks: 'all',
      // chunks: [
      //   'polyfills',
      //   'vendors',
      //   'app',
      // ],
      template: './src/assets/index.html',
      minify: isProd(env) ? {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      } : false,
    }),

  ].filter(p => !!p),

  devtool: 'source-map',

  devServer: {
    port: 8000,
    compress: isProd(env),
    inline: !isProd(env),
    hot: !isProd(env),
    stats: 'minimal',
    // stats: {
    //   assets: true,
    //   children: false,
    //   chunks: false,
    //   hash: false,
    //   modules: false,
    //   publicPath: publicPath(env),
    //   timings: true,
    //   version: false,
    //   warnings: true,
    //   colors: {
    //     green: '\u001b[32m',
    //   }
    // },
    contentBase: pathTo('./src'),
    historyApiFallback: true,
    // historyApiFallback: {
    //   index: publicPath(env),
    // },
    proxy: {
      '/api': proxy(),
    },
  },

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },

  bail: true,
  profile: 'web',
});
