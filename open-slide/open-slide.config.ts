import type { OpenSlideConfig } from '@open-slide/core';

const openSlideConfig: OpenSlideConfig = {
  slidesDir: '../slides',
  base: process.env.GITHUB_PAGES_BASE || '/',
};

export default openSlideConfig;
