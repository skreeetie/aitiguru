import { Route, Routes } from "react-router"
import { ProtectedPage } from "./pages/ProtectedPage"
import { Catalog } from "./pages/Catalog"
import { LoginPage } from "./pages/LoginPage"

export const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedPage />}>
        <Route path='/' element={<Catalog />} />
      </Route>
      <Route path='/auth' element={<LoginPage />} />
    </Routes>
  )
}