// https://umijs.org/config/
import { defineConfig, utils } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import webpackPlugin from './plugin.config';

const { winPath } = utils;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV, GA_KEY } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  analytics: GA_KEY ? { ga: GA_KEY } : false,
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },
            {
              path: '/informationManagement',
              // component: '../layouts/BasicLayout',
              routes: [
                {
                  path: '/informationManagement/articleManagement',
                  routes: [
                    {
                      name: 'addArticle',
                      path: '/informationManagement/articleManagement/addArticle',
                      component: './informationManagement/articleManagement/addArticle',
                    },
                    {
                      name: 'editorArticle',
                      path: '/informationManagement/articleManagement/editorArticle',
                      component: './informationManagement/articleManagement/editorArticle',
                    },
                    {
                      name: 'previewArticle',
                      path: '/informationManagement/articleManagement/previewArticle',
                      component: './informationManagement/articleManagement/previewArticle',
                    },
                    {
                      name: 'articleList',
                      path: '/informationManagement/articleManagement/articleList',
                      component: './informationManagement/articleManagement/articleList',
                    },
                    {
                      name: 'fineArticleList',
                      path: '/informationManagement/articleManagement/fineArticleList',
                      component: './informationManagement/articleManagement/fineArticleList',
                    },
                    {
                      name: 'bannerManagement',
                      path: '/informationManagement/articleManagement/bannerManagement',
                      routes: [
                        {
                          name: 'bannerList',
                          path: '/informationManagement/articleManagement/bannerManagement/bannerList',
                          component: './informationManagement/articleManagement/bannerManagement/bannerList',
                        },
                        {
                          name: 'add-banner',
                          path: '/informationManagement/articleManagement/bannerManagement/add-banner',
                          component: './informationManagement/articleManagement/bannerManagement/add-banner',
                        },
                        {
                          name: 'update-banner',
                          path: '/informationManagement/articleManagement/bannerManagement/update-banner',
                          component: './informationManagement/articleManagement/bannerManagement/update-banner'
                        },
                      ],
                    },
                  ],
                },
                // {
                //   path: '/informationManagement/finearticleManagement',
                //   routes: [
                //     {
                //       name: 'fineArticleList',
                //       path: '/informationManagement/finearticleManagement/fineArticleList',
                //       component: './informationManagement/articleManagement/fineArticleList',
                //     },
                //   ],
                // },

                {
                  path: '/informationManagement/classifyToManage',
                  routes: [
                    {
                      name: 'classifyList',
                      path: '/informationManagement/classifyToManage/classifyList',
                      component: './informationManagement/classifyToManage/classifyList',
                    },
                    {
                      name: 'classifyArticleList',
                      path: '/informationManagement/classifyToManage/classifyArticleList/:id',
                      component: './informationManagement/classifyToManage/classifyArticleList',
                    },
                    {
                      path: '/informationManagement/classifyToManage/classificationList',
                      routes: [
                        {
                          name: 'add-classification',
                          path: 'add-classification',
                          component: './informationManagement/classifyToManage/classificationList/add-classification',
                        },
                        {
                          name: 'update-classification',
                          path: 'update-classification',
                          component: './informationManagement/classifyToManage/classificationList/update-classification',
                        },
                      ],
                    }//end
                  ],
                },
                {
                  path: '/informationManagement/roleManagement',
                  routes: [
                    {
                      name: 'roleList',
                      path: '/informationManagement/roleManagement/roleList',
                      component: './informationManagement/roleManagement/roleList',
                    },
                  ],
                },

              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    modules: {
      getLocalIdent: (
        context: {
          resourcePath: string;
        },
        _: string,
        localName: string,
      ) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
            .map((a: string) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
});
