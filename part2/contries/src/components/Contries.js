
const Contries = ({ listContries,setAllContries}) =>{
    return(
    <div>
        {listContries && listContries.map((contry,index)=><div key={index}>{contry.name.common} <button onClick={(event)=>{event.preventDefault();setAllContries([contry])}}>show</button></div>) }
    </div>)
}

export default Contries;