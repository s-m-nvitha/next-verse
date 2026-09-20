import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ExternalLink } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix default marker asset paths in react-leaflet environments
if (typeof L !== 'undefined' && L.Icon && L.Icon.Default) {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// Crisp, self-contained SVG map pin icons (no broken external asset dependencies)
const userPinIcon = typeof L !== 'undefined' && typeof L.icon === 'function' ? L.icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 1C7.268 1 1 7.268 1 15C1 25.5 15 39 15 39C15 39 29 25.5 29 15C29 7.268 22.732 1 15 1Z" fill="#2563EB" stroke="#11110F" stroke-width="2"/>
      <circle cx="15" cy="15" r="5" fill="#C8FF32" stroke="#11110F" stroke-width="1.5"/>
    </svg>
  `)}`,
  iconSize: [30, 40],
  iconAnchor: [15, 39],
  popupAnchor: [0, -36],
}) : undefined

const collegePinIcon = typeof L !== 'undefined' && typeof L.icon === 'function' ? L.icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 1C6.82 1 1 6.82 1 14C1 23.5 14 37 14 37C14 37 27 23.5 27 14C27 6.82 21.18 1 14 1Z" fill="#E11D48" stroke="#11110F" stroke-width="2"/>
      <circle cx="14" cy="13" r="5" fill="#FFFFFF" stroke="#11110F" stroke-width="1.2"/>
      <circle cx="14" cy="13" r="2" fill="#11110F"/>
    </svg>
  `)}`,
  iconSize: [28, 38],
  iconAnchor: [14, 37],
  popupAnchor: [0, -34],
}) : undefined

const focusedCollegePinIcon = typeof L !== 'undefined' && typeof L.icon === 'function' ? L.icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1C8.163 1 1 8.163 1 17C1 29 17 45 17 45C17 45 33 29 33 17C33 8.163 25.837 1 17 1Z" fill="#FFD84D" stroke="#11110F" stroke-width="2.5"/>
      <circle cx="17" cy="16" r="6" fill="#11110F"/>
      <circle cx="17" cy="16" r="3" fill="#FFFFFF"/>
    </svg>
  `)}`,
  iconSize: [34, 46],
  iconAnchor: [17, 45],
  popupAnchor: [0, -42],
}) : undefined

export interface MapWidgetCollege {
  id: string
  name: string
  lat?: number
  lon?: number
  website?: string
  courses?: string[]
  type?: string
  distanceKm?: number
}

interface MapWidgetProps {
  colleges?: MapWidgetCollege[]
  userLocation?: [number, number] | null
  showList?: boolean
}

function MapFocus(props: { focus?: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (!props.focus) return
    map.setView(props.focus, Math.max(map.getZoom(), 13), { animate: true })
  }, [map, props.focus])

  return null
}

export function MapWidget(props: MapWidgetProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [focusedCollegeId, setFocusedCollegeId] = useState<string | null>(null)

  const showList = props.showList ?? true

  const collegesToShow = useMemo(() => {
    const list = props.colleges
    if (!list || list.length === 0) return []

    const validColleges = list.filter((c) => typeof c.lat === 'number' && typeof c.lon === 'number')

    // Group colleges by coordinates to detect overlaps
    const coordGroups = new Map<string, typeof validColleges>()
    for (const c of validColleges) {
      const key = `${c.lat!.toFixed(3)}_${c.lon!.toFixed(3)}`
      const existing = coordGroups.get(key)
      if (existing) existing.push(c)
      else coordGroups.set(key, [c])
    }

    // Keep track of index within each coordinate group for deterministic separation
    const coordCounts = new Map<string, number>()

    return validColleges.map((c) => {
      const key = `${c.lat!.toFixed(3)}_${c.lon!.toFixed(3)}`
      const group = coordGroups.get(key) ?? [c]
      const indexInGroup = coordCounts.get(key) ?? 0
      coordCounts.set(key, indexInGroup + 1)

      let displayLat = c.lat as number
      let displayLon = c.lon as number

      // If multiple colleges share the exact coordinate, apply a deterministic radial offset
      if (group.length > 1) {
        const total = group.length
        const angle = (2 * Math.PI * indexInGroup) / total
        // ~200-300m offset radius with subtle spiral if > 8
        const offsetDist = 0.0022 + Math.floor(indexInGroup / 8) * 0.0012
        displayLat = displayLat + offsetDist * Math.cos(angle)
        displayLon = displayLon + (offsetDist / Math.max(0.2, Math.cos((displayLat * Math.PI) / 180))) * Math.sin(angle)
      }

      return {
        id: c.id,
        name: c.name,
        position: [displayLat, displayLon] as [number, number],
        isSharedLocation: group.length > 1,
        sharedGroupCount: group.length,
        distance: typeof c.distanceKm === 'number' ? `${c.distanceKm.toFixed(1)} km` : '',
        website: c.website ?? '',
        courses: c.courses ?? [],
        fees: '',
      }
    })
  }, [props.colleges])

  const focused = useMemo(() => {
    if (!focusedCollegeId) return null
    const c = collegesToShow.find((x) => x.id === focusedCollegeId)
    return c?.position ?? null
  }, [collegesToShow, focusedCollegeId])

  useEffect(() => {
    if (props.userLocation && Array.isArray(props.userLocation) && props.userLocation.length === 2) {
      setUserLocation(props.userLocation)
      setIsLoading(false)
      return
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setIsLoading(false)
        },
        () => {
          // Fallback to Bengaluru coordinates if geolocation fails
          setUserLocation([12.9716, 77.5946])
          setIsLoading(false)
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60_000,
        }
      )
    } else {
      // Fallback to Bengaluru coordinates
      setUserLocation([12.9716, 77.5946])
      setIsLoading(false)
    }
  }, [props.userLocation])

  if (isLoading || !userLocation) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground font-mono text-sm">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="h-64 rounded-lg overflow-hidden">
        <MapContainer
          center={userLocation}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <MapFocus focus={focused} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          <Marker position={userLocation} icon={userPinIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-sm">Your Location</p>
                <p className="text-xs text-muted-foreground font-mono">Current position</p>
              </div>
            </Popup>
          </Marker>

          {/* College markers */}
          {collegesToShow.map((college) => (
            <Marker
              key={college.id}
              position={college.position as [number, number]}
              icon={college.id === focusedCollegeId ? (focusedCollegePinIcon ?? undefined) : (collegePinIcon ?? undefined)}
            >
              <Popup>
                <div className="min-w-[210px]">
                  <h3 className="font-semibold mb-1 text-sm leading-tight">{college.name}</h3>
                  {college.isSharedLocation ? (
                    <p className="text-[11px] text-muted-foreground mb-1 font-mono">
                      (Regional cluster • {college.sharedGroupCount} institutions)
                    </p>
                  ) : null}
                  <div className="space-y-1 text-xs">
                    {college.distance ? <p><strong>Distance:</strong> {college.distance}</p> : null}
                    {college.fees ? <p><strong>Fees:</strong> {college.fees}</p> : null}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {college.courses.slice(0, 5).map((course, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] py-0 font-mono">
                          {course}
                        </Badge>
                      ))}
                    </div>
                    {college.website ? (
                      <Button
                        size="sm"
                        className="w-full mt-2 h-7 text-xs"
                        asChild
                      >
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {showList ? (
        <div className="space-y-2">
          <h4 className="font-semibold">Nearby Colleges</h4>
          {collegesToShow.map((college) => (
            <Card
              key={college.id}
              className={`p-3 cursor-pointer ${focusedCollegeId === college.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setFocusedCollegeId(college.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{college.name}</p>
                    {college.distance ? <p className="text-sm text-muted-foreground">{college.distance}</p> : null}
                  </div>
                </div>
                <div className="text-right">
                  {college.fees ? <p className="text-sm font-medium">{college.fees}</p> : null}
                  {college.website ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={college.website} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}