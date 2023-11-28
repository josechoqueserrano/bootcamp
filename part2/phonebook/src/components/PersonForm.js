
const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
    return (
        <div>
            <form onSubmit={addPerson}>
                <div>
                    <div>name: <input type='text' value={newName} onChange={handleNameChange} /></div>
                    <div>number: <input type='text' value={newNumber} onChange={handleNumberChange} /></div>
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}
export default PersonForm