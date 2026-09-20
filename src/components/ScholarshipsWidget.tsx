import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Award, Search, ExternalLink, MapPin, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { useAuthStore } from '@/store/auth'
import { loadSeedScholarshipsKarnataka, type SeedScholarship } from '@/services/seedDataService'

const levelLabel = (lvl: SeedScholarship['level']) => (lvl === 'UG' || lvl === 'PG' ? lvl : `After ${lvl}`)

const formatInr = (value: number) => formatCurrency(value)

const scholarshipAmountText = (s: SeedScholarship) => {
  const min = s.eligibility?.incomeLimitInr
  const max = s.eligibility?.familyIncomeInr
  void min
  void max
  return 'See details'
}

export function ScholarshipsWidget() {
  const { profile } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [seedScholarships, setSeedScholarships] = useState<SeedScholarship[]>([])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const list = await loadSeedScholarshipsKarnataka()
      if (!mounted) return
      setSeedScholarships(list)
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const educationLevel = profile?.educationLevel
  const levelFiltered = useMemo(() => {
    if (!educationLevel) return seedScholarships
    return seedScholarships.filter((s) => s.level === educationLevel)
  }, [educationLevel, seedScholarships])

  const providers = useMemo(() => {
    const base = Array.from(new Set(levelFiltered.map((x) => x.provider))).sort()
    return ['All', ...base]
  }, [levelFiltered])

  const filteredScholarships = levelFiltered.filter((s) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      s.name.toLowerCase().includes(term) ||
      s.provider.toLowerCase().includes(term) ||
      (s.benefits ?? []).some((b) => b.toLowerCase().includes(term))

    const matchesProvider = selectedProvider === 'All' || s.provider === selectedProvider
    return matchesSearch && matchesProvider
  })

  const handleSearch = () => {
    // Here you would typically make an API call to search scholarships
    console.log('Searching scholarships with filters:', {
      searchTerm,
      selectedProvider,
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50"
          >
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scholarships List */}
      <div className="space-y-4">
        {filteredScholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-semibold">{scholarship.name}</h4>
                      <Badge variant="outline">{levelLabel(scholarship.level)}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{scholarship.provider}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {scholarshipAmountText(scholarship)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Karnataka</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Eligibility: </span>
                        <span className="text-sm text-muted-foreground">
                          {(scholarship.eligibility?.category?.length ? `Category: ${scholarship.eligibility.category.join(', ')}. ` : '') +
                            (scholarship.eligibility?.incomeLimitInr ? `Income below ${formatInr(scholarship.eligibility.incomeLimitInr)}. ` : '') +
                            (scholarship.eligibility?.familyIncomeInr ? `Family income below ${formatInr(scholarship.eligibility.familyIncomeInr)}. ` : '') +
                            (scholarship.eligibility?.minimumMarks ? `Min marks: ${scholarship.eligibility.minimumMarks}. ` : '') +
                            (scholarship.eligibility?.qualification ? `Qualification: ${scholarship.eligibility.qualification}. ` : '') +
                            (scholarship.eligibility?.requirement ? `Requirement: ${scholarship.eligibility.requirement}. ` : '') +
                            (scholarship.eligibility?.academicPerformance ? `Performance: ${scholarship.eligibility.academicPerformance}. ` : '') +
                            (scholarship.eligibility?.specialCategory?.length ? `Special: ${scholarship.eligibility.specialCategory.join(', ')}.` : '')}
                        </span>
                      </div>
                      {scholarship.benefits?.length ? (
                        <div>
                          <span className="text-sm font-medium">Benefits: </span>
                          <span className="text-sm text-muted-foreground">{scholarship.benefits.join(', ')}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button asChild>
                      <a
                        href={scholarship.officialWebsite ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          if (!scholarship.officialWebsite) e.preventDefault()
                        }}
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Scholarship Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{filteredScholarships.length}</p>
              <p className="text-sm text-muted-foreground">Total Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{providers.length - 1}</p>
              <p className="text-sm text-muted-foreground">Providers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{educationLevel ?? '-'}</p>
              <p className="text-sm text-muted-foreground">Education Level</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">Karnataka</p>
              <p className="text-sm text-muted-foreground">Scope</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
