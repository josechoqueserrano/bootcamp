import { useState } from "react";
import Filter from "./components/FIlter";
import ListContries from "./components/ListContries";
import axios from "axios";
function App() {
  const[allContries,setAllContries] = useState();
  //const[filterListContry,setFilterListContry] = useState();
  
  useState(()=>{
  
  axios.get('https://restcountries.com/v3.1/all')
  .then(res=>{
    setAllContries(res.data)
  })
  },[]);

  const handleOnChangeFilterContries = async (event)=>{
    event.preventDefault();
  
    try{
      const res = await axios.get(`https://restcountries.com/v3.1/name/${event.target.value}`)
      setAllContries([...res.data])

    }
    catch(error){
      setAllContries(null);
    }
  }
  return (
    <div className="App">
      <Filter handleOnChangeFilterContries={handleOnChangeFilterContries}/>
      {allContries && <ListContries listContries={allContries} setAllContries={setAllContries} />}
    </div>
  );
}

export default App;
