import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://grock.fun';

  // Define blog posts for the sitemap
  const blogPosts = [
    { slug: 'why-speed-matters', lastModified: new Date() },
    { slug: 'choosing-the-right-hosting', lastModified: new Date() },
    { slug: 'demystifying-managed-wordpress', lastModified: new Date() },
    { slug: 'securing-your-digital-presence', lastModified: new Date() },
    { slug: 'how-we-keep-prices-low', lastModified: new Date() },
    { slug: 'smart-tech-stack-savings', lastModified: new Date() },
    { slug: 'true-value-managed-hosting', lastModified: new Date() },
    { slug: 'scaling-on-a-budget', lastModified: new Date() },
    { slug: 'unlimited-hosting-myth', lastModified: new Date() },
    { slug: 'small-business-big-impact', lastModified: new Date() },
  ];

  const blogPostUrls = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }));

  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' },
    { url: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/blog', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/documentation', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/status', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/security', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/login', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/signup', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  ].map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: page.priority,
  }));

  return [
    ...staticPages,
    ...blogPostUrls
  ]
}
