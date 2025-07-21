import { useState } from 'react';
import Toggle from '../components/Toggle';
import RecipePage from '../components/RecipePage';
import IngredientPage from '../components/IngredientPage';
import SearchBar from '../components/SearchBar';
import HomePageIngredients from '../components/HomePageIngredients';
import HomePageRecipes from '../components/HomePageRecipes';

export default function HomePage({data, setData, isGuestMode}) {
    
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [toggleIndex, setToggleIndex] = useState(0);
    const [showRecipe, setShowRecipe] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    let listItems = toggleIndex === 0 ? data.foods : data.ingredients;
    
    if(searchInput !== '') {
        listItems = listItems.filter(item => item.name.toLowerCase()
            .includes(searchInput.toLowerCase()))
    }

    const handleListItemClicked = (itemId) => {
        setSelectedIndex(itemId);
        toggleIndex === setShowRecipe(true);
    }

    function onToggleClick (index) {

        toggleIndex === index || setSelectedIndex(-1);

        setToggleIndex(index);
    }

    return (
        <>
            {
                showRecipe ? 
                    toggleIndex === 0 ? 
                        <RecipePage data = {data} itemId = {selectedIndex} />
                    :
                        <IngredientPage data = {data} itemId = {selectedIndex}/>
                :
                <>
                    <Toggle toggleIndex={toggleIndex} onToggleClick={onToggleClick} />
                    <div className="my-4">
                        <SearchBar input={searchInput} setInput={setSearchInput} />
                    </div>
                    <div style={{width: '90%', margin: '0 auto'}}>
                        { toggleIndex == 0 ? 
                            <HomePageRecipes listItems = {listItems} onRecipeClicked = {handleListItemClicked} 
                                data = {data} setData = {setData} isGuestMode = {isGuestMode}/>
                            : <HomePageIngredients listItems = {listItems} onIngredientClicked = {handleListItemClicked} 
                                data = {data} setData = {setData} isGuestMode = {isGuestMode}/>}
                    </div>
                </>
            }
        </>
    );
}