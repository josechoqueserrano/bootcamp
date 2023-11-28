import { useState } from 'react'
import Numbers from './components/Numbers'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ findPerson, setFindPerson]  = useState('');
  const [personList,setPersonList] = useState(persons);  
  
  const handleNameChange =  (event) =>{ 
    event.preventDefault();
    setNewName( event.target.value)
  }
  
  const handleNumberChange = (event) =>{
    event.preventDefault();
    setNewNumber(event.target.value);
  }

  const addPerson = (event)=>{
    try {
      event.preventDefault();
      if(persons.find( (person) => person.name === newName )){
        throw new Error('La persona ya esta registrada')
      }else{
        const newPerson = { name: newName, number:newNumber}
        setPersons(persons.concat(newPerson));
        setPersonList(persons.concat(newPerson));
        setNewName('');
      }
    }
    
    catch(e){
      alert(`${newName} is already added to phonebook`)
      setNewName('');
    }
}
const handleFindPerson = (event) =>{
  event.preventDefault();
  setPersonList( persons.filter((person)=> person.name.toLowerCase().includes( event.target.value ) ) ) 
  setFindPerson(event.target.value)
}
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter findPerson={findPerson} handleFindPerson={handleFindPerson }/>
      <h3> Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}/>
        <h3>Numbers</h3>
        <Numbers personList={personList} />
    </div>
  )
}


export default App