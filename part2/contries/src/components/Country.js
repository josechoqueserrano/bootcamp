import { useEffect, useState } from "react"
import axios from "axios";
import Capital from "./Capital";
const Country = ({country}) => {

   
   
    return (<div>
        <h2>{country.name.common}</h2>
        <div>capital {country.capital}</div>
        <div>capital {country.population}</div>
        <h3>Languages</h3>
        <nav>
            {Object.keys(country.languages).map((keys)=><ul key={keys}><li>{country.languages[keys]}</li></ul>)}
        </nav>
        <img src={country.flags.png}/>
        <Capital capital={country.capital}/>
    </div>)
}
export default Country