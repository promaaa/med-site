import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://dr-martin.fr';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/cancel/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
