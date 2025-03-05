// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import KBBLeadForm from './Components/KBBForm';
import AdvanceGrowMarketingLeadForm from './Components/AdvanceGrowForm';
import AdvanceGrowMarketingCallTransferForm from './Components/AdvanceGrow2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KBBLeadForm />} />
        <Route path="/growx" element={<AdvanceGrowMarketingLeadForm />} />
        <Route path="/leads" element={<AdvanceGrowMarketingCallTransferForm />} />
   
      </Routes>
    </Router>
  );
}

export default App;