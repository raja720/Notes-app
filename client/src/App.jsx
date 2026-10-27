
import { Route, Routes,Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Notes from './pages/Notes'



const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login"/>}/>

      <Route path='/signup' element={<Signup />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/notes' element={<Notes />}/>
    </Routes>
  )
}

export default App