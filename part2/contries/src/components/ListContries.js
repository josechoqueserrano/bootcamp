import Country from "./Country";
import Contries from "./Contries";
const ListContries = ({listContries,setAllContries})=>{
return(
    <>
        { listContries.length===1 && <Country country={listContries[0]}/>}
        { (listContries.length>=2 && listContries.length<=10) && <Contries listContries={listContries} setAllContries={setAllContries}/>}
        { listContries.length>10 && 'too many matches, spedify another filter'}

    </>)
}

export default ListContries;