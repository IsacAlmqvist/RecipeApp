import { useEffect, useState } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Modal from "./Modal";
import SearchedIngredientList from "./SearchedIngredientList";
import WordList from "./WordList";
import SearchedKeywordList from "./SearchedKeywordList";

import { useOutletContext } from "react-router-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function RecipeForm() {

    const location = useLocation();
    const isEditing = location.pathname.includes("edit");
    const params = useParams();

    const navigate = useNavigate();

    const {data, addToRecipes, addToIngredients} = useOutletContext();

    const [selectedIngredient, setSelectedIngredient] = useState(-1);

    const [form, setForm] = useState({
        name: '',
        ingredients: [],
        description: [''],
        portions: 4,
        keywords: []
    })

    useEffect(() => {
        if(isEditing) {
            const recipeToEdit = data.foods.find(f => f.id === Number(params.id));
            if(!recipeToEdit) return;

            const recipeIngredients = data.food_ingredients
                .filter(fi => fi.food_id === recipeToEdit.id)
                .map(fi => {
                    const ingredient = data.ingredients.find(i => i.id === fi.ingredient_id);
                    return {
                        ...ingredient,
                        amount: fi.amount,
                        addToShoppingList: fi.addToShoppingList
                    }
                });
            const recipeKeywords = data.recipe_keywords
                .filter(rk => rk.recipe_id === recipeToEdit.id)
                .map(rk => {
                    const kw = data.keywords.find(k => k.id === rk.keyword_id);
                    return kw?.keyword || "";
                });
            
            setForm({
                name: recipeToEdit.name,
                ingredients: recipeIngredients,
                description: recipeToEdit.description,
                portions: recipeToEdit.portions,
                keywords: recipeKeywords,
            });
        }
    }, [isEditing, data, params.id]);
    
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
            amount: parseFloat(ingredientAmount) || 0, unit: newIngredientUnit, addToShoppingList: true};

        !form.ingredients.find(i => i.id === newIngredient.id) && 
            setForm(prev => ({...prev, ingredients: [...prev.ingredients, newIngredient]}));

        setIngredientAmount('');
        setSelectedIngredient(-1);
    }

    const onAddNewIngredient = (newIngredient) => {
        setShowIngredientForm(false);
        const newId = addToIngredients(newIngredient);

        if(newId !== -1) {
            setForm( prev => ({
                ...prev, ingredients: [...prev.ingredients, {
                    id: newId,
                    name: newIngredient.name,
                    amount: parseFloat(newIngredient.amount) || 0,
                    unit: newIngredient.unit,
                    addToShoppingList: true
                }]
            }));
        }

        setSearchInput('');
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

        const existingId = isEditing ? Number(params.id) : -1;

        addToRecipes(form, isEditing, existingId);

        if(isEditing) navigate(`/recipe/${params.id}`);
        setForm({name: '', ingredients: [], description: [''], portions: 4, keywords: []});
        setSelectedIngredient(-1);
    }

    const onAddNewClicked = () => {
        setShowIngredientForm(true);
    }

    const handleKeywordClicked = (id) => {
        let newKeyword = '';
        if(id === -1) {
            newKeyword = keywordSearch.charAt(0).toUpperCase() + keywordSearch.slice(1);
        } else {
            const kw = data.keywords.find(k => k.id === id).keyword;
            newKeyword = kw.charAt(0).toUpperCase() + kw.slice(1);
        }
        if(!form.keywords.includes(newKeyword)) setForm(prev => ({...prev, keywords: [...prev.keywords, newKeyword]}));
        setKeywordSearch('');
    }

    const deleteIngredient = (index) => {
        setForm((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter(i => i.id !== index)
        }));
    }

    const addStep = () => {
        setForm(prev => ({
            ...prev,
            description: [...prev.description, '']
        }));
    }

    const deleteStep = (index) => {
        if(form.description.length === 1) {
            setForm(prev => ({
                ...prev,
                description: ['']
            }));
        } else {
            setForm(prev => ({
                ...prev,
                description: prev.description.filter((_,i) => i !== index)
            }));
        }
    }

    const handleStepChange = (index, value) => {
        setForm(prev => ({
            ...prev,
            description: prev.description.map((text,i) => 
                i === index ? value : text
            )
        }))
    }

    const deleteKeyword = (index) => {
        setForm(prev => ({
            ...prev,
            keywords: prev.keywords.filter((_,i) => i !== index)
        }));
    }

    const handleToggleIncludeShoppingList = (ingredientId) => {
        setForm(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ingredient) => 
                ingredient.id === ingredientId
                ? {...ingredient, addToShoppingList: !ingredient.addToShoppingList}
                : ingredient
            )
        }))
    }

    return (
        <>
        {isEditing &&
            <button type="button" onClick={() => navigate(`/recipe/${params.id}`)} 
                className="btn btn-sm rounded-circle btn-outline-dark me-auto d-flex align-items-center justify-content-center"
                style={{width: '32px', height:'32px', paddingRight:'10px', position:'fixed'}}
            >
                <i className="bi bi-chevron-left fs-6"></i>
            </button>
        }
        <form 
            style={{ width: '90%', margin: '0 auto'}} className="mt-4"
            autoComplete="off"
        >
            <div className="mb-4">
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Namn"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="search" className="form-label">
                    Ingredienser
                </label>

                {form.ingredients.length > 0 && <IngredientList listItems={form.ingredients} 
                        deleteButton={true} onDelete={deleteIngredient} onToggle = {handleToggleIncludeShoppingList}/>}
                
                <div className="d-flex">
                    <input
                        id="search"
                        name="search"
                        type="text"
                        className="form-control"
                        value={searchInput}
                        onChange={e => {setSearchInput(e.target.value); setSelectedIngredient(-1)}}
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
                            readOnly={selectedIngredient === -1}
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

                    <button type="button" className="btn btn-primary" onClick={() => onAddNewClicked()}>
                        ➕ Lägg till ny
                    </button>
                </>
            }

            <div className="mb-4 mt-3">
                <label className="form-label fw-bold">
                    Steg:
                </label>
                {form.description.map((step, index) => (
                    <div className="d-flex align-items-center mb-2" key={index}>
                        <input
                            name="description"
                            type="text"
                            className="form-control"
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            placeholder={`Steg ${index + 1}`}
                        />
                        <button 
                            type = "button"
                            className="btn btn-sm ms-2 p-0 d-flex align-items-center justify-content-center"
                            style={{ width: "20px", height: "19px"}}
                            onClick={() => deleteStep(index)}
                        >
                            <i className="bi bi-x fs-6 text-danger"></i>
                        </button>
                    </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-secondary mt-1" onClick={addStep}>
                    + Lägg till steg
                </button>
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

                {form.keywords.length > 0 && <WordList listItems={form.keywords} onDelete={deleteKeyword} />}
                
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

            <button type="button" onClick={(e) => {e.preventDefault(); handleSubmit();}} className="mt-4 mb-2 btn btn-primary">{isEditing ? "Spara" : "Lägg till"}</button>

        </form>

        {showIngredientForm && (

            <Modal className="" onClose={() => setShowIngredientForm(false)}>
                <IngredientForm initialName = {searchInput} 
                    addToIngredients={onAddNewIngredient}
                    includeAmount={true}/>
            </Modal>
            )
        }

        </>
    );
}