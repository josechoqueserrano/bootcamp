
const Course = ({course}) => {
    return (
    <>
      <div>
        <Header course={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={(course.parts)}/>
    </div>
  </>)
  }
export default Course;


const Total = ({parts}) =>{
    const total = parts.reduce( (a,b) => a+b.exercises,0)
    return (<>
      <p><b>Number of exercises {total}</b></p>
    </>)
  }
  
  const Header=({ course })=>{
  
    return (<>
      <h1> {course} </h1>
    </>)
  }
  const Content = ({ parts }) => ( 
    
    <div>  
  
      { parts.map( (part)=>{ return <Part key={part.id} part={part}/>})} 
    
    </div>
  
  )
  const Part = ( {part} ) => ( <p>  {part.name} {part.exercises} </p>)
