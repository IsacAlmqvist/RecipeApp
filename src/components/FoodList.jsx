export default function FoodList({listItems, selectedIndex, onSelectItem}) {

    return (
        <div style={{margin: '0 auto'}} className="mt-4">
            <ul className = "list-group d-flex">
                {listItems.map((item) => (
                    <li
                        key={item.id}
                        className={selectedIndex === item.id ? "list-group-item active" : "list-group-item"}
                        onClick={() => {onSelectItem(item.id);}}
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item.name}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}