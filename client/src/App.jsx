
import { Route, Routes,Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Notes from './pages/Notes'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'




const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login"/>}/>

      <Route path='/signup' element={<Signup />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/notes' element={<Notes />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
      <Route path='/reset-password/:token' element={<ResetPassword />}/>
    </Routes>
  )
}

export default App