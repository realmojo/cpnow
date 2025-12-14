import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL - using the domain inferred from support email (cpnow.kr)
  // In production, this should ideally come from an environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cpnow.kr'

  // Fetch all products for dynamic sitemap generation
  const { data: products } = await supabase
    .from('cpnow_products')
    .select('product_id, vendor_item_id, updated_at')
    .order('updated_at', { ascending: false })

  const productRoutes = products?.map((product) => ({
    url: `${baseUrl}/product/${product.product_id}/${product.vendor_item_id}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  })) || []

  const staticRoutes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.5,
  }))

  return [...staticRoutes, ...productRoutes]
}
