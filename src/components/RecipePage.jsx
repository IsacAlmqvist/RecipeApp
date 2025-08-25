import IngredientList from "./IngredientList";
import { useState, useRef, useEffect } from "react";

import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function RecipePage({data, setData, isGuestMode}) {

    const { id } = useParams();
    const itemId = parseInt(id, 10);

    const recipe = data.foods.find(f => f.id === itemId);

    const [showMenu, setShowMenu] = useState(false);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);

    const ingreientList = data.food_ingredients
        .filter(fi => fi.food_id === itemId)
        .map(fi => {
            const ingredient = data.ingredients.find(i => i.id === fi.ingredient_id);
            return {
                name: ingredient.name,
                unit: ingredient.unit,
                amount: fi.amount
            }
        });
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;

    const editRecipe = () => {
        navigate(`/addItem/edit-recipe/${recipe.id}`)
    }

    const deleteRecipe = () => {
        
        const idToDelete = recipe.id;

        setData(prev => ({
            ...prev,
            foods: prev.foods.filter(i => i.id !== idToDelete),
            food_ingredients: prev.food_ingredients.filter(i => i.food_id !== idToDelete),
            recipe_keywords: prev.recipe_keywords.filter(i => i.recipe_id !== idToDelete),
            planned_food: prev.planned_food.filter(i => i.id !== idToDelete)
        }));

        const relationIds = data.food_ingredients.filter(i => i.food_id === idToDelete).map(i => i.id);
        const keywordIds = data.recipe_keywords.filter(i => i.recipe_id === idToDelete).map(i => i.id);

        if(!isGuestMode) deleteRecipeDB(idToDelete, relationIds, keywordIds);

        navigate("/");
    }

    const deleteRecipeDB = async (recipeId, relationIds, keywordIds) => {
        const deletes = [
            deleteDoc(doc(db, "foods", recipeId.toString())),
            ...relationIds.map(id => deleteDoc(doc(db, "food_ingredients", id.toString()))),
            ...keywordIds.map(id => deleteDoc(doc(db, "recipe_keywords", id.toString()))),
            deleteDoc(doc(db, "planned_food", recipeId.toString()))
        ];

        await Promise.all(deletes)
    }

    const ref = useRef();

    useEffect(() => {
        function handleClickOutside(e) {
            if(ref.current && !ref.current.contains(e.target)) {
                setShowMenu(false);
                setShowDeletePrompt(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGoBack = () => {
        if(from === "notHome") {
            navigate("/plannedFood");
        } else {
            navigate("/");
        }
    }

    if(!recipe) return <></>;

    return (
        <>
            <div className="d-flex" style={{width:'90%', margin: '20px auto 0 auto'}}>
                <button type="button" onClick={() => handleGoBack()} 
                        className="btn btn-sm rounded-circle btn-outline-dark me-auto d-flex align-items-center justify-content-center"
                        style={{width: '32px', height:'32px', paddingRight:'10px'}}>
                    <i className="bi bi-chevron-left fs-6"></i>
                </button>
                <div style={{position:'relative'}}>
                    <button type="button" onClick={() => setShowMenu(true)} 
                        className="btn btn-sm rounded-circle ms-auto btn-outline-dark d-flex align-items-center justify-content-center"
                        style={{width: '32px', height:'32px'}}>
                        <i className="bi bi-three-dots fs-5"></i>
                    </button>

                    {showMenu && 
                        <ul ref={ref} className="list-group" style={{width: '156px', marginLeft: 'auto', position:'absolute', fontSize:'20px', 
                                    top:'100%', right:'0', zIndex:'1000', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'}}>
                            <li className="list-group-item d-flex align-items-center" style={{height: '50px'}} onClick={editRecipe}>
                                Redigera
                            </li>
                            { showDeletePrompt ? (
                                <li className="list-group-item d-flex" style={{height: '50px'}}>
                                    <div className= "text-danger text-align-left">
                                        Säker?
                                    </div>
                                    <button 
                                        style={{borderRadius: '6px', border: '1px solid currentColor', width: '32px', height:'32px', margin: 'auto 4px auto 8px'}} 
                                        className="btn d-flex align-items-center justify-content-center"
                                        onClick={() => deleteRecipe(recipe.id)}
                                    >
                                        <i className="bi bi-check-lg fs-4 text-success"/>
                                    </button>
                                    <button 
                                        style={{borderRadius: '6px', border: '1px solid currentColor', width: '32px', height:'32px', margin: 'auto 0'}}
                                        onClick={() => {setShowMenu(false); setShowDeletePrompt(false)}}
                                        className="btn d-flex align-items-center justify-content-center"
                                    >
                                        <i className="bi bi-x-lg"/>
                                    </button>
                                </li>
                                ):(
                                <li className="list-group-item text-danger" style={{height:'50px'}} onClick={() => setShowDeletePrompt(true)}>
                                    Radera
                                </li> )
                                 
                            }
                        </ul>
                    }
                </div>
            </div>

            <h1 className="text-center mt-4 mb-4">
            {recipe.name}
            </h1>

            <div style={{ width: '90%', margin: '0 auto'}}>
                <IngredientList listItems={ingreientList} />
            </div>

            {/* <ul className="list-group">
                {recipe.description.map((item, index) => (
                    <li className="list-group-item" key={index}>
                        {item}
                    </li>
                ))}
            </ul> */}
        </>
    );
}