import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Landing from './Landing-newspaper/Landing'
import { EasterEggProvider } from './hub3DV2/easterEgg/EasterEggContext'
import DraggableMiniTvPlayer from './hub3DV2/easterEgg/DraggableMiniTvPlayer'

const EducationPage = lazy(() => import('./education/EducationPage'))
const ProjectsPage = lazy(() => import('./projects/ProjectsPage'))
const ProfessionalDiary = lazy(() => import('./professionaldiary/ProfessionalDiary'))
const DriveInSection = lazy(() => import('./OpenFoam/DriveInSection'))
const CADSection = lazy(() => import('./CAD/CADSection'))
const VisualizationPage = lazy(() => import('./visualization/VisualizationPage'))
const EventsPage = lazy(() => import('./events/EventsPage'))
const UpcomingPage = lazy(() => import('./upcoming/UpcomingPage'))
const SolversSection = lazy(() => import('./solvers/SolversSection'))
const RotaryPhoneContact = lazy(() => import('./ContactMe/RotaryPhoneContact'))
const Hub3DV2 = lazy(() => import('./hub3DV2/Hub3DV2'))

const ROUTE_PAGE_TITLES = {
  '/': 'Wanted Portfolio | Detective Dossier',
  '/hub': 'Precinct Lounge 3D | Wanted Portfolio',
  '/hub3D': 'Precinct Lounge 3D | Wanted Portfolio',
  '/hub3DV2': 'Precinct Lounge 3D | Wanted Portfolio',
  '/education': 'Education & Credentials | Wanted Portfolio',
  '/projects': 'Project Archives | Wanted Portfolio',
  '/professionaldiary': 'Detective Journal | Wanted Portfolio',
  '/openfoam': 'OpenFOAM CFD Drive-In | Wanted Portfolio',
  '/cad': 'CAD & Mechanical Showcase | Wanted Portfolio',
  '/visualization': 'Data & Flow Visualization | Wanted Portfolio',
  '/events': 'Events & Media Gallery | Wanted Portfolio',
  '/upcoming': 'Upcoming Operations | Wanted Portfolio',
  '/solvers': 'Algorithmic & Physics Solvers | Wanted Portfolio',
  '/contactme': 'Contact Precinct | Wanted Portfolio',
}

/**
 * PageTitleUpdater Component
 *
 * Dynamically updates the document title in the browser tab strip on route change.
 * Handles SPA redirect query params for static hosting (GitHub Pages 404.html redirect).
 */
function PageTitleUpdater() {
  const location = useLocation()
  const navigate = useNavigate()

  // Handle SPA 404 redirect query parameter '?p=/route'
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const redirectPath = searchParams.get('p')
    if (redirectPath) {
      navigate('/' + redirectPath.replace(/^\//, ''), { replace: true })
    }
  }, [navigate])

  // Update browser tab title
  useEffect(() => {
    const title = ROUTE_PAGE_TITLES[location.pathname] || 'Wanted Portfolio'
    document.title = title
  }, [location])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <EasterEggProvider>
        <PageTitleUpdater />
        <DraggableMiniTvPlayer />
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1a1a1a' }} />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/hub" element={<Hub3DV2 />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/professionaldiary" element={<ProfessionalDiary />} />
            <Route path="/openfoam" element={<DriveInSection />} />
            <Route path="/cad" element={<CADSection />} />
            <Route path="/visualization" element={<VisualizationPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/upcoming" element={<UpcomingPage />} />
            <Route path="/solvers" element={<SolversSection />} />
            <Route path="/contactme" element={<RotaryPhoneContact />} />
            <Route path="/hub3D" element={<Hub3DV2 />} />
            <Route path="/hub3DV2" element={<Hub3DV2 />} />
          </Routes>
        </Suspense>
      </EasterEggProvider>
    </BrowserRouter>
  )
}

export default App