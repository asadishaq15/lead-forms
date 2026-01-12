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
import EnvironEduForm from './Components/EnvironEduForm'; // Import the new form
import EvolveTechFinalExpenseForm from './Components/EvolveForm2';
import SsdiForm from './Components/SsdiForm';
import SSDICallTransfer from './Components/AdvanceGrow5';
import InsuranceLeadForm from './Components/InsuranceLeadFormNew';
import ACAInboundForm from './Components/AdvanceGrow6';
import SSDIInboundFormNew from './Components/ssdiFormNew';
import GrowXForm from './Components/GrowXForm1';
import GrowXForm1 from './Components/GrowXForm1';
import GrowXForm2 from './Components/GrowXForm2';
import GradientWaves from './Components/GradientWaves';
import PlatformzOrbital from './Components/test';
import GrowXForm3 from './Components/GrowXForm3';
import Test2 from './Components/test2';
import GrowXForm4 from './Components/GrowXForm4';
import InnerPlatform from './Components/InnerPlatform';
import GrowXForm5 from './Components/GrowXForm5';
import BerkenMediaSSPILeadForm from './Components/New';
import SSDICPIPY from './Components/ssdi_cpi_py';


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
        <Route path="/leads8" element={<EvolveTechFinalExpenseForm />} />
        <Route path="/ssdi" element={<SsdiForm />} />
        <Route path="/ssdi-cpl" element={<SSDIInboundFormNew />} />
        <Route path="/environedu" element={<EnvironEduForm />} />
        <Route path="/auto-insurance" element={<InsuranceLeadForm />} /> 
        <Route path="/aca-leads" element={<ACAInboundForm />} /> 
        <Route path="/ssdi-aki" element={<GrowXForm1 />} /> 
        <Route path="/ssdi-aki-2" element={<GrowXForm2 />} /> 
       <Route path="/ssdi-cpa-fps" element={<GrowXForm3 />} /> 
       <Route path="/ssdi-cpa-fps-2" element={<GrowXForm4 />} /> 
       <Route path="/ssdi-cpa-dm" element={<GrowXForm5 />} /> 
       <Route path="/cpa-bm" element={<BerkenMediaSSPILeadForm />} /> 
       <Route path="/ssdi-cpi-py-2" element={<SSDICPIPY />} /> 

          {/* <Route path="/weaves" element={<GradientWaves />} />  
         <Route path="/test" element={<PlatformzOrbital />} />  */}
         <Route path="/platformzos2" element={<InnerPlatform />} /> 
        <Route path="/platformzos" element={<Test2 />} /> 
      </Routes>
    </Router>
  );
}

export default App;