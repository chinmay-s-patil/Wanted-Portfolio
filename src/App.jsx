import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WantedPosterLanding from './components/WantedPosterLanding'
import Hub from './hub/Hub'
import EducationPage from './education/EducationPage'
import ProjectsPage from './projects/ProjectsPage'
import ProfessionalDiary from './professionaldiary/ProfessionalDiary'
import OpenFoamBookshelf from './OpenFoamBookshelf/OpenFoamBookshelf'
import { openfoamData } from './OpenFoamBookshelf/openfoamData'
import CADSection from './CAD/CADSection'
import VisualizationPage from './visualization/VisualizationPage'
import EventsPage from './events/EventsPage'
import UpcomingPage from './upcoming/UpcomingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WantedPosterLanding />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/professionaldiary" element={<ProfessionalDiary />} />
        <Route 
          path="/openfoam" 
          element={<OpenFoamBookshelf data={openfoamData} />} 
        />
        <Route 
          path="/cad" 
          element={<CADSection />} 
        />
        <Route path="/visualization" element={<VisualizationPage />} />
        <Route path="/events" element={<EventsPage />} />

        <Route path="/upcoming" element={<UpcomingPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App