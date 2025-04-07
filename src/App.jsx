// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import KBBLeadForm from './Components/KBBForm';
import AdvanceGrowMarketingLeadForm from './Components/AdvanceGrowForm';
import AdvanceGrowMarketingCallTransferForm from './Components/AdvanceGrow2';
import AdvanceGrowMarketingLeadForm2 from './Components/AdvanceGrow3';
import KBBSalesGroupLeadForm2 from './Components/KBBForm2';
import KBBSalesLeadForm3 from './Components/KBBForm3';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KBBLeadForm />} />
        <Route path="/growx" element={<AdvanceGrowMarketingLeadForm />} />
        <Route path="/growx2" element={<AdvanceGrowMarketingLeadForm2 />} />
        <Route path="/leads" element={<AdvanceGrowMarketingCallTransferForm />} />
        <Route path="/leads2" element={<KBBSalesGroupLeadForm2 />} />
        <Route path="/leads3" element={<KBBSalesLeadForm3 />} />
   
      </Routes>
    </Router>
  );
}

export default App;