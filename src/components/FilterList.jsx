export default function FilterList({listItems, selectedFilters, toggleItemMarked}) {

    return (
        <div style={{position:'absolute', zIndex:'1000', top:'100%', right:'0', width:'100%', margin:'0 auto'}} className="mt-0">
            <ul className = "list-group d-flex">
                {listItems.map((item) => {
                    const isSelected = selectedFilters.includes(item.id);
                    return (
                        <li
                            key={item.id}
                            className="list-group-item d-flex"
                            onClick={() => {toggleItemMarked(item.id);}}
                            style={{paddingTop:'4px', paddingBottom:'4px', paddingLeft:'10px'}}
                        >
                            <div className="me-3" style ={{textAlign: 'left', fontSize: '14px'}}>{item.keyword}</div>
                            <input type="checkbox" checked={isSelected} readOnly style={{ pointerEvents: "none", textAlign:'right', marginLeft:'auto'}}/>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}