export function organizationSchema() {
  return { '@context': 'https://schema.org', '@type': 'Organization', name: 'The Biker Babies', url: 'https://bikerbabies.com', logo: 'https://bikerbabies.com/favicon.svg',
    description: 'Join The Biker Babies on thrilling animated adventures, dive into the book series, and grab official merchandise!',
    sameAs: ['https://www.youtube.com/@TheBikerBabies', 'https://www.instagram.com/thebikerbabies', 'https://www.facebook.com/thebikerbabies', 'https://www.tiktok.com/@thebikerbabies', 'https://x.com/TheBikerBabies'],
    parentOrganization: { '@type': 'Organization', name: 'The Metavision Multimedia Limited', url: 'https://themetavision.co.uk' } };
}
export function websiteSchema() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: 'The Biker Babies', url: 'https://bikerbabies.com',
    description: 'Adventure on two wheels! The Biker Babies animated series, book universe, and official merch.',
    publisher: { '@type': 'Organization', name: 'The Biker Babies' } };
}
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })) };
}
export function tvSeriesSchema() {
  return { '@context': 'https://schema.org', '@type': 'TVSeries', name: 'The Biker Babies',
    description: 'An animated series following a diverse crew of young riders on thrilling bike adventures, learning teamwork and friendship along the way.',
    genre: ['Animation', 'Adventure', 'Comedy', 'Children'], url: 'https://bikerbabies.com',
    productionCompany: { '@type': 'Organization', name: 'The Metavision Multimedia Limited' } };
}
export function characterSchema(character: { name: string; bio: string; image?: string; url: string }) {
  return { '@context': 'https://schema.org', '@type': 'FictionalCharacter', name: character.name, description: character.bio, image: character.image, url: character.url,
    partOfSeries: { '@type': 'TVSeries', name: 'The Biker Babies' } };
}
export function productSchema(product: { name: string; description: string; price: number; image?: string; url: string; availability?: string }) {
  return { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, image: product.image, url: product.url,
    brand: { '@type': 'Brand', name: 'The Biker Babies' },
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'GBP', availability: product.availability || 'https://schema.org/InStock', seller: { '@type': 'Organization', name: 'The Biker Babies' } } };
}
export function articleSchema(post: { title: string; excerpt: string; publishedAt: string; image?: string; url: string }) {
  return { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt, datePublished: post.publishedAt, image: post.image, url: post.url,
    author: { '@type': 'Organization', name: 'The Biker Babies' }, publisher: { '@type': 'Organization', name: 'The Metavision Multimedia Limited' } };
}
export function videoSchema(video: { title: string; description: string; youtubeId: string; publishedAt?: string; duration?: string; thumbnail?: string }) {
  return { '@context': 'https://schema.org', '@type': 'VideoObject', name: video.title, description: video.description,
    thumbnailUrl: video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
    uploadDate: video.publishedAt, duration: video.duration, embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`, publisher: { '@type': 'Organization', name: 'The Biker Babies' } };
}
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) };
}
export function collectionSchema(collection: { name: string; description: string; url: string; itemCount: number }) {
  return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: collection.name, description: collection.description, url: collection.url, numberOfItems: collection.itemCount,
    isPartOf: { '@type': 'WebSite', name: 'The Biker Babies', url: 'https://bikerbabies.com' } };
}
