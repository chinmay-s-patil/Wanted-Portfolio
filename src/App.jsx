import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hub from './hub/Hub'
import EducationPage from './education/EducationPage'
import ProjectsPage from './projects/ProjectsPage'
import ProfessionalDiary from './professionaldiary/ProfessionalDiary'
import DriveInSection from './OpenFoam/DriveInSection';
import CADSection from './CAD/CADSection'
import VisualizationPage from './visualization/VisualizationPage'
import EventsPage from './events/EventsPage'
import UpcomingPage from './upcoming/UpcomingPage'
import SolversSection from './solvers/SolversSection'
import RotaryPhoneContact from './ContactMe/RotaryPhoneContact'
import Landing from './Landing-newspaper/Landing'
import Hub3D from './hub3D/Hub3D'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/hub" element={<Hub />} />
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
        <Route path="/hub3D" element={<Hub3D />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App