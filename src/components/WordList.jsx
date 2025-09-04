export default function WordList({listItems = [], onDelete}) {

    return (
        <div className="mb-1">
            <ul className = "list-group">
                {listItems.map((item, index) => (
                    <li
                        key={index}
                        className={`d-flex p-1 align-items-center ${index !== 0 && "border-top"}`}
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item}</div>

                        <button
                            type = "button"
                            className="btn btn-sm ms-auto p-0 d-flex align-items-center justify-content-center"
                            style={{ width: "16px", height: "16px", border:"none", backgroundColor:"transparent"}}
                            onClick={() => onDelete(index)}
                        >
                            <i className="bi bi-x fs-5 text-danger"></i>
                        </button> 
                    </li>
                    
                ))}
            </ul>
        </div>
    );
}