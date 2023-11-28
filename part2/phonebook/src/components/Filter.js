const Filter = ( { findPerson, handleFindPerson}) => 
<div> <b>Filter shown with</b><input value={findPerson} onChange={ handleFindPerson } type='text'/></div>

export default Filter