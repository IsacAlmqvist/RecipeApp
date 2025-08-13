export default function SearchedIngredientList({listItems, onSelectItem}) {

    return (
        <div style={{margin: '0 auto'}} className="mb-2">
            <ul className = "list-group d-flex">
                {listItems.map((item) => (
                    <li
                        key={item.id}
                        className="list-group-item"
                        onClick={() => {onSelectItem(item.id);}}
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item.name}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}