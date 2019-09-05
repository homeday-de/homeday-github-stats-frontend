require('dotenv').config ();
const { DefinePlugin } = require('webpack');

// These should be either present in the .env file, or already defined in the
// deployment environment
const requiredConstants = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'API_FETCH_REPOSITORIES_URL',
  'API_ANALYZE_URL',
];

module.exports = {
  configureWebpack: {
    plugins: [
      new DefinePlugin(
        requiredConstants.reduce((constants, key) => {
          return {
            ...constants,
            [`process.env.${key}`]: JSON.stringify(process.env[key]),
          };
        }, {}),
      ),
    ],
  },
};
