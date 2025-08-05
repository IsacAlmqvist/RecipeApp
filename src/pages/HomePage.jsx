import { useState, useRef, useEffect } from 'react';
import RecipePage from '../components/RecipePage';
import SearchBar from '../components/SearchBar';
import HomePageRecipes from '../components/HomePageRecipes';
import FilterList from '../components/FilterList';

export default function HomePage({data, setData, isGuestMode}) {
    
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [toggleIndex, setToggleIndex] = useState(0);
    const [showRecipe, setShowRecipe] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [openFilters, setOpenFilters] = useState(false);

    let listItems = toggleIndex === 0 ? data.foods : data.ingredients;
    
    if(searchInput !== '') {
        listItems = listItems.filter(item => item.name.toLowerCase()
            .includes(searchInput.toLowerCase()))
    }

    const recipeKeywordMap = {}
    data.recipe_keywords.forEach(rel => {
        if(!recipeKeywordMap[rel.recipe_id]) {
            recipeKeywordMap[rel.recipe_id] = new Set();
        }
        recipeKeywordMap[rel.recipe_id].add(rel.keyword_id);
    });

    if(toggleIndex === 0 && selectedFilters.length > 0) {
        listItems = listItems.filter(item => {
                const keywords = recipeKeywordMap[item.id] || new Set();
                return selectedFilters.some(filterId => keywords.has(filterId)); 
            }
        );
    }

    const handleListItemClicked = (itemId) => {
        setSelectedIndex(itemId);
        toggleIndex === setShowRecipe(true);
    }

    function onToggleClick (index) {

        toggleIndex === index || setSelectedIndex(-1);

        setToggleIndex(index);
    }

    const ref = useRef();

    const toggleItemMarked = (id) => {
        setSelectedFilters((prev) => 
            prev.includes(id)
            ? prev.filter(item => item !== id)
            : [...prev, id]
        );
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if(ref.current && !ref.current.contains(e.target)) {
                setOpenFilters(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {
                showRecipe ? 
                    <RecipePage data = {data} itemId = {selectedIndex} />
                :
                <>
                    <div className="d-flex" style={{margin: '48px auto 0 auto', width:'90%'}} >
                        <div style={{flex:'1'}}>
                            <SearchBar input={searchInput} setInput={setSearchInput} />
                        </div>

                        {toggleIndex === 0 && 
                            <div ref={ref} style={{position:'relative', width:'120px'}}>
                                <button
                                    name="filter"
                                    className='formSelect input-group-text'
                                    onClick={() => setOpenFilters((prev) => (!prev))}
                                    style={{width: '100%'}}
                                >
                                Filter 
                                </button>
                                {openFilters && <FilterList listItems={data.keywords} selectedFilters={selectedFilters} toggleItemMarked={toggleItemMarked} /> }
                            </div>
                        }
                    </div>
                    <div style={{width: '90%', margin: '0 auto'}}>
                        <HomePageRecipes listItems = {listItems} onRecipeClicked = {handleListItemClicked} 
                            data = {data} setData = {setData} isGuestMode = {isGuestMode}/>
                    </div>
                </>
            }
        </>
    );
}