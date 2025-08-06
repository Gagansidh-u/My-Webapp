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
    changeFrequency: 'yearly' as 'yearly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogPostUrls,
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
     {
      url: `${baseUrl}/documentation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
     {
      url: `${baseUrl}/status`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
