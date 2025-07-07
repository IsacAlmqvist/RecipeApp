import { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function HomePageIngredients({listItems, onIngredientClicked, data, setData, isGuestMode}) {

    const [timers, setTimers] = useState({});

    const updateIngredientAmount = (id, newAmount) => {

        const exists = prev.shopping_list.some(item => item.id === id)

        if(exists) { // update amount of that ingredient in shopping list
            setData( prev => ({
                ...prev,
                shopping_list: prev.shopping_list.map(item =>
                    item.id === id ? {...item, amount: newAmount} : item
                )
            }));
        } else { // add new ingredient to shopping list
            setData( prev => ({
                ...prev,
                shopping_list: [...prev.shopping_list, {id: id, amount: newAmount}]
            }));
        }

        if(timers[id]) clearTimeout(ingredientTimers[id]);

        const timerId = setTimeout(() => {
            if(!isGuestMode){
                try {
                    if(newAmount === 0) {
                        deleteDoc(doc(db, "shopping_list", id.toString()))
                    } else {
                        setDoc(doc(db, "shopping_list", id.toString()), 
                            {id, amount: newAmount},
                            {merge: True});
                    }
                } catch (error) {
                    console.error("could not access database to update shopping list");
                }
            }
        }, 2000);

        setTimers(prev => ({...prev, [id]: timerId}));
    }

    return (
        <div style={{margin: '0 auto'}} className="mt-4">
            <ul className = "list-group d-flex">
                {listItems.map((item) => (
                    <li
                        key={item.id}
                        className={"list-group-item d-flex"}
                        onClick={() => {onIngredientClicked(item.id);}}
                    >
                        <div className="me-3" style ={{textAlign: 'left'}}>{item.name}</div>

                        <form>
                            <div>
                                <input
                                    name="amount"
                                    type="number"
                                    className="form-control"
                                    value={data.shopping_list.find(i => i.id === item.id)?.amount || ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => updateIngredientAmount(item.id, Number(e.target.value))}
                                    style={{width: '80px', textAlign: 'center', padding: '4px 0'}}
                                />
                            </div>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    );
}