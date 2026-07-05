module.exports = {
  source: ['tokens/**/*.json'],
  hooks: {
    formats: {
      'css/colors-dark-mode': function({ dictionary, file }) {
        const header = `/*\n * DO NOT EDIT — generated from packages/design-tokens/tokens/\n */\n\n`;
        
        let lightRoot = ':root {\n';
        let darkRoot = '.dark {\n';

        const lightTokens = dictionary.allTokens.filter(t => t.path[0] === 'color' && t.path[1] === 'light');
        const darkTokens = dictionary.allTokens.filter(t => t.path[0] === 'color' && t.path[1] === 'dark');

        lightTokens.forEach(t => {
          const name = `--color-${t.path.slice(2).join('-')}`;
          lightRoot += `  ${name}: ${t.value};\n`;
        });
        lightRoot += '}\n\n';

        darkTokens.forEach(t => {
          const name = `--color-${t.path.slice(2).join('-')}`;
          darkRoot += `  ${name}: ${t.value};\n`;
        });
        darkRoot += '}\n';

        return header + lightRoot + darkRoot;
      },
      'javascript/tailwind-theme': function({ dictionary, file }) {
        const header = `/* DO NOT EDIT — generated from packages/design-tokens/tokens/ */\n\n`;
        
        const theme = {
          extend: {
            colors: {
              canvas: 'var(--color-canvas)',
              surface: 'var(--color-surface)',
              'border-hairline': 'var(--color-border-hairline)',
              'border-strong': 'var(--color-border-strong)',
              'text-primary': 'var(--color-text-primary)',
              'text-secondary': 'var(--color-text-secondary)',
              'accent-verify': 'var(--color-accent-verify)',
              'status-error': 'var(--color-status-error)',
              'status-warning': 'var(--color-status-warning)',
              'status-success': 'var(--color-status-success)'
            },
            fontFamily: {},
            fontSize: {},
            borderRadius: {},
            transitionDuration: {},
            transitionTimingFunction: {},
            boxShadow: {
              none: 'none',
              popover: '0 2px 8px 0 rgb(0 0 0 / 0.08)'
            }
          }
        };

        const fonts = dictionary.allTokens.filter(t => t.path[0] === 'font' && t.path[1] === 'family');
        fonts.forEach(t => {
          theme.extend.fontFamily[t.path[2]] = t.value;
        });

        const sizes = dictionary.allTokens.filter(t => t.path[0] === 'font' && t.path[1] === 'size');
        sizes.forEach(t => {
          theme.extend.fontSize[t.path[2]] = t.value;
        });

        const radii = dictionary.allTokens.filter(t => t.path[0] === 'radius');
        radii.forEach(t => {
          theme.extend.borderRadius[t.path[1]] = t.value;
        });

        const durations = dictionary.allTokens.filter(t => t.path[0] === 'motion' && t.path[1] === 'duration');
        durations.forEach(t => {
          theme.extend.transitionDuration[t.path[2]] = t.value;
        });

        const easings = dictionary.allTokens.filter(t => t.path[0] === 'motion' && t.path[1] === 'easing');
        easings.forEach(t => {
          theme.extend.transitionTimingFunction[t.path[2]] = t.value;
        });

        return header + `module.exports = ${JSON.stringify(theme, null, 2)};\n`;
      }
    }
  },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [{
        destination: 'colors.css',
        format: 'css/colors-dark-mode'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{
        destination: 'tailwind-theme.js',
        format: 'javascript/tailwind-theme'
      }]
    },
    json: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{
        destination: 'design-tokens.json',
        format: 'json/flat'
      }]
    }
  }
};
