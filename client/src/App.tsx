import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import NavigationBar from './components/Navbar'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import NewTask from './pages/NewTask'
import EditTask from './pages/EditTask'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <NavigationBar />
          {/* top padding za fixed navbar */}
          <div style={{ paddingTop: '76px' }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              
              {/* Private routes */}
              <Route path="/tasks/new" element={<NewTask />} />
              <Route path="/tasks/:id/edit" element={<EditTask />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
