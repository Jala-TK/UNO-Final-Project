import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:80`,
    setupNodeEvents(on, config) {},
  },
});
