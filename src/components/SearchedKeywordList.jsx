export default function SearchedKeywordList({listItems, onSelectItem}) {

    return (
        <div style={{margin: '0 auto'}} className="mt-0">
            <ul className = "list-group d-flex">
                {listItems.map((item) => (
                    <li
                        key={item.id}
                        className="list-group-item"
                        onClick={() => {onSelectItem(item.id);}}
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item.keyword}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}