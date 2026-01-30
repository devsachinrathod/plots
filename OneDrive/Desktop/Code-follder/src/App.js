import { BrowserRouter as Router} from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar/Navbar';
import AllRoutes from './AllRoutes';
import { useEffect , useState } from 'react';


function App() {
  const [ slidein,setslidein] = useState(true)
  useEffect(()=> {
    if(window.innerWidth<=768){
      setslidein(false)
    }
  },[])

  const  handleslinde =() =>{
    if(window.innerWidth <= 768){
      setslidein((state)=>!state);
    }
  };
  return (
    <div className="App">
      <Router>
      <Navbar></Navbar>
      <AllRoutes slidein = {slidein} handleslinde = {handleslinde}></AllRoutes>
      </Router>
    </div>
  );
}

export default App;
