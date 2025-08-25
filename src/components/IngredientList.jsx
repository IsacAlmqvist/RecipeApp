export default function IngredientList({listItems = [], deleteButton = false, onDelete = () => {}, onToggle, inShoppingList = false, onMarkedDone, shoppingListData}) {

    return (
        <div className="mb-1">
            <ul className = "list-group">
                {onToggle && (
                    <p style={{marginLeft: '260px',width: '60px', fontSize: '9px', marginBottom: '0px', marginTop:'-20px'}}>
                        <i>exludera från inköpslista</i>
                    </p>
                )}
                {listItems.map((item, index) => (
                    <li
                        className={`d-flex p-1 align-items-center ${index !== 0 && "my-list-border"}`} key={index} style={{fontSize: '15px'}}
                    >
                        <div className="me-3" style ={{flexBasis:'150px', textAlign: 'left'}}>{item.name}</div>
                        <div className= "me-1" style ={{flexBasis:'36px', textAlign: 'left'}}>{item.amount > 0 && item.amount}</div>
                        <div className= "me-2" style ={{flexBasis: '30px', textAlign: 'left'}}>{item.amount > 0 && item.unit}</div>

                        {inShoppingList && (
                            <div
                                onClick={() => onMarkedDone(item.id)}
                                style={{
                                    marginLeft: 'auto',
                                    marginRight: '8px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    backgroundColor: !shoppingListData.find(i => i.id === item.id).markedDone ? 'transparent' : 'grey',
                                    border: '1px solid black'
                                }}
                            />
                        )}

                        {onToggle && (
                            <div
                                onClick={() => onToggle(item.id)}
                                style={{
                                    marginLeft: '30px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    backgroundColor: item.addToShoppingList ? 'transparent' : 'grey',
                                    border: '1px solid black'
                                }}
                            />
                        )}

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