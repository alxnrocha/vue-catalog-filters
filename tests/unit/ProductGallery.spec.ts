import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductGallery from '@/components/quickview/ProductGallery.vue';

describe('ProductGallery.vue Component', () => {
  const images = [
    'https://images.unsplash.com/photo-1?w=800',
    'https://images.unsplash.com/photo-2?w=800',
    'https://images.unsplash.com/photo-3?w=800',
  ];

  it('renders main image and thumbnail buttons', () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images,
        productName: 'Trench Coat',
      },
    });

    const mainImg = wrapper.find('img');
    expect(mainImg.attributes('src')).toBe(images[0]);
    expect(mainImg.attributes('alt')).toBe('Trench Coat');

    const thumbButtons = wrapper.findAll('button');
    expect(thumbButtons.length).toBe(3);
  });

  it('switches main image when a thumbnail is clicked', async () => {
    const wrapper = mount(ProductGallery, {
      props: {
        images,
        productName: 'Trench Coat',
      },
    });

    const thumbButtons = wrapper.findAll('button');
    await thumbButtons[1].trigger('click');

    const mainImg = wrapper.find('img');
    expect(mainImg.attributes('src')).toBe(images[1]);
  });
});
