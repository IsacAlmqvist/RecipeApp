import { useState } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Modal from "./Modal";
import SearchedIngredientList from "./SearchedIngredientList";
import WordList from "./WordList";
import SearchedKeywordList from "./SearchedKeywordList";

import { useOutletContext } from "react-router-dom";

export default function RecipeForm() {
    const {data, addToRecipes, addToIngredients} = useOutletContext();

    const [selectedIngredient, setSelectedIngredient] = useState(-1);

    const [form, setForm] = useState({
        name: '',
        ingredients: [],
        description: '',
        portions: 4,
        keywords: []
    })

    const [ingredientAmount, setIngredientAmount] = useState('');

    const [searchInput, setSearchInput] = useState('');

    const [showIngredientForm, setShowIngredientForm] = useState(false);

    const [keywordSearch, setKeywordSearch] = useState('');

    let listItems = data.ingredients;
    
    if(searchInput !== '') {
        listItems = listItems.filter(item => item.name.toLowerCase()
            .includes(searchInput.toLowerCase()))
    }

    const handleIngredientClicked = (itemId) => {
        setSelectedIngredient(itemId);
        setSearchInput('');
    }

    const handleAddIngredientFinal = () => {
        if(selectedIngredient === -1) {
            console.log("ingredient missing")
            return;
        }
        const tempIngredient = data.ingredients.find(i => i.id === selectedIngredient)
        const newIngredientName = tempIngredient.name;
        const newIngredientUnit = tempIngredient.unit || 'g';

        const newIngredient = { id: selectedIngredient, name: newIngredientName, 
            amount: parseFloat(ingredientAmount) || 0, unit: newIngredientUnit};

        !form.ingredients.find(i => i.id === newIngredient.id) && 
            setForm(prev => ({...prev, ingredients: [...prev.ingredients, newIngredient]}));

        setIngredientAmount('');
        setSelectedIngredient(-1);
    }

    const onAddNewIngredient = (newIngredient) => {
        setShowIngredientForm(false);
        const newId = addToIngredients(newIngredient)

        if(newId !== -1) {
            setForm( prev => ({
                ...prev, ingredients: [...prev.ingredients, {
                    id: newId,
                    name: newIngredient.name,
                    amount: parseFloat(newIngredient.amount) || 0,
                    unit: newIngredient.unit
                }]
            }));
        }

        setIngredientAmount('');
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm( prev => ({...prev, [name]: value}))
    }

    const handleSubmit = () => {

        if(!form.name) {
            console.log("saknas namn");
            return;
        }

        addToRecipes(form);

        setForm({name: '', ingredients: [], description: '', portions: 4, keywords: []});
        setSelectedIngredient(-1);
    }

    const onAddNewClicked = () => {
        setShowIngredientForm(true);
    }

    const handleKeywordClicked = (id) => {
        let newKeyword = '';
        if(id === -1) {
            newKeyword = keywordSearch.trim().toLowerCase();
        } else {
            newKeyword = data.keywords.find(k => k.id === id).keyword.trim().toLowerCase();
        }
        if(!form.keywords.includes(newKeyword)) setForm(prev => ({...prev, keywords: [...prev.keywords, newKeyword]}));
        setKeywordSearch('');
    }

    return (
        <>
        <form 
            style={{ width: '90%', margin: '0 auto'}} className="mt-3"
        >
            <div className="mb-4">
                <label htmlFor="name" className="form-label">
                    Namn
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="T.ex. pannkakor"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="search" className="form-label">
                    Ingredienser
                </label>

                {form.ingredients.length > 0 && <IngredientList listItems={form.ingredients} />}
                
                <div className="d-flex">
                    <input
                        id="search"
                        name="search"
                        type="text"
                        className="form-control"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder= {selectedIngredient === -1 ? "Sök" : data.ingredients.find(i => i.id === selectedIngredient).name}
                    />
                    <div className="input-group">
                        <input
                            name="ingredientAmount"
                            className="form-control"
                            type="number"
                            value={ingredientAmount}
                            onChange={(e) => setIngredientAmount(e.target.value)}
                            placeholder="Mängd"
                        />
                        {selectedIngredient !== -1 && (
                            <span className="input-group-text">
                                {data.ingredients.find(i => i.id === selectedIngredient)?.unit || ""}
                            </span>
                        )}
                    </div>
                    <button onClick={() => handleAddIngredientFinal()} type="button" className="btn btn-primary">+</button>
                </div>
            </div>

            {searchInput !== '' && 
                <>
                    <SearchedIngredientList listItems = {listItems} onSelectItem = {handleIngredientClicked} />

                    <button type="button" className="btn btn-primary mb-3" onClick={() => onAddNewClicked()}>
                        ➕ Lägg till ny
                    </button>
                </>
            }

            <div className="mb-4">
                <label htmlFor="description" className="form-label">
                    Beskrivning
                </label>
                <input
                    id="description"
                    name="description"
                    type="text"
                    className="form-control"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="beskriv hur man gör"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="portions" className="form-label">
                    Portioner
                </label>

                <div style={{display: 'flex'}}>
                    <button type="button" className="btn btn-sm btn-outline-secondary" 
                        onClick={() => setForm((prev) => 
                            ({ 
                                ...prev, portions: Math.max(prev.portions - 1)
                            })
                        )}
                    >
                        -
                    </button>
                    <input
                        id="portions"
                        name="portions"
                        type="number"
                        className="form-control"
                        value={form.portions}
                        readOnly
                        style={{width: '40px', textAlign: 'center', padding: '4px 0'}}
                    />
                    <button type="button" className="btn btn-sm btn-outline-secondary" 
                        onClick={() => setForm((prev) => 
                            ({ 
                                ...prev, portions: prev.portions + 1
                            })
                        )}
                    >
                        +
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="keywords" className="form-label">
                    Nyckelord
                </label>

                {form.keywords.length > 0 && <WordList listItems={form.keywords} />}
                
                <div className="d-flex">
                    <input
                        id="keywords"
                        name="keywords"
                        type="text"
                        className="form-control"
                        value={keywordSearch}
                        onChange={e => setKeywordSearch(e.target.value)}
                        placeholder= {"Lägg till nyckelord"}
                    />
                    
                    <button onClick={() => handleKeywordClicked(-1)} type="button" className="btn btn-primary">+</button>
                </div>
            </div>

            {keywordSearch !== '' && 
                <>
                    <SearchedKeywordList listItems = {data.keywords.filter(w => w.keyword.includes(keywordSearch.toLowerCase()))} onSelectItem = {handleKeywordClicked} />
                </>
            }

            <button onClick={() => handleSubmit()} className="mt-4 btn btn-primary">Lägg till</button>

        </form>

        {showIngredientForm && (

            <Modal className="" onClose={() => setShowIngredientForm(false)}>
                <IngredientForm initialName = {searchInput} 
                    onAddData={(form) => {onAddNewIngredient(form); setSearchInput('');}}
                    includeAmount={true}/>
            </Modal>
            )
        }

        </>
    );
}