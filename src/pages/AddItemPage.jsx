import { useState } from "react";
import Toggle from "../components/Toggle";
import IngredientForm from "../components/IngredientForm";
import RecipeForm from "../components/RecipeForm";

import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function AddItemPage({data, setData, isGuestMode}) {

    const addFoodDB = async (food) => {
        if(!isGuestMode) await setDoc(doc(db, "foods", food.id.toString()), food);
    };

    const addIngredientDB = async (ingredient) => {
        if(!isGuestMode) await setDoc(doc(db, "ingredients", ingredient.id.toString()), ingredient);
    };

    const addFoodIngredientDB = async (relations) => {
        if(!isGuestMode) {
            await Promise.all(relations.map((item) => (
                setDoc(doc(db, "food_ingredients", item.id.toString()), item)
            )))
        }
    };

    const [toggleIndex, setToggleIndex] = useState(0);

    const onToggleClick = (index) => {
        setToggleIndex(index)
    }

    // TODO: if item name exists already, replace it
    // currently, nothing happens if name exists
    const addToIngredients = (itemToAdd) => {

        const newCals = parseFloat(itemToAdd.cals) || 0;
        const newId = Math.max(...data.ingredients.map(item => item.id), 0) + 1;
        const newName = itemToAdd.name.charAt(0).toUpperCase() + itemToAdd.name.slice(1);
        const newItem = {id: newId, unit: itemToAdd.unit, category: itemToAdd.category, name: newName, cals: newCals};

        if(data.ingredients.find(i => i.name === itemToAdd.name)){
            console.log(newItem.name +" finns redan");
            return -1;
        }
        else {
            // add to code DB
            setData(
                prev => ({
                ...prev,
                ingredients: [...prev.ingredients, newItem]
            }));
            // add to real DB
            addIngredientDB(newItem).catch((err) => 
                console.log("could not add ingredient to database", err)
            );

        }

        return newId;

    }

    const addToRecipes = (itemToAdd) => {

        const newId = Math.max(...data.foods.map(item => item.id || 0), 0) + 1;
        const newName = itemToAdd.name.charAt(0).toUpperCase() + itemToAdd.name.slice(1);
        const newRecipe = {id: newId, name: newName, 
                description: itemToAdd.description, portions: itemToAdd.portions};

        if(data.foods.find(i => i.name === itemToAdd.name)){
            console.log(itemToAdd.name +" finns redan");
            return;
        }

        const newIngredients = itemToAdd.ingredients.map((ingredient, index) =>({
            id: Math.max(...data.food_ingredients.map(item => item.id || 0), 0) + 1 + index,
            food_id: newId,
            ingredient_id: ingredient.id,
            amount: ingredient.amount
        }));

        // add to code DB
        setData( prev => ({
            ...prev,
            foods: [...prev.foods, newRecipe],
            food_ingredients: [...prev.food_ingredients, ...newIngredients]
        }));

        // add to real DB
        addFoodDB(newRecipe).catch((err) => 
            console.log("could not add recipe to database", err)
        );
        addFoodIngredientDB(newIngredients).catch((err) => 
            console.log("could not add recipe-relation to database", err)
        );

    }

    return (
        <>
            <Toggle toggleIndex={toggleIndex} onToggleClick={onToggleClick} />
            { toggleIndex === 0 ?
                <RecipeForm data={data} onAddRecipe={addToRecipes} onAddIngredient={addToIngredients}/>
                    :
                <div className="mt-4">
                <IngredientForm onAddData={addToIngredients} />
                </div>
            }   
        </>
    );
}