import path from 'path';

import SharkrThemePlugin from '../src/index';
import { getScssThemePath } from '../src/loaderUtils';


describe('getScssThemePath', () => {
  const referencePath = path.resolve(__dirname, 'data/theme.scss');
  it('extracts the theme path from options first', () => {
    // eslint-disable-next-line no-unused-vars
    const plugin = new SharkrThemePlugin('other.scss');
    const scssThemePath = getScssThemePath({ scssThemePath: referencePath });
    expect(scssThemePath).toBe(referencePath);
  });

  it('extracts the theme path from plugin when not specified in options', () => {
    // eslint-disable-next-line no-unused-vars
    const plugin = new SharkrThemePlugin(referencePath);
    const scssThemePath = getScssThemePath({});
    expect(scssThemePath).toBe(referencePath);
  });

  it('throws error when path is not specified', () => {
    // eslint-disable-next-line no-unused-vars
    const plugin = new SharkrThemePlugin();
    expect(() => {
      getScssThemePath({});
    }).toThrow(/scss theme file must be specified/i);
  });
});
