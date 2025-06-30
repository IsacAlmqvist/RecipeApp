export default function IngredientList({listItems = []}) {

    return (
        <div className="mt-2 mb-1">
            <ul className = "list-group">
                {listItems.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex"
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item.name}</div>
                        <div className= "ms-auto me-2" style ={{textAlign: 'right'}}>{item.amount}</div>
                        <div className= "me-3" style ={{textAlign: 'right'}}>{item.unit}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}