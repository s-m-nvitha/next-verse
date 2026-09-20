import '@testing-library/jest-dom'
import type { ReactNode } from 'react'
import { vi } from 'vitest'

// Mock Firebase
vi.mock('@/services/firebase', () => ({
  auth: {},
  db: {},
  functions: {},
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    button: 'button',
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}))

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: ReactNode }) => children,
  TileLayer: () => null,
  Marker: () => null,
  Popup: ({ children }: { children: ReactNode }) => children,
}))

// Mock leaflet
vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(),
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  writable: true,
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock IndexedDB
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
}
Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
})
