// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import KBBLeadForm from './Components/KBBForm';
import AdvanceGrowMarketingLeadForm from './Components/AdvanceGrowForm';
import AdvanceGrowMarketingCallTransferForm from './Components/AdvanceGrow2';
import AdvanceGrowMarketingLeadForm2 from './Components/AdvanceGrow3';
import KBBSalesGroupLeadForm2 from './Components/KBBForm2';
import KBBSalesLeadForm3 from './Components/KBBForm3';
import KBBSalesLeadForm4 from './Components/kBBForm4';
import DepoProveraLeadForm from './Components/Form4';
import EvolveTechInnovationsForm from './Components/EvolveForm';
import AcaKkCplForm from './Components/kBBForm5';
import AdvanceGrow4 from './Components/AdvanceGrow4';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KBBLeadForm />} />
        <Route path="/growx" element={<AdvanceGrowMarketingLeadForm />} />
        <Route path="/growx2" element={<AdvanceGrowMarketingLeadForm2 />} />
        <Route path="/lead4" element={<DepoProveraLeadForm />} />
        <Route path="/leads" element={<AdvanceGrowMarketingCallTransferForm />} />
        <Route path="/leads2" element={<KBBSalesGroupLeadForm2 />} />
        <Route path="/leads3" element={<KBBSalesLeadForm3 />} />
        <Route path="/leads4" element={<EvolveTechInnovationsForm />} />
        <Route path="/leads5" element={<KBBSalesLeadForm4 />} />
        <Route path="/leads6" element={<AcaKkCplForm />} />
        <Route path="/leads7" element={<AdvanceGrow4 />} />
   
      </Routes>
    </Router>
  );
}

export default App;