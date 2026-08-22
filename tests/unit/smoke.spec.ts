import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';

describe('App smoke test', () => {
  it('mounts properly with Pinia and Vue Router', async () => {
    const pinia = createPinia();
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
