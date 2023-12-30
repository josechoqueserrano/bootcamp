import { useEffect, useState } from "react"
import axios from "axios";
const Capital = ({ capital }) => {
    const  [dataCapital,setDataCapita] = useState();
    useEffect(()=>{
        axios.get('http://api.weatherstack.com/current?access_key=3e0e2ab4e8ed1f25eeb26328bc027ca6&query='+capital)
        .then(res=>{setDataCapita(res.data);console.log(res.data) }).catch((e)=> console.log('fail'))
    },[])

    return (

        <>{ dataCapital &&
            <div>
                <h2>Weather in  {dataCapital.location.name}</h2>
                <div>Temperature: {dataCapital.current.temperature} celcius</div>
                <img src={dataCapital.current.weather_icons[0]} />
                <div>wind: { dataCapital.current.wind_speed} mph direction {dataCapital.current.wind_dir}</div>
            </div>
        }</>
    )
}

export default Capital