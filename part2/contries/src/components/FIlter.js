const Filter  = ({handleOnChangeFilterContries}) => {
    return (
    <div>
       find contries <input type="text" onChange={handleOnChangeFilterContries}/>
    </div>)
}

export default Filter;