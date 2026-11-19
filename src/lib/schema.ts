import type {
  WebSite,
  Organization,
  LocalBusiness,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  WithContext,
} from 'schema-dts';
import siteConfig from '@/config/site.config';

/**
 * Create WebSite schema for homepage
 */
export function createWebsiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

// No Person schema: the owner asked (19 Nov 2026) that the founder's name
// not appear on the site, and a Person needs a name.

/**
 * Create ProfessionalService schema for local SEO
 */
export function createProfessionalServiceSchema(): WithContext<LocalBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService' as 'LocalBusiness',
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.authorImage ? { image: `${siteConfig.url}${siteConfig.authorImage}` } : {}),
    ...(siteConfig.address?.city
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            postalCode: siteConfig.address.zip,
            addressCountry: siteConfig.address.country,
          },
        }
      : {}),
    areaServed: [
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Qatar' },
      { '@type': 'Country', name: 'Kuwait' },
      { '@type': 'Country', name: 'Bahrain' },
      { '@type': 'Country', name: 'Oman' },
    ],
    // What an AI assistant or search engine needs to describe the studio: what
    // it is, who runs it, what it offers (with each service's page) and in
    // which languages. Facts only from the site's own pages.
    description: siteConfig.description,
    logo: `${siteConfig.url}/apple-touch-icon.png`,
    knowsLanguage: ['en', 'ar'],
    knowsAbout: [
      'Website design',
      'Ecommerce website development',
      'Arabic and English bilingual websites',
      'Right-to-left (RTL) web design',
      'Brand identity',
      'Python',
      'Django',
    ],
    // The five services (16 Nov 2026) with their prices as the pages show
    // them: "from" prices as minPrice, fixed prices as price, Growth & care
    // per month.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: (
        [
          ['Website design', '/services/websites/', { minPrice: 300 }],
          ['Ecommerce stores', '/services/ecommerce/', { minPrice: 700 }],
          ['Arabic and RTL websites', '/services/arabic-websites/', { price: 300 }],
          ['Brand identity', '/services/#brand-identity', { price: 500 }],
          ['Growth and care', '/services/#growth-care', { price: 400, unitText: 'month' }],
        ] as [string, string, { minPrice?: number; price?: number; unitText?: string }][]
      ).map(([name, path, price]) => ({
        '@type': 'Offer' as const,
        itemOffered: { '@type': 'Service' as const, name, url: `${siteConfig.url}${path}` },
        priceSpecification: {
          '@type': price.unitText ? ('UnitPriceSpecification' as const) : ('PriceSpecification' as const),
          priceCurrency: 'USD',
          ...price,
        },
      })),
    },
    // An empty sameAs list is noise in the markup; leave it out until a profile exists.
    ...(siteConfig.socialLinks.length ? { sameAs: siteConfig.socialLinks } : {}),
  };
}

/**
 * Create Organization schema
 */
export function createOrganizationSchema(): WithContext<Organization> {
  const logoUrl = siteConfig.branding.logo.imageUrl
    ? `${siteConfig.url}${siteConfig.branding.logo.imageUrl}`
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    ...(logoUrl ? { logo: logoUrl } : {}),
    // An empty sameAs list is noise in the markup; leave it out until a profile exists.
    ...(siteConfig.socialLinks.length ? { sameAs: siteConfig.socialLinks } : {}),
    contactPoint: siteConfig.phone
      ? {
          '@type': 'ContactPoint',
          telephone: siteConfig.phone,
          contactType: 'customer service',
        }
      : undefined,
  };
}

/**
 * Create BlogPosting schema for blog posts
 */
export function createBlogPostSchema(post: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
  author: { type?: 'Person' | 'Organization'; name: string; url?: string };
}): WithContext<BlogPosting> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: post.url,
    image: post.image,
    datePublished: post.datePublished.toISOString(),
    dateModified: post.dateModified?.toISOString() || post.datePublished.toISOString(),
    author: {
      '@type': post.author.type ?? 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      ...(siteConfig.branding.logo.imageUrl
        ? {
            logo: {
              '@type': 'ImageObject',
              url: `${siteConfig.url}${siteConfig.branding.logo.imageUrl}`,
            },
          }
        : {}),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

/**
 * Create BreadcrumbList schema
 */
export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Create FAQPage schema
 */
export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
