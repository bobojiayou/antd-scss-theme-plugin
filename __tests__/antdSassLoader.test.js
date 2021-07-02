import path from 'path';
import { render } from 'sass';
import rimraf from 'rimraf';

import { compileWebpack } from '../misc/testUtils';
import {
  themeImporter,
  overloadSassLoaderOptions,
} from '../src/antdSassLoader';
import SharkrThemePlugin from '../src/index';
import { compileThemeVariables } from '../src/utils';

describe('themeImporter', () => {
  test('produces an importer that allows importing compiled antd variables', async () => {
    const themePath = path.resolve(__dirname, 'data/theme.scss');
    const contents = await compileThemeVariables(themePath);
    return render({
      file: path.resolve(__dirname, 'data/test.scss'),
      importer: themeImporter(themePath, contents),
    }, (error, result) => {
      const compiledColor = result.css.toString().match(/background: (.*);/)[1];
      expect(compiledColor).toBe('yellow');
    });
  });
});


describe('overloadSassLoaderOptions', () => {
  const mockImporter = (url, previous, done) => { done(); };
  const scssThemePath = path.resolve(__dirname, 'data/theme.scss');

  it('adds an extra when given no importers', async () => {
    const overloadedOptions = await overloadSassLoaderOptions({
      scssThemePath,
    });
    expect(typeof overloadedOptions.importer).toBe('function');
  });

  [
    ['existing importer', mockImporter],
    ['existing importer array', [mockImporter]],
  ].forEach(([description, importer]) => {
    it(`adds an importer when given an ${description}`, async () => {
      const overloadedOptions = await overloadSassLoaderOptions({
        importer,
        scssThemePath,
      });

      expect(overloadedOptions.importer.length).toBe(2);
      overloadedOptions.importer.forEach(imp => expect(typeof imp).toBe('function'));
    });
  });

  it('uses scss theme path from plugin when not given one through options', async () => {
    // eslint-disable-next-line no-unused-vars
    const plugin = new SharkrThemePlugin(scssThemePath);
    const overloadedOptions = await overloadSassLoaderOptions({});
    expect(typeof overloadedOptions.importer).toBe('function');
  });

  it('throws error when no scss theme path is supplied', (done) => {
    SharkrThemePlugin.SCSS_THEME_PATH = null;
    overloadSassLoaderOptions({})
      .catch((error) => {
        expect(error.message).toMatch(/scss theme file must be specified/i);
        done();
      });
  });
});

describe('antdSassLoader', () => {
  const outputPath = path.join(__dirname, 'output');
  beforeAll(() => {
    jest.setTimeout(20000)
  })
  afterAll(() => {
    rimraf(outputPath, (error) => {
      if (error) {
        throw error;
      }
    });
  });

  test.only('enables importing theme variables in scss processed with sass-loader', async () => {
    const config = {
      mode: 'development',
      entry: path.resolve(__dirname, 'data/test.scss'),
      output: {
        path: outputPath,
        filename: '[name].bundle.js',
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              'raw-loader',
              SharkrThemePlugin.themify({
                loader: 'sass-loader',
                options: {
                  scssThemePath: path.resolve(__dirname, 'data/theme.scss'),
                },
              }),
            ],
          },
        ],
      },
    };
    const err = await compileWebpack(config);
    if (err) {
      console.log('err', err)
    }
  });
}, 20000);
