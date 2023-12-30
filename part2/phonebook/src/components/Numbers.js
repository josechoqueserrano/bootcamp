const Numbers = ({ personList, handleDeletePerson}) =>
    <div>{personList.map((person, index) => <p key={index}>{person.name} {person.number} <button onClick={ ()=>{ handleDeletePerson(person.id)} }> Delete </button> </p> )}</div>
export default Numbers;