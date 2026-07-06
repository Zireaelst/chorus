import { injectAxe, checkA11y } from 'axe-playwright';
import { getStoryContext } from '@storybook/test-runner';
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preRender(page) {
    await injectAxe(page);
  },
  async postRender(page, context) {
    const storyContext = await getStoryContext(page, context);
    if (storyContext.parameters?.a11y?.disable) {
      return;
    }
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
