// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // Ajuste isso para o seu ponto de entrada
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Pasta de saída
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Para arquivos JavaScript
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Se você estiver usando Babel
        },
      },
      {
        test: /\.module\.css$/, // Para arquivos CSS Module
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/, // Para arquivos CSS normais
        exclude: /\.module\.css$/, // Excluir os módulos CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // Outras configurações, como plugins e devServer, podem ir aqui
};