export default function PlannedRecipeList ({listItems = []})  {

    return (
        <div className="mt-2 mb-1">
            <ul className = "list-group">
                {listItems.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex"
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item.name}</div>
                        <div className= "ms-auto me-2" style ={{textAlign: 'right'}}>{item.portions}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}