import { Route, Routes } from "react-router-dom"
import { ErrorPage, MovieDetailPage, MoviesPage } from "./pages"
import CategoryPage from "./pages/CategoryPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MoviesPage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/detail/:id" element={<MovieDetailPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default App 
