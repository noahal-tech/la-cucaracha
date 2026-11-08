import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import createProduct from './extensions/dashboard/pages/create-product/create-product.extension.ts';

import createBlogPost from './extensions/dashboard/pages/create-blog-post/create-blog-post.extension.ts';

export default app()
  .use(myPage)
  .use(createProduct)
  .use(createBlogPost);
