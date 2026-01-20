import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WantedPosterLanding from './components/WantedPosterLanding'
import Hub from './hub/Hub'
import EducationPage from './education/EducationPage'
import ProjectsPage from './projects/ProjectsPage'
import ProfessionalDiaryPage from './professionaldiary/ProfessionalDiary'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WantedPosterLanding />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/professionaldiary" element={<ProfessionalDiaryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App