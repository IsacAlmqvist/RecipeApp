import { useState } from 'react';
import FoodList from '../components/FoodList';
import Toggle from '../components/Toggle';
import RecipePage from '../components/RecipePage';
import SearchBar from '../components/SearchBar';

export default function HomePage({data}) {

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
                    <RecipePage data = {data} itemId = {selectedIndex} />
                :
                <>
                    <Toggle toggleIndex={toggleIndex} onToggleClick={onToggleClick} />
                    <div className="my-4">
                        <SearchBar input={searchInput} setInput={setSearchInput} />
                    </div>
                    <div style={{width: '90%', margin: '0 auto'}}>
                        <FoodList listItems = {listItems} selectedIndex={selectedIndex} onSelectItem = {handleListItemClicked} />
                    </div>
                </>
            }
        </>
    );
}