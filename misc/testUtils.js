// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';


/**
 * Utility to compile webpack in a jest test and report back any errors.
 * @param {Object} config - A webpack configuration object.
 * @param {function} done - jest's done callback that is called when compilation completes.
 */
// eslint-disable-next-line import/prefer-default-export
export const compileWebpack = (config, done) => {
  webpack(config, (compilerError, stats) => {
    const error = compilerError || (stats.hasErrors() && stats.compilation.errors[0]);
    if (error) {
      console.log('error', error)
      done(error);
    } else {
      done();
    }
  });
};
