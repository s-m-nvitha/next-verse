import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { BookOpen, Download, ExternalLink, Search, Filter, Check, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import type { SeedStudyMaterial } from '@/services/seedDataService'
import { loadStudyMaterialsHybrid } from '@/services/studyMaterialsService'
import { toast } from '@/hooks/use-toast'
import { useOfflineMaterialsStore, downloadMaterialForOffline } from '@/services/offlineMaterialsService'
import {
  resolvePersonalizationContext,
  filterAndRankMaterials,
} from '@/services/studyMaterialsPersonalization'
import type { EducationLevel } from '@/lib/validators'

type MaterialKind = NonNullable<SeedStudyMaterial['format']>

const kindIcons: Record<MaterialKind, typeof BookOpen> = {
  ebook: BookOpen,
  notes: BookOpen,
  video: BookOpen,
  course: BookOpen,
}

const kindColors: Record<MaterialKind, string> = {
  ebook: 'bg-[#9DD9FF] text-ink border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
  notes: 'bg-[#FFD84D] text-ink border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
  course: 'bg-[#C8FF32] text-ink border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
  video: 'bg-[#62E89B] text-ink border border-ink font-mono text-[10px] uppercase font-bold rounded-none',
}

export function StudyMaterialsWidget() {
  const { profile } = useAuthStore()
  const { isCached, cachedMaterials } = useOfflineMaterialsStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKind, setSelectedKind] = useState<string>('all')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [seedMaterials, setSeedMaterials] = useState<SeedStudyMaterial[]>([])
  const [viewMode, setViewMode] = useState<'personalized' | 'all'>('personalized')
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  // Load the complete study materials catalog; never fail with [] if profile level is undefined
  useEffect(() => {
    let mounted = true
    const run = async () => {
      const level = (profile?.educationLevel ??
        (profile?.educationInfo as { level?: EducationLevel } | undefined)?.level) as EducationLevel | undefined

      const list = await loadStudyMaterialsHybrid(level)
      if (!mounted) return
      setSeedMaterials(list)
    }
    run()
    return () => {
      mounted = false
    }
  }, [profile?.educationLevel, profile?.educationInfo])

  // Resolve student's domain, career, course, exam, and normalized interests
  const personalizationContext = useMemo(() => {
    return resolvePersonalizationContext(profile)
  }, [profile])

  // Filter & rank into full catalog and personalized catalog
  const { allMaterials, personalizedMaterials } = useMemo(() => {
    return filterAndRankMaterials(seedMaterials, personalizationContext)
  }, [seedMaterials, personalizationContext])

  const personalizedCount = personalizedMaterials.length
  const totalCount = allMaterials.length

  // Filter candidate pool based on viewMode and search/kind/provider controls
  const filteredMaterials = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const candidates = viewMode === 'personalized' ? personalizedMaterials : allMaterials

    const matchesUiFilters = (material: SeedStudyMaterial) => {
      const matchesSearch =
        !term ||
        material.title.toLowerCase().includes(term) ||
        (material.provider ?? '').toLowerCase().includes(term) ||
        (material.relatedDomains ?? []).some((d) => d.toLowerCase().includes(term))

      const kind = material.format ?? 'ebook'
      const matchesKind = selectedKind === 'all' || kind === selectedKind
      const matchesProvider =
        selectedProvider === 'all' || (material.provider ?? '').toLowerCase() === selectedProvider
      return matchesSearch && matchesKind && matchesProvider
    }

    return candidates.filter(matchesUiFilters)
  }, [viewMode, personalizedMaterials, allMaterials, searchTerm, selectedKind, selectedProvider])

  const handleDownload = async (material: SeedStudyMaterial) => {
    if (isCached(material.id)) {
      toast({
        title: 'Already Available Offline',
        description: `"${material.title}" is already cached in your offline library.`,
      })
      return
    }

    setIsDownloading(material.id)
    try {
      const result = await downloadMaterialForOffline(material)
      if (result.success) {
        toast({
          title: 'Saved for Offline Access',
          description: `"${material.title}" is now available in your offline library.`,
        })
      } else {
        toast({
          title: 'Download Incomplete',
          description: result.error ?? 'Could not cache this external resource.',
        })
      }
    } finally {
      setIsDownloading(null)
    }
  }

  const providers = useMemo(() => {
    return Array.from(
      new Set(allMaterials.map((m) => (m.provider ?? '').toLowerCase()).filter(Boolean))
    ).sort()
  }, [allMaterials])

  const kinds = useMemo(() => {
    return Array.from(new Set(allMaterials.map((m) => m.format ?? 'ebook'))).sort()
  }, [allMaterials])

  const cachedCount = Object.keys(cachedMaterials).length

  return (
    <div className="space-y-6">
      {/* Domain Personalization & Catalog Toggle */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setViewMode('personalized')}
            className={`h-7 px-3 font-mono text-xs font-black uppercase rounded-none border-2 border-ink transition-all ${
              viewMode === 'personalized'
                ? 'bg-[#C8FF32] text-ink shadow-[2px_2px_0px_#11110F]'
                : 'bg-white dark:bg-neutral-800 text-muted-foreground hover:text-ink'
            }`}
          >
            <Sparkles className="h-3 w-3 mr-1 text-ink" />
            Personalized ({personalizedCount})
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setViewMode('all')}
            className={`h-7 px-3 font-mono text-xs font-black uppercase rounded-none border-2 border-ink transition-all ${
              viewMode === 'all'
                ? 'bg-[#9DD9FF] text-ink shadow-[2px_2px_0px_#11110F]'
                : 'bg-white dark:bg-neutral-800 text-muted-foreground hover:text-ink'
            }`}
          >
            All Materials ({totalCount})
          </Button>
        </div>
        {cachedCount > 0 && (
          <span className="font-mono text-[11px] font-bold text-ink dark:text-cream px-2 py-0.5 border border-ink bg-[#62E89B]/30">
            {cachedCount} Cached Offline
          </span>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search study materials, subjects, or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" aria-label="Filter study materials">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
            className="px-3 py-2 border-2 border-ink rounded-none bg-background font-mono text-xs shadow-[2px_2px_0px_#11110F]"
            aria-label="Filter by material type"
          >
            <option value="all">All Types</option>
            {kinds.map((kind) => (
              <option key={kind} value={kind}>
                {kind.charAt(0).toUpperCase() + kind.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 border-2 border-ink rounded-none bg-background font-mono text-xs shadow-[2px_2px_0px_#11110F]"
            aria-label="Filter by material provider"
          >
            <option value="all">All Providers</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State when personalized materials have no matches */}
      {viewMode === 'personalized' && personalizedCount === 0 && (
        <div className="text-center py-10 px-4 border-2 border-dashed border-ink/40 bg-muted/20">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-display font-black text-lg text-ink dark:text-cream uppercase tracking-tight mb-1">
            NO VERIFIED MATERIALS YET
          </h4>
          <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto mb-4">
            We couldn't find verified resources for your selected track.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="btn-tactile bg-[#C8FF32] text-ink font-mono text-xs font-black uppercase border-2 border-ink rounded-none shadow-[2px_2px_0px_#11110F] hover:bg-[#C8FF32]/90"
            onClick={() => setViewMode('all')}
          >
            Explore All Materials
          </Button>
        </div>
      )}

      {/* Materials List */}
      <div className="space-y-4">
        {filteredMaterials.map((material, index) => {
          const kind = (material.format ?? 'ebook') as MaterialKind
          const Icon = kindIcons[kind]
          const isItemCached = isCached(material.id)
          const isItemDownloading = isDownloading === material.id

          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
            >
              <Card className="border-2 border-ink rounded-none shadow-[3px_3px_0px_#11110F] dark:shadow-[3px_3px_0px_#222] bg-card hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#11110F] transition-all">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Icon className="h-4 w-4 text-ink dark:text-cream flex-shrink-0" />
                        <h4 className="font-display font-black text-base text-ink dark:text-cream tracking-tight truncate max-w-full">
                          {material.title}
                        </h4>
                        <span className={kindColors[kind]}>{kind}</span>
                        {material.verified && (
                          <span className="bg-[#62E89B] text-ink border border-ink font-mono text-[9px] uppercase font-black px-1.5 py-0.5 rounded-none shadow-[1px_1px_0px_#11110F]">
                            VERIFIED
                          </span>
                        )}
                        {material.sourceType && (
                          <span className="border border-ink/40 font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 text-muted-foreground">
                            {material.sourceType.replace(/_/g, ' ')}
                          </span>
                        )}
                        {material.difficultyLevel ? (
                          <span className="border border-ink/40 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 text-muted-foreground">
                            {material.difficultyLevel}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground mb-3 flex-wrap">
                        <span>
                          Provider: <strong className="text-ink dark:text-cream">{material.provider ?? '—'}</strong>
                        </span>
                        {material.language?.length ? <span>Language: {material.language.join(', ')}</span> : null}
                        {material.lastVerified ? (
                          <span className="text-[10px] text-muted-foreground/70">Verified: {material.lastVerified}</span>
                        ) : null}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isItemDownloading}
                          className={`btn-tactile border-2 border-ink rounded-none font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#11110F] transition-all ${
                            isItemCached
                              ? 'bg-[#62E89B] text-ink hover:bg-[#62E89B]/90 font-black'
                              : 'bg-[#C8FF32] text-ink hover:bg-[#C8FF32]/90'
                          }`}
                          onClick={() => void handleDownload(material)}
                        >
                          {isItemCached ? (
                            <>
                              <Check className="h-3 w-3 mr-1.5 stroke-[3]" />
                              CACHED OFFLINE
                            </>
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-1.5" />
                              {isItemDownloading ? 'Caching...' : 'Download for Offline'}
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="btn-tactile bg-white dark:bg-neutral-800 text-ink dark:text-cream border-2 border-ink rounded-none font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#11110F]"
                        >
                          <a
                            href={material.url ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!material.url) {
                                e.preventDefault()
                                toast({
                                  title: 'Link not available',
                                  description: 'No online link is available for this resource yet.',
                                })
                              }
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1.5" />
                            View Online
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredMaterials.length === 0 && (personalizedCount > 0 || viewMode === 'all') && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-xs">No study materials found matching your search or filters.</p>
        </div>
      )}

      {/* Offline Capabilities Info */}
      <Card className="bg-muted/50 border-2 border-ink rounded-none shadow-[2px_2px_0px_#11110F]">
        <CardContent className="p-4">
          <h4 className="font-display font-black text-sm text-ink dark:text-cream uppercase tracking-tight mb-1">
            Offline Capabilities
          </h4>
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            Download materials to access them offline. Cached materials remain stored in NEXT VERSE local storage even without an internet connection.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="rounded-none border-ink font-mono text-[10px]">
              E-books
            </Badge>
            <Badge variant="outline" className="rounded-none border-ink font-mono text-[10px]">
              Syllabus & Bulletins
            </Badge>
            <Badge variant="outline" className="rounded-none border-ink font-mono text-[10px]">
              Official Portals
            </Badge>
            <Badge variant="outline" className="rounded-none border-ink font-mono text-[10px]">
              Interactive Tutorials
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
