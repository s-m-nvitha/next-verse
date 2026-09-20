import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Briefcase, Search, ExternalLink, MapPin, Clock, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { useAuthStore } from '@/store/auth'
import { SEED_JOBS, getDomainPersonalizedJobs } from '@/services/jobs'

const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract']
const experienceLevels = ['All', '0-1 years', '0-2 years', '1-2 years', '1-3 years', '2-4 years', '3-5 years', '5+ years']

export function JobsWidget() {
  const { profile } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const selectedDomainId = profile?.selectedDomainId ?? profile?.selectedCareerDomain
  const topInterests = useMemo(
    () => profile?.interestAssessment?.topInterests ?? [],
    [profile?.interestAssessment?.topInterests]
  )

  const domainSortedJobs = useMemo(() => {
    return getDomainPersonalizedJobs(SEED_JOBS, {
      selectedDomainId,
      topInterests,
    })
  }, [selectedDomainId, topInterests])

  const locations = useMemo(() => {
    const unique = Array.from(
      new Set(SEED_JOBS.map(j => j.location.split(',')[0].trim()))
    ).sort()
    return ['All', ...unique]
  }, [])

  const filteredJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return domainSortedJobs.filter(job => {
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.skills.some(skill => skill.toLowerCase().includes(term))
      const matchesType = selectedType === 'All' || job.type === selectedType
      const matchesExperience = selectedExperience === 'All' || job.experience === selectedExperience
      const matchesLocation = selectedLocation === 'All' || job.location.includes(selectedLocation)
      return matchesSearch && matchesType && matchesExperience && matchesLocation
    })
  }, [domainSortedJobs, searchTerm, selectedType, selectedExperience, selectedLocation])

  const handleSearch = () => {
    // Search handler for form/button submission
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, or skills..."
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
              <label className="text-sm font-medium">Job Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Experience</label>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(exp => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-semibold">{job.title}</h4>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{job.company}</p>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{job.experience}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Required Skills: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Posted: </span>
                        <span className="text-sm text-muted-foreground">
                          {job.postedDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button asChild>
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
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

      {filteredJobs.length === 0 && (
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      {/* Job Market Stats */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Job Market Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{filteredJobs.length}</p>
              <p className="text-sm text-muted-foreground">Available Jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredJobs.length > 0
                  ? formatCurrency(Math.max(...filteredJobs.map(j => j.salary.max)))
                  : formatCurrency(0)}
              </p>
              <p className="text-sm text-muted-foreground">Highest Salary</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {filteredJobs.filter(j => j.type === 'Full-time').length}
              </p>
              <p className="text-sm text-muted-foreground">Full-time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {filteredJobs.filter(j => j.type === 'Internship').length}
              </p>
              <p className="text-sm text-muted-foreground">Internships</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
