import { IConfig } from 'umi-types';
import { resolve } from 'path';

// ref: https://umijs.org/config/
const config: IConfig = {
  history: 'hash',
  ignoreMomentLocale: true,
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true,
          level: 3,
        },
        title: 'ECHI_UMI_PROJECT',
        dll: false,
        locale: {
          enable: true,
          default: 'en-US',
        },
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  // Webpack Configuration
  proxy: {
    // '/api/v1/weather': {
    //   target: 'https://api.seniverse.com/',
    //   changeOrigin: true,
    //   pathRewrite: { '^/api/v1/weather': '/v3/weather' },
    // },
  },
  alias: {
    api: resolve(__dirname, './src/services/'),
    components: resolve(__dirname, './src/components'),
    config: resolve(__dirname, './src/utils/config'),
    models: resolve(__dirname, './src/models'),
    services: resolve(__dirname, './src/services'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
  },
};

export default config;
