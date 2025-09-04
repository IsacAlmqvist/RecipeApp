import { useNavigate } from "react-router-dom";

export default function PlannedRecipeList ({listItems = [], plannedFoodData, onMarkedDone})  {

    const navigate = useNavigate();

    return (
        <div className="mt-2 mb-1">
            {listItems.length === 0? (<h2 style={{width:'90%', margin:'0 auto', marginBottom:'30px', marginTop:'20px'}}>Inget planerat ännu</h2>) : (
            <ul className = "list-group">
                {listItems.map((item, index) => (
                    <li
                        className={`d-flex p-1 align-items-center ${index !== 0 && "my-list-border"}`} 
                        key={index} 
                        style={{fontSize: '15px'}}
                        onClick = {() => navigate(`/recipe/${item.id}`, { state: { from: "notHome" }})}
                    >
                        <div className="me-3" style ={{flexBasis:'140px', textAlign: 'left'}}>{item.name}</div>
                        <div className= "me-1" style ={{flexBasis:'14px', textAlign: 'left'}}>{item.portions}</div>
                        <div className= "me-1" style ={{fontSize:'14px', flexBasis:'36px', textAlign: 'left'}}>Portioner</div>

                        <div
                            onClick={(e) => {e.stopPropagation(); onMarkedDone(item.id)}}
                            style={{
                                marginLeft: 'auto',
                                marginRight: '8px',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: !plannedFoodData.find(i => i.id === item.id).markedDone ? 'transparent' : 'grey',
                                border: '1px solid black'
                            }}
                        />
                    </li>
                ))}
            </ul> )}
        </div>
    );
}