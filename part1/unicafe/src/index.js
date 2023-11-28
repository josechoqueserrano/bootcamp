import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
/** Statistics **/

const StatisticLine = ({ text ,value}) => (<tr><td>{text}</td><td>{value}</td></tr>)

/** Statistics **/

/**Statistics**/
const Statistics = ( { good, neutral, bad, clicks } ) => ( 
  <div>
    <h2> statistics</h2>
      {
      clicks==0?
        (<p>No feedback given</p>)
        :(<table>
          <tbody>
            <StatisticLine text='good' value={good}/>
            <StatisticLine text='neutral' value={neutral}/>
            <StatisticLine text='bad' value={bad}/>
            <StatisticLine text='all' value={clicks}/>
            <StatisticLine text='average' value={((good) + (bad*-1))/clicks}/>
            <StatisticLine text='Positive' value={`${(good/clicks)*100 }%`}/>
            </tbody>
        </table>)}
  </div>
)
/**Statistics**/
/**Button **/
const Button = ( {handleClick,name} ) => (
<>
    <button className='btn-options' onClick={ ()=> handleClick(name)} >
        {name} 
    </button> 
  
</>)
/**Button **/

/** Component App **/
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [clicks,setClicks] = useState(0);
  const handleClick  = (option) =>{
    switch (option) {
      case 'good':
          setGood(good +1); setClicks(clicks+1);
        break;
      case 'neutral':
          setNeutral(neutral +1);setClicks(clicks+1);
        break;
      case 'bad':
          setBad(bad+1);setClicks(clicks+1);
        break;
      
      default: console.log('wrong option')
        break;
    }
  }
  return (

    <div>
      
      <h1 >Give feedback</h1>
      <Button handleClick={handleClick} name = 'good' />
      <Button handleClick={handleClick} name = 'neutral' />
      <Button handleClick={handleClick} name = 'bad' />

      <Statistics good ={good} neutral={neutral} bad={bad} clicks={clicks} /> 
    </div>
  )
}


/** Component App **/


root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);


