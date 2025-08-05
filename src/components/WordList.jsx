export default function WordList({listItems = []}) {

    return (
        <div className="mb-1">
            <ul className = "list-group">
                {listItems.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex"
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}