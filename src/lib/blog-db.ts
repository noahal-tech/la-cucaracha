export type Post = {
  id: string;
  title: string;
  content: string;
  featuredImage: string;
  status: 'DRAFT' | 'PUBLISHED';
};

const SEED: Omit<Post, 'status'>[] = [
  {
    id: 'blog-1',
    title: 'Why Our New Vessels Are Perfect for Your Home',
    content: 'Transform your living space with our stunning new collection of handcrafted vessels. Each piece is designed to blend seamlessly with any interior style, from minimalist modern to cozy bohemian. Our ceramic vases, planters, and decorative bowls are made from premium materials that ensure durability while adding an elegant touch to your shelves, tables, and windowsills. Whether you\'re looking for a statement centerpiece or subtle accents, our vessels bring warmth and character to every room. Shop our latest arrivals and discover the perfect piece to complement your home décor.',
    featuredImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop',
  },
  {
    id: 'blog-2',
    title: 'Need New Apparel? Here\'s What\'s Trending This Season',
    content: 'Refresh your wardrobe with our latest apparel collection! This season, we\'re all about comfort meeting style. From breathable cotton tees perfect for everyday wear to cozy hoodies that transition effortlessly from morning coffee runs to evening hangouts, we\'ve got you covered. Our new arrivals feature versatile pieces in earth tones and bold prints that mix and match beautifully. Plus, every item is crafted with sustainable fabrics because looking good should feel good too. Browse our collection and find your new favorite outfit today.',
    featuredImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop',
  },
];

const globalStore = globalThis as unknown as { __cucarachaBlogDb?: Map<string, Post> };

export const db: Map<string, Post> = (globalStore.__cucarachaBlogDb ??= new Map(
  SEED.map((post) => [post.id, { ...post, status: 'PUBLISHED' as const }])
));
