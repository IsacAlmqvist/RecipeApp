import { db } from "../firebase";
import { setDoc, doc, deleteDoc } from "firebase/firestore";

import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

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

    const addKeywordsDB = async (newKeywords) => {
        if(!isGuestMode) {
            await Promise.all(newKeywords.map((item) => (
                setDoc(doc(db, "keywords", item.id.toString()), item)
            )))
        }
    };

    const addKeywordRelationsDB = async (relations) => {
        if(!isGuestMode) {
            await Promise.all(relations.map((item) => (
                setDoc(doc(db, "recipe_keywords", item.id.toString()), item)
            )))
        }
    };

    const deleteRelationsDb = async (ingredients, keywords) => {
        if(!isGuestMode) {
            await Promise.all(ingredients.map((item) => (
                deleteDoc(doc(db, "food_ingredients", item.toString()))
            )))
            await Promise.all(keywords.map((item) => (
                deleteDoc(doc(db, "recipe_keywords", item.toString()))
            )))
        }
    };

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

    const addToRecipes = (itemToAdd, isEditing, existingId) => {

        let ingredientIdsToDelete = [];
        let keywordIdsToDelete = [];
        let ingredientsToUpdate = [];
        let keywordsToUpdate = [];
        if(isEditing) {

            let oldIngredients = data.food_ingredients.filter(i => i.food_id === existingId);
            let oldKeywords = data.recipe_keywords.filter(i => i.recipe_id === existingId);

            oldIngredients.forEach((ingredient) => {
                let foundIngredient = itemToAdd.ingredients.find(i => i.id === ingredient.ingredient_id);
                if(foundIngredient) {
                    ingredientsToUpdate.push({relationId: ingredient.id, ingredientId: ingredient.ingredient_id});
                } else {
                    ingredientIdsToDelete.push(ingredient.id);
                }
            })
            oldKeywords.forEach((kw) => {
                let foundKeyword = itemToAdd.keywords.find(i => i === kw.keyword);
                if(foundKeyword) {
                    keywordsToUpdate.push({relationId: kw.id, keywordId: kw.keyword_id});
                } else {
                    keywordIdsToDelete.push(kw.id);
                }
            })

            // clear all existing relations 
            setData(prev => ({
                ...prev,
                foods: prev.foods.filter(i => i.id !== existingId),
                food_ingredients: prev.food_ingredients.filter(i => i.food_id !== existingId),
                recipe_keywords: prev.recipe_keywords.filter(i => i.recipe_id !== existingId)
            }))
        }
        
        const newId = isEditing ? existingId : (Math.max(...data.foods.map(item => item.id || 0), 0) + 1);
        const newName = itemToAdd.name.charAt(0).toUpperCase() + itemToAdd.name.slice(1);
        const newRecipe = {id: newId, name: newName, 
                description: itemToAdd.description, portions: itemToAdd.portions};

        if(!isEditing && data.foods.find(i => i.name === itemToAdd.name)){
            console.log(itemToAdd.name +" finns redan");
            return;
        }

        const newIngredients = itemToAdd.ingredients.map((ingredient, index) =>{

            const existingRelation = ingredientsToUpdate.find(u => u.ingredientId === ingredient.id);

            return {
                id: existingRelation ? existingRelation.relationId : (Math.max(...data.food_ingredients.map(item => item.id || 0), 0) + 1 + index),
                food_id: newId,
                ingredient_id: ingredient.id,
                amount: ingredient.amount,
                addToShoppingList: ingredient.addToShoppingList
            }
        });

        const newKeywords = [];
        const newKeywordRelations = [];

        itemToAdd.keywords.forEach((word, index) => {
            const existingKeyword = data.keywords.find(k => k.keyword === word);

            let keywordId;
            if(existingKeyword) {
                keywordId = existingKeyword.id;
            } else {
                keywordId = Math.max(...data.keywords.map(k => k.id || 0), 0) + 1 + newKeywords.length;
                newKeywords.push({id: keywordId, keyword: word});
            }

            const oldRelation = keywordsToUpdate.find(kw => kw.keywordId === keywordId);

            newKeywordRelations.push({
                id: oldRelation ? oldRelation.id : Math.max(...data.recipe_keywords.map(rk => rk.id ||0), 0) + 1 + index,
                recipe_id: newId,
                keyword_id: keywordId 
            })
        })

        // add to code DB
        setData( prev => ({
            ...prev,
            foods: [...prev.foods, newRecipe],
            food_ingredients: [...prev.food_ingredients, ...newIngredients],
            recipe_keywords: [...prev.recipe_keywords, ... newKeywordRelations],
            keywords: [...prev.keywords, ...newKeywords]
        }));

        if(isEditing) {
            deleteRelationsDb(ingredientIdsToDelete, keywordIdsToDelete).catch((err) =>
                console.log("could not delete relations", err)
            );
        }

        console.log(...newKeywordRelations);

        // add to real DB
        addFoodDB(newRecipe).catch((err) => 
            console.log("could not add recipe to database", err)
        );
        addFoodIngredientDB(newIngredients).catch((err) => 
            console.log("could not add recipe-relations to database", err)
        );
        addKeywordsDB(newKeywords).catch((err) => 
            console.log("could not add keywords to database", err)
        );
        addKeywordRelationsDB(newKeywordRelations).catch((err) => 
            console.log("could not add keyword-relations to database", err)
        );
    }

    const location = useLocation();

    return (
        <>
            <div className="text-center mt-3">
                <ul className="list-group list-group-horizontal d-inline-flex">
                    <li className={
                        location.pathname.endsWith("/recipe")
                        ? "list-group-item active"
                        : "list-group-item"
                    }>
                        <Link
                        to="recipe"
                        className="text-decoration-none text-reset"
                        >
                        Recept
                        </Link>
                    </li>
                    <li className={
                        location.pathname.endsWith("/ingredient")
                        ? "list-group-item active"
                        : "list-group-item"
                    }>
                        <Link
                        to="ingredient"
                        className="text-decoration-none text-reset"
                        >
                        Ingrediens
                        </Link>
                    </li>
                </ul>
            </div>

            <Outlet context={{data, addToRecipes, addToIngredients}}/>
        </>
    );
}