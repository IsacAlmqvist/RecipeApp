import IngredientList from "../components/IngredientList";
import { useState, useEffect } from "react";
import SearchedIngredientList from "../components/SearchedIngredientList";

import { db } from "../firebase";
import { collection, doc, getDocs, deleteDoc, setDoc } from "firebase/firestore";

export default function ShoppingListPage({data, setData, isGuestMode}) {

    const updateAllIngredientsWithCategory = async () => {
        const updatedIngredients = data.ingredients.map(ingredient => ({
            ...ingredient,
            category: ingredient.category || "övrigt"
        }));

        for (const ingredient of updatedIngredients) {
            await setDoc(doc(db, "ingredients", ingredient.id.toString()), ingredient, { merge: true });
        }

        console.log("All ingredients updated with category.");
    };

    // useEffect(() => {
    //     updateAllIngredientsWithCategory();
    // }, []);

    const [selectedIngredient, setSelectedIngredient] = useState(-1);
    const [ingredientAmount, setIngredientAmount] = useState('');
    const [amountFieldFocused, setAmountFieldFocused] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState('g');
    const [selectedCetegory, setSelectedCategory] = useState('kolonial');
    const [selectedCals, setSelectedCals] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const [timers, setTimers] = useState({});

    let searchItems = data.ingredients;
    
    if(searchInput !== '') {
        searchItems = searchItems.filter(item => item.name.toLowerCase()
            .includes(searchInput.toLowerCase()))
    }

    const checkSearch = () => {
        const foundIngredient = data.ingredients.find(i => i.name.toLowerCase() === searchInput.toLowerCase());
        if(foundIngredient) {setSelectedIngredient(foundIngredient.id); setSearchInput('');}
    }

    const handleIngredientClicked = (itemId) => {
        setSelectedIngredient(itemId);
        setSearchInput('');
        setAmountFieldFocused(false);
    }

    const handleAddIngredientFinal = () => {

        if(searchInput === '' && selectedIngredient === -1) return;

        let indexToUpdate = selectedIngredient;

        if(indexToUpdate === -1) {
            indexToUpdate = addToIngredients({name: searchInput, unit: selectedUnit, category: selectedCetegory});
        } 

        // add to shopping list or adjust amount in shopping list
        updateIngredientAmount(indexToUpdate, Number(ingredientAmount));

        setIngredientAmount('');
        setSelectedUnit('g');
        setSelectedCategory('kolonial');
        setSelectedIngredient(-1);
        setSearchInput('');
        setSelectedCals('');
        setAmountFieldFocused(false);
    }

    const addToIngredients = (itemToAdd) => {

        const newCals = parseFloat(itemToAdd.cals) || 0;
        const newId = Math.max(...data.ingredients.map(item => item.id), 0) + 1;
        const newName = itemToAdd.name.charAt(0).toUpperCase() + itemToAdd.name.slice(1);
        const newItem = {id: newId, unit: itemToAdd.unit, category: itemToAdd.category, name: newName, cals: newCals};

        // add to code DB
        setData(
            prev => ({
            ...prev,
            ingredients: [...prev.ingredients, newItem]
        }));
        // add to real DB
        addIngredientDB(newItem).catch((err) => 
            console.log("could not add new ingredient to database", err)
        );

        return newId;
    }

    const addIngredientDB = async (ingredient) => {
        if(!isGuestMode) await setDoc(doc(db, "ingredients", ingredient.id.toString()), ingredient);
    };
    
    const updateIngredientAmount = (id, newAmount) => {

        const exists = data.shopping_list.find(item => item.id === id);
        const finalAmount = exists ? exists.amount + newAmount : newAmount;

        if(exists) { // update amount of that ingredient in shopping list
            setData( prev => ({ 
                ...prev,
                shopping_list: prev.shopping_list.map(item =>
                    item.id === id ? {...item, amount: finalAmount} : item
                )
            }));
        } else { // add new ingredient to shopping list
            setData( prev => ({
                ...prev,
                shopping_list: [...prev.shopping_list, {id: id, amount: finalAmount}]
            }));
        }

        if(timers[id]) clearTimeout(timers[id]);

        const timerId = setTimeout(() => {
            if(!isGuestMode){
                try {
                    if(finalAmount === 0) {
                        deleteDoc(doc(db, "shopping_list", id.toString()))
                    } else {
                        setDoc(doc(db, "shopping_list", id.toString()), 
                            {id, amount: finalAmount},
                            {merge: true});
                    }
                } catch (error) {
                    console.error("could not access database to update shopping list: ", error);
                }
            }
        }, 2000);

        setTimers(prev => ({...prev, [id]: timerId}));
    }

    const clearShoppingListDb = async () => {
        if(!isGuestMode) {
            const collectionRef = collection(db, "shopping_list");
            const snapshot = await getDocs(collectionRef);
            const deletePromises = snapshot.docs.map((docSnap) =>
                deleteDoc(doc(db, "shopping_list", docSnap.id))
            );
            await Promise.all(deletePromises);
            console.log("Deleted shopping list from database!");
        }
    }

    const clearShoppingList = () => {
        setData(prev => ({
            ...prev,
            shopping_list: []
        }));

        clearShoppingListDb();
    }

    const roundIngredient = (amount, unit) => {
        if(unit === 'g' || unit === 'ml') return Number(parseFloat(amount).toPrecision(2));
        if(unit === 'dl') return Number(parseFloat(amount).toPrecision(3));
        return Number(parseFloat(amount).toPrecision(2));
    }

    const shoppingData = data.shopping_list;
    const shoppingList = [];

    for (const item of shoppingData) {
        const ingredientFound = data.ingredients.find(i => i.id === item.id);

        const roundedAmount = roundIngredient(item.amount, ingredientFound.unit)

        shoppingList.push({
            id: item.id,
            name: ingredientFound.name,
            amount: roundedAmount,
            unit: ingredientFound.unit,
            category: ingredientFound.category
        })
    }

    const categories = ['kolonial', 'frukt och grönt', 'kött och chark', 'mejeri', 'bröd', 'frys', 'övrigt'];

    return (
        <div style={{margin: "50px auto 0 auto", width: "90%"}}>
            
            <div className="mb-4" style={{position: 'relative'}}>
                <form className="d-flex">
                    <input
                        name="search"
                        type="text"
                        className="form-control"
                        value={searchInput}
                        onChange={e => {setSearchInput(e.target.value); setSelectedIngredient(-1); setAmountFieldFocused(false)}}
                        placeholder= {selectedIngredient === -1 ? "Lägg till" : data.ingredients.find(i => i.id === selectedIngredient).name}
                        onFocus = {() => setAmountFieldFocused(false)}
                        onBlur = {() => checkSearch()}
                    />
                    <div className="input-group" style ={{maxWidth: "160px"}}>
                        <input
                            name="ingredientAmount"
                            className="form-control"
                            type="number"
                            value={ingredientAmount}
                            onChange={(e) => setIngredientAmount(e.target.value)}
                            placeholder="Mängd"
                            onFocus={() => setAmountFieldFocused(true)}
                        />
                        {(selectedIngredient !== -1 && searchInput === '') ? (
                            <span className="input-group-text">
                                {data.ingredients.find(i => i.id === selectedIngredient)?.unit || ""}
                            </span>
                        ) : ( (ingredientAmount !== '' || amountFieldFocused) &&
                            <>
                                <select
                                    id="unit"
                                    name="unit"
                                    className="form-select input-group-text"
                                    style={{maxWidth: '50px', textAlign: 'left'}}
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                >
                                    <option value="g">g</option>
                                    <option value="st">st</option>
                                    <option value="ml">ml</option>
                                    <option value="dl">dl</option>
                                    <option value="msk">msk</option>
                                    <option value="tsk">tsk</option>
                                </select>
                            </>
                        )}
                        <button onClick={handleAddIngredientFinal} type="button" className="btn btn-primary">+</button>
                    </div>
                </form>
                    
                { selectedIngredient === -1 && ( ingredientAmount !== '' || amountFieldFocused ) && searchInput !== '' && (
                    <div style={{maxWidth: '160px', marginLeft: 'auto', position:'absolute', 
                                    top:'100%', right:'0', zIndex:'1000', boxShadow: '0 4px 8px rgba(0,0,0,0.1)',}}>
                        <select
                            id="category"
                            name="category"
                            className="form-select"
                            value={selectedCetegory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(c => 
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            )}
                        </select>
                        <input
                            id="cals"
                            name="cals"
                            type="number"
                            className="form-control"
                            value={selectedCals}
                            onChange={(e) => setSelectedCals(e.target.value)}
                            placeholder="Kalorier/100g"
                        />
                    </div>
                )}
            </div>

            {searchInput !== '' && 
                <div className="mb-4 mx-auto" style={{maxWidth: '86%'}}>
                    <SearchedIngredientList listItems = {searchItems} onSelectItem = {handleIngredientClicked} />
                </div>
            }
            {categories.map((category) => {
                const filtered = shoppingList.filter(i => i.category === category);
                if(filtered.length === 0) return null;

                return (
                    <div key = {category}>
                        <p className="mb-1 ps-2 mt-3"><b>{category.charAt(0).toUpperCase() + category.slice(1)}</b></p>
                        <IngredientList listItems={filtered} />
                    </div>
                );
            })}

            <button onClick={() => clearShoppingList()} className="btn btn-secondary mt-4">Rensa inköpslista</button>
        </div>
    );
}