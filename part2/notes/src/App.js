import { useEffect, useState } from 'react'
import Note from './components/Note'
import axios from 'axios'
import noteService from './services/notes'
const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll,setShowAll] = useState(true)
  const addNote = (event) => {

    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: notes.length + 1,
    } 
    noteService.create( noteObject )
    .then( response => {
      setNotes(notes.concat(response))
      setNewNote('')
    })
      }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) =>{
    const url = `http://192.168.1.14:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}
    axios.put(url, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
      .catch(error => {
        alert(`the note '${note.content}' was already deleted from server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll
  ? notes
  : notes.filter( note => note.important === true)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [] )


  return (
    <div>
      <h1>Notes</h1>
      <button onClick={ ()=> setShowAll(!showAll)}> show{ showAll?'Important':'all'}</button>
      <ul>
        <ul>
          {notesToShow.map(note => 
            <Note 
              key={note.id} 
              note={note} 
              toggleImportance={()=> toggleImportanceOf(note.id)}
              />
          )}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>

      </form>
    </div>
  )
}

export default App


