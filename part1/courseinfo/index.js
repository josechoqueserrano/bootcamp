import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
//  const parts = [{title: part1, n_exercise:exercises1},{title: part2, n_exercise:exercises2},{title: part3, n_exercise:exercises3}]
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={(course.parts)}/>
    </div>
  )
}
const Total = ({parts}) =>{
  const total = parts[0].exercises+parts[1].exercises+parts[2].exercises
  return (<>
    <p>Number of exercises {total}</p>
  </>)
}

const Header=({ course })=>{

  return (<>
    <h1> {course} </h1>
  </>)
}
const Content = ({ parts}) => ( 
  
  <div>   
    <Part part={parts[0]} />
    <Part part={parts[1]} />
    <Part part={parts[2]} />

  </div>
)

const Part = ( {part} ) => ( <p>  {part.name} {part.exercises} </p>)
/*const Content = ({parts}) =>{
  return (
  <>
  {Object.keys(parts).map( (_,index)=> <p key={index}>{parts[index]['title']} {parts[index]['n_exercise']}</p>  ) }
  </>)
}*/
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
