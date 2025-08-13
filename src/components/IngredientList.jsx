export default function IngredientList({listItems = [], deleteButton = false, onDelete = () => {}}) {

    return (
        <div className="mb-1">
            <ul className = "list-group">
                {listItems.map((item, index) => (
                    <li
                        className={`d-flex p-1 align-items-center ${index !== 0 && "border-top"}`} key={index}
                    >
                        <div className="me-3" style ={{flexBasis:'200px', textAlign: 'left'}}>{item.name}</div>
                        <div className= "me-1" style ={{flexBasis:'36px', textAlign: 'left'}}>{item.amount > 0 && item.amount}</div>
                        <div className= "me-2" style ={{textAlign: 'right'}}>{item.amount > 0 && item.unit}</div>

                        {deleteButton && (
                        <button
                            type = "button"
                            className="btn btn-sm ms-auto p-0 d-flex align-items-center justify-content-center"
                            style={{ width: "16px", height: "16px"}}
                            onClick={() => onDelete(item.id)}
                        >
                            <i className="bi bi-x fs-6 text-danger"></i>
                        </button> 
                    )}
                    </li>
                ))}
            </ul>
        </div>
    );
}