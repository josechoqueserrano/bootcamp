import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

/** Component App **/
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes,setVotes] = useState(new Array(anecdotes.length).fill(0))
  const handleClieck  = (e) => {
    e.preventDefault();
    let number = Math.floor(Math.random() * anecdotes.length);
    
    console.log(votes[number])

    
    setSelected(number)
  }

  const handleVotes = (e) =>{
    e.preventDefault();
    let newVotes = votes;
    console.log(selected)
    newVotes[selected] = votes[selected]+1;
    setVotes([...newVotes])
  }
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]} 
      <div>has {votes[selected]} votes</div>
      <div>      
        <button onClick={handleVotes}>votes</button>
        <button onClick={handleClieck}>next anecdotes</button>
      </div>
      <div>
        <h2>Anecdote whith most votes</h2>
        { anecdotes[votes.findIndex( (vote) => vote===Math.max(...votes) )]}
      </div>
    </div>
  )
}
/** Component App **/

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);


