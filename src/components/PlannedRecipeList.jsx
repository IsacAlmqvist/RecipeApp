import { useNavigate } from "react-router-dom";

export default function PlannedRecipeList ({listItems = []})  {

    const navigate = useNavigate();

    return (
        <div className="mt-2 mb-1">
            <ul className = "list-group">
                {listItems.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex"
                        onClick = {() => navigate(`/recipe/${item.id}`)}
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item.name}</div>
                        <div className= "ms-auto me-2" style ={{textAlign: 'right'}}>{item.portions}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}