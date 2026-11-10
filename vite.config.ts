import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// Deploy a project site at https://USER.github.io/gopixel-academy/.
// For an owner.github.io repo or custom domain: VITE_BASE=/ npm run build.
export default defineConfig({
  plugins: [preact()],
  base: process.env.VITE_BASE || '/gopixel-academy/',
});
