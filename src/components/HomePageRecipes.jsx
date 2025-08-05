import { useState } from "react";

import { db } from "../firebase";
import { setDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

export default function HomePageRecipes({listItems, onRecipeClicked, data, setData, isGuestMode}) {

    const [pendingPlanned, setPendingPlanned] = useState({});

    const addPlannedFoodDb = async (newPlanned) => {
        if(!isGuestMode) await setDoc(doc(db, "planned_food", newPlanned.id.toString()), newPlanned)
    }

    const deletePlannedFoodDb = async (id) => {
        if(!isGuestMode) {
            try {
                await deleteDoc(doc(db, "planned_food", id.toString()));
            } catch (error) {
                console.error("error deleting planned food");
            }
        }
    }

    const adjustPortionsDb = async (id, portions) => {
        if (!isGuestMode) {
            const docRef = doc(db, "planned_food", id.toString());
            await updateDoc(docRef, { portions });
        }
    };

    const overWriteShoppingListDb = async (items) => {
        if(!isGuestMode) {
            try {
                const promises = items.map(item => 
                    item.amount === 0
                        ? deleteDoc(doc(db, "shopping_list", item.id.toString()))
                        : setDoc(doc(db, "shopping_list", item.id.toString()), item, { merge: true })
                );
                await Promise.all(promises);
            } catch (error) {
                console.error("could not update shopping list: " + error);
            }
        }
    }

    const createShoppingList = (recipeId, portionsAdded) => {

        const ingredients = data.food_ingredients.filter(item => item.food_id === recipeId);

        const shoppingListCopy = [...data.shopping_list];

        const changedItems = [];

        const thisRecipe = data.foods.find(item => item.id === recipeId);

        for (const ing of ingredients) {
            const amountToAdd = (ing.amount / thisRecipe.portions) * portionsAdded;

            const foundItem = shoppingListCopy.find(item => item.id === ing.ingredient_id);

            if(foundItem) {
                const newAmount = foundItem.amount + amountToAdd;
                if(amountToAdd !== 0) {
                    foundItem.amount = newAmount < 0.01 ? 0 : newAmount;
                    changedItems.push({...foundItem});
                }
            } else {
                const newItem = {id: ing.ingredient_id, amount: Math.max(0, amountToAdd)}
                shoppingListCopy.push(newItem);
                changedItems.push(newItem);
            }
        }

        const cleanedShoppingList = shoppingListCopy.filter(item => item.amount > 0.01);

        setData(prev => ({
            ...prev,
            shopping_list: cleanedShoppingList
        }));

        overWriteShoppingListDb(changedItems);
    }

    const addPlannedFood = (id) => {

        if (pendingPlanned[id] === undefined) {
            console.log("the recipe was not in the pending list yet :(");
            return;
        }

        const newPlanned = {id: id, portions: pendingPlanned[id]};
        const alreadyPlanned = data.planned_food.find(i => i.id === id);
        const portionDiff = newPlanned.portions - (alreadyPlanned?.portions || 0);

        if(pendingPlanned[id] === 0) {
            if(!alreadyPlanned) {
                setPendingPlanned(prev => {
                    const copy = {...prev}
                    delete copy[id]
                    return copy
                });
                return;
            }
            deletePlannedFoodDb(id);
            setData( prev => ({
                ...prev,
                planned_food: prev.planned_food.filter(item => item.id !== id)
            }));

        } 
        else if(alreadyPlanned) {
            setData(prev => ({
                ...prev,
                planned_food: prev.planned_food.map(item => 
                    item.id === id ? {...item, portions: newPlanned.portions} : item
                )
            }));
            adjustPortionsDb(id, newPlanned.portions);
        }
        else {
            setData(prev => ({
                ...prev,
                planned_food: [...prev.planned_food, newPlanned]
            }));
            addPlannedFoodDb(newPlanned);
        }

        createShoppingList(id, portionDiff);

        setPendingPlanned(prev => {
            const copy = {...prev}
            delete copy[id]
            return copy
        });
    }

    const adjustPortions = (id, increment) => {
        const newPortions = pendingPlanned[id] + increment;
        if(newPortions < 0) return;
        setPendingPlanned(prev => ({
            ...prev,
            [id]: newPortions
        }))
    } 

    const startPlanningFood = (id) => {
        const chosenRecipe = data.foods.find(i => i.id === id);
        let portions = chosenRecipe.portions;

        const alreadyPlanned = data.planned_food.find(i => i.id === id);
        if(alreadyPlanned) portions = alreadyPlanned.portions;

        setPendingPlanned(prev => ({
            ...prev,
            [id]: portions
        }));
    };

    return (
        <div style={{margin: '0 auto'}} className="mt-4">
            <ul className = "list-group d-flex">
                {listItems.map((item) => (
                    <li
                        key={item.id}
                        className={"list-group-item d-flex"}
                        onClick={() => {onRecipeClicked(item.id);}}
                    >
                        <div style ={{textAlign: 'left'}}>{item.name}</div>
                        {pendingPlanned[item.id] !== undefined &&
                            (
                                <div className="d-flex ms-auto me-2">
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
                                        value={pendingPlanned[item.id]}
                                        readOnly
                                        style={{width: '25px', textAlign: 'center', padding: '4px 0'}}
                                        onClick={(e) => {e.stopPropagation();}}
                                    />
                                    <button type="button" className="btn btn-sm btn-outline-secondary" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            adjustPortions(item.id, 1);}}
                                    >
                                        +
                                    </button>
                                </div>
                            )} 
                            {pendingPlanned[item.id] === undefined ? (
                                data.planned_food.some(recipe => recipe.id === item.id) ? (
                                    (<button onClick={(e) => {
                                        e.stopPropagation();
                                        startPlanningFood(item.id);
                                    }}
                                    className="btn btn-secondary btn-sm ms-auto" type="button" 
                                    style={{width:'32px', height:'32px'}}
                                    >
                                        {data.planned_food.find(recipe => recipe.id === item.id).portions} 
                                    </button>)
                                ) 
                                    : 
                                (<button onClick={(e) => {
                                    e.stopPropagation();
                                    startPlanningFood(item.id);
                                }}
                                className="btn btn-secondary btn-sm ms-auto" type="button" 
                                style={{width:'32px', height:'32px'}}
                                >
                                    +
                                </button>)
                                ) 
                                    :
                                (
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    addPlannedFood(item.id);
                                }}
                                className="btn btn-secondary btn-sm" type="button" 
                                style={{width:'32px', height:'32px'}}
                                >
                                    <i className="bi bi-check"></i>
                                </button>
                                )
                            }
                    </li>
                ))}
            </ul>
        </div>
    );
}