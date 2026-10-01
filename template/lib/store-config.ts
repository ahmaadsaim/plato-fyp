import { StoreConfig } from '../types/store'
import defaultStoreConfig from '../config/default-store.json'

import burgerCraftConfig from '../config/samples/burger-craft.json'
import pizzaArtisanConfig from '../config/samples/pizza-artisan.json'
import sushiSakuraConfig from '../config/samples/sushi-sakura.json'
import velvetBakeryConfig from '../config/samples/velvet-bakery.json'
import tacoCantinaConfig from '../config/samples/taco-cantina.json'

export const sampleStores: Record<string, StoreConfig> = {
  'holy-buns': defaultStoreConfig as unknown as StoreConfig,
  'burger-craft': burgerCraftConfig as unknown as StoreConfig,
  'pizza-artisan': pizzaArtisanConfig as unknown as StoreConfig,
  'sushi-sakura': sushiSakuraConfig as unknown as StoreConfig,
  'velvet-bakery': velvetBakeryConfig as unknown as StoreConfig,
  'taco-cantina': tacoCantinaConfig as unknown as StoreConfig,
}

/**
 * Returns the active store configuration.
 * In single-store / static deployment: returns the static JSON.
 * In multi-tenant SaaS mode: can fetch from your SaaS backend API or database
 * based on the tenant ID or domain.
 */
export async function getStoreConfig(tenantId?: string): Promise<StoreConfig> {
  const activeTenant = tenantId || process.env.NEXT_PUBLIC_DEFAULT_TENANT

  // If matches one of the sample configurations:
  if (activeTenant && sampleStores[activeTenant]) {
    return sampleStores[activeTenant]
  }

  // If SaaS API endpoint is configured, fetch dynamically:
  const apiEndpoint = process.env.NEXT_PUBLIC_SAAS_API_URL

  if (apiEndpoint && activeTenant) {
    try {
      const res = await fetch(`${apiEndpoint}/api/stores/${activeTenant}`, {
        next: { revalidate: 60 }, // ISR caching
      })
      if (res.ok) {
        const data = await res.json()
        return data as StoreConfig
      }
    } catch (err) {
      console.warn(`[StoreConfig] Failed to fetch remote config for ${activeTenant}, using default:`, err)
    }
  }

  // Fallback to local default configuration
  return defaultStoreConfig as unknown as StoreConfig
}

/**
 * Format currency according to store configuration settings
 */
export function formatCurrency(
  amount: number,
  currency?: { symbol: string; position?: 'before' | 'after' }
): string {
  const symbol = currency?.symbol || 'Rs.'
  const position = currency?.position || 'before'
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return position === 'after' ? `${formatted} ${symbol}` : `${symbol} ${formatted}`
}
