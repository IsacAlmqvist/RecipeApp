import { useState } from "react";

import { db } from "../firebase";
import { setDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

export default function HomePageRecipes({listItems, onRecipeClicked, data, setData, isGuestMode}) {

    const addPlannedFoodDb = async (newPlanned) => {
        if(!isGuestMode) await setDoc(doc(db, "planned_food", newPlanned.id.toString()), newPlanned)
    }

    const deletePlannedFoodDb = async (id) => {
        try {
            await deleteDoc(doc(db, "planned_food", id.toString()));
        } catch (error) {
            console.error("error deleting planned food");
        }
    }

    const adjustPortionsDb = async (id, portions) => {
        if (!isGuestMode) {
            const docRef = doc(db, "planned_food", id.toString());
            await updateDoc(docRef, { portions });
        }
    };

    const addPlannedFood = (id) => {
        const chosenRecipe = data.foods.find(i => i.id = id);
        const newPlanned = {id: Math.max(...data.planned_food.map(item => item.id), 0)  + 1, recipe_id: id, portions: chosenRecipe.portions};

        setData( prev => ({
            ...prev,
            planned_food: [...prev.planned_food, newPlanned]
            })
        );
        addPlannedFoodDb(newPlanned);
    } 

    const adjustPortions = (id, increment) => {
        const newPortions = data.planned_food.find(i => i.id === id).portions + increment;

        if(newPortions === 0) {
            deletePlannedFoodDb(id);
            setData( prev => ({
                ...prev,
                planned_food: prev.planned_food.filter(item => item.id !== id)
            }));
        } 

        else {
            setData(prev => ({
                ...prev,
                planned_food: prev.planned_food.map(item => 
                    item.id === id ? {...item, portions: newPortions} : item
                )
            }));

            adjustPortionsDb(id, newPortions);
        }
    } 

    return (
        <div style={{margin: '0 auto'}} className="mt-4">
            <ul className = "list-group d-flex">
                {listItems.map((item) => (
                    <li
                        key={item.id}
                        className={"list-group-item d-flex"}
                        onClick={() => {onRecipeClicked(item.id);}}
                    >
                    <div className="me-3" style ={{textAlign: 'left'}}>{item.name}</div>
                        {data.planned_food.find(i => i.id === item.id) ? 
                            (
                                <form>
                                    <div style={{display: 'flex'}}>
                                        <button type="button" className="btn btn-sm btn-outline-secondary" 
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                adjustPortions(item.id, -1);}}
                                        >
                                            -
                                        </button>
                                        <input
                                            name="portions"
                                            type="number"
                                            className="form-control"
                                            value={data.planned_food.find(i => i.id === item.id).portions || ''}
                                            readOnly
                                            style={{width: '40px', textAlign: 'center', padding: '4px 0'}}
                                        />
                                        <button type="button" className="btn btn-sm btn-outline-secondary" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                adjustPortions(item.id, 1);}}
                                        >
                                            +
                                        </button>
                                    </div>
                                </form>
                            ) 
                            :
                            (<button onClick={(e) => {
                                e.stopPropagation();
                                addPlannedFood(item.id);
                            }}
                            className="btn btn-secondary btn-sm ms-auto" type="button" >+</button>)
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}