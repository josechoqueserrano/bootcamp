const Numbers = ({ personList}) => <div>{ personList.map(( person,index )=> <p key={index}>{person.name} {person.number}</p>) }</div>
export default Numbers;