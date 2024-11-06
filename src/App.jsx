import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './Authentication.jsx'
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App


