// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';


/**
 * Utility to compile webpack in a jest test and report back any errors.
 * @param {Object} config - A webpack configuration object.
 */
// eslint-disable-next-line import/prefer-default-export
export const compileWebpack = (config) => {
  return new Promise((resolve, reject) => {
    webpack(config, (compilerError, stats) => {
      const error = compilerError || (stats.hasErrors() && stats.compilation.errors[0]);
      if (error) {
        // console.log('error', error)
        reject(error)
      } else {
        resolve(false)
      }
    });
  })

};
