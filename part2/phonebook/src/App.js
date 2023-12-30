import { useEffect, useState } from 'react'
import Numbers from './components/Numbers'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/Numbers'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ findPerson, setFindPerson]  = useState('');
  const [personList,setPersonList] = useState(persons);  
  const [message, setMessage] = useState({message:null,type:null});

  useEffect(()=>{

    personService
      .getAll()
      .then((initialPersons)=>{
        setPersons(initialPersons);
        setPersonList(initialPersons);
      })
  },[])
  const handleNameChange =  (event) =>{ 
    event.preventDefault();
    setNewName( event.target.value)
  }
  
  const handleNumberChange = (event) =>{
    event.preventDefault();
    setNewNumber(event.target.value);
  }

  const handleDeletePerson = (id) =>{
    const person = persons.find( ( person) => person.id === id)
    if(window.confirm(`Delete ${person.name}?`)){
      personService
        .deletePerson(id)
        .then((idDelete)=>{
          setPersons(persons.filter((person)=> person.id !== idDelete))
          setPersonList(persons.filter((person)=> person.id !== idDelete))
        }).catch((error)=>{
          setMessage({message:`Information of ${person.name} has already been removed from server`,type:'error'});
          setPersons(persons.filter((person)=> person.id !== id))
          setPersonList(persons.filter((person)=> person.id !== id))
          setTimeout(() => {
            setMessage({message:null,type:null})
          } , 5000)
        } )
    }

  } 

  const addPerson = (event)=>{
    try {
      event.preventDefault();
      if(persons.find( (person) => person.name === newName )){
 //       throw new Error('Esta seguro que quiere sobre escribir el numero de telefono?')
        if(window.confirm('Esta seguro que desea sobre escribir el numero de telefono?')){
          const person = persons.find( (person) => person.name === newName )
          const newPerson = { ...person, number:newNumber}
          personService
            .update(person.id,newPerson)
            .then((returnedPerson)=>{
              setPersons(persons.map((person)=> person.id !== returnedPerson.id ? person : returnedPerson))
              setPersonList(persons.map((person)=> person.id !== returnedPerson.id ? person : returnedPerson))
              setNewName('');
              setNewNumber('');
              setMessage({message:`Successfully updated ${returnedPerson.name}`,type:'success'});
              setTimeout(() => {
                setMessage({message:null,type:null})
              } , 5000)
            })
        }
      }else{
        const newPerson = { name: newName, number:newNumber}

        personService
          .create(newPerson)
          .then((returnedPerson)=>{
            setPersons(persons.concat(returnedPerson));
            setPersonList(persons.concat(returnedPerson));
            setNewName('');
            setNewNumber('');
            setMessage({message:`Successfully added ${returnedPerson.name}`,type:'success'});
            setTimeout(() => {
              setMessage({message:null,type:null})
            } , 5000)
          })
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
      <Notification notify={message} />
      <Filter findPerson={findPerson} handleFindPerson={handleFindPerson }/>
      <h3> Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}/>
        <h3>Numbers</h3>
        <Numbers personList={personList} handleDeletePerson={handleDeletePerson}  />
    </div>
  )
}


export default App