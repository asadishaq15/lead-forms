// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import KBBLeadForm from './Components/KBBForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KBBLeadForm />} />
   
      </Routes>
    </Router>
  );
}

export default App;