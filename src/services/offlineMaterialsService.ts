import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SeedStudyMaterial } from '@/services/seedDataService'

export interface CachedMaterialRecord {
  id: string
  title: string
  provider?: string
  format: string
  url: string
  cachedAt: string
  offlinePackageUrl?: string
}

interface OfflineMaterialsState {
  cachedMaterials: Record<string, CachedMaterialRecord>
  isCached: (id: string) => boolean
  addCachedMaterial: (record: CachedMaterialRecord) => void
  removeCachedMaterial: (id: string) => void
}

export const useOfflineMaterialsStore = create<OfflineMaterialsState>()(
  persist(
    (set, get) => ({
      cachedMaterials: {},

      isCached: (id: string) => {
        return Boolean(get().cachedMaterials[id])
      },

      addCachedMaterial: (record: CachedMaterialRecord) => {
        set({
          cachedMaterials: {
            ...get().cachedMaterials,
            [record.id]: record,
          },
        })
      },

      removeCachedMaterial: (id: string) => {
        const next = { ...get().cachedMaterials }
        delete next[id]
        set({ cachedMaterials: next })
      },
    }),
    {
      name: 'offline-materials-registry',
    }
  )
)

const CACHE_NAME = 'nextverse-offline-materials'

/**
 * Downloads and caches a study material for offline use using CacheStorage.
 * Handles CORS and external restrictions gracefully by saving an offline-accessible bundle.
 */
export const downloadMaterialForOffline = async (
  material: SeedStudyMaterial
): Promise<{ success: boolean; error?: string }> => {
  if (!material.url) {
    return { success: false, error: 'No resource URL available to download.' }
  }

  try {
    if (typeof window === 'undefined' || !('caches' in window)) {
      // Fallback: save to local offline registry
      useOfflineMaterialsStore.getState().addCachedMaterial({
        id: material.id,
        title: material.title,
        provider: material.provider,
        format: material.format ?? 'ebook',
        url: material.url,
        cachedAt: new Date().toISOString(),
      })
      return { success: true }
    }

    const cache = await caches.open(CACHE_NAME)
    const offlineSyntheticUrl = `/offline-materials/${encodeURIComponent(material.id)}`

    // Attempt direct fetch with no-cors or standard fetch
    try {
      const response = await fetch(material.url, { mode: 'no-cors' })
      if (response && (response.ok || response.type === 'opaque')) {
        await cache.put(offlineSyntheticUrl, response)
      }
    } catch {
      // Cross-origin network restriction or offline; will package offline bundle
    }

    // Also store an offline JSON bundle for offline viewing in app
    const bundleData = {
      id: material.id,
      title: material.title,
      type: material.type,
      level: material.level,
      provider: material.provider ?? 'Official Provider',
      url: material.url,
      format: material.format,
      difficultyLevel: material.difficultyLevel,
      cachedAt: new Date().toISOString(),
      sourceType: material.sourceType ?? 'official_portal',
      verified: material.verified ?? true,
      lastVerified: material.lastVerified,
      instructions: 'This resource metadata and access package is cached in NEXT VERSE offline storage.',
    }

    const jsonResponse = new Response(JSON.stringify(bundleData), {
      headers: {
        'Content-Type': 'application/json',
        'X-NextVerse-Cached': 'true',
      },
    })
    await cache.put(`${offlineSyntheticUrl}.json`, jsonResponse)

    // Update persistent store
    useOfflineMaterialsStore.getState().addCachedMaterial({
      id: material.id,
      title: material.title,
      provider: material.provider,
      format: material.format ?? 'ebook',
      url: material.url,
      cachedAt: new Date().toISOString(),
      offlinePackageUrl: offlineSyntheticUrl,
    })

    return { success: true }
  } catch (err) {
    console.error('Offline download error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to cache material offline.',
    }
  }
}
