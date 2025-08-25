import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddItemPage from './pages/AddItemPage';
import ShoppingListPage from './pages/ShoppingListPage';
import PlannedFoodPage from './pages/PlannedFoodPage';
import BottomNav from './components/BottomNav';
import Login from './components/Login';

// import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

import { onAuthStateChanged } from "firebase/auth"

import { useState, useEffect} from 'react';

import RecipePage from './components/RecipePage';
import RecipeForm from './components/RecipeForm';
import IngredientForm from './components/IngredientForm';

function AppLayout({ isGuestMode }) {

  /* TODO
    - when backing from recipe, go to plannedfoodpage if you came from there
    - edit recipes -DONE
    - edit ingredients, inside addIngredient, you can search for ingredient at the bottom and then edit from there
    - small thing: when you go back from receipe and came from planned food page, go there
    - remove recipes (which removes relations also) - DONE
    - filter search by keywords - DONE
    - format the recipe description
    - removing/checking of planned meals
    - removing/checking of from shopping list -DONE
    - historical DB for recipe and ingredient history (maybe filter search by popularity)
  */

  const [data, setData] = useState({
    foods: [],
    ingredients: [],
    food_ingredients: [],
    planned_food: [],
    shopping_list: [],
    recipe_keywords: [],
    keywords: []
  });

  const loadData = async () => {
    const [foodsSnap, ingredientsSnap, relationsSnap, planned_foodSnap, shopping_listSnap, recipe_keywordsSnap, keywordsSnap] = await Promise.all([
      getDocs(collection(db, "foods")),
      getDocs(collection(db, "ingredients")),
      getDocs(collection(db, "food_ingredients")),
      getDocs(collection(db, "planned_food")),
      getDocs(collection(db, "shopping_list")),
      getDocs(collection(db, "recipe_keywords")),
      getDocs(collection(db, "keywords")),
    ]);

    const foods = foodsSnap.docs.map(doc => doc.data());
    const ingredients = ingredientsSnap.docs.map(doc => doc.data());
    const food_ingredients = relationsSnap.docs.map(doc => doc.data());
    const planned_food = planned_foodSnap.docs.map(doc => doc.data());
    const shopping_list = shopping_listSnap.docs.map(doc => doc.data());
    const recipe_keywords = recipe_keywordsSnap.docs.map(doc => doc.data());
    const keywords = keywordsSnap.docs.map(doc => doc.data());

    return {foods, ingredients, food_ingredients, planned_food, shopping_list, recipe_keywords, keywords};
  };
  
  useEffect(() => {
    // load mock data if guest mode
    if(isGuestMode) {
      const foods = [
        {id: 1, name: 'Tomatsoppa', portions: 4, description: ['steg 1', 'steg 2']},
        {id: 2, name: 'Pannkakor', portions: 4, description: ['steg 1', 'steg 2']},
        {id: 3, name: 'Köttfärssås', portions: 4, description: ['steg 1', 'steg 2']},
        {id: 4, name: 'Pasta Carbonara', portions: 4, description: ['steg 1', 'steg 2']}
      ] ;
      const ingredients = [
          {id: 1, name: 'Tomat', unit: 'g', cals: 200},
          {id: 2, name: 'Grädde', unit: 'dl', cals: 200},
          {id: 3, name: 'Köttfärs', unit: 'g', cals: 200},
          {id: 4, name: 'Pasta', unit: 'g', cals: 200},
          {id: 5, name: 'Lök', unit: 'st', cals: 200},
          {id: 6, name: 'Bacon', unit: 'g', cals: 200},
          {id: 7, name: 'Mjöl', unit: 'dl', cals: 200},
          {id: 8, name: 'Mjölk', unit: 'dl', cals: 200}
      ] ;
      const food_ingredients = [
          {id: 1, food_id: 1, ingredient_id: 1, addToShoppingList: true, amount: 1000},
          {id: 2, food_id: 1, ingredient_id: 2, addToShoppingList: true, amount: 2},
          {id: 3, food_id: 2, ingredient_id: 8, addToShoppingList: true, amount: 4},
          {id: 4, food_id: 3, ingredient_id: 2, addToShoppingList: true, amount: 2},
          {id: 5, food_id: 3, ingredient_id: 4, addToShoppingList: true, amount: 500},
          {id: 6, food_id: 3, ingredient_id: 3, addToShoppingList: true, amount: 1000},
          {id: 7, food_id: 4, ingredient_id: 2, addToShoppingList: true, amount: 2},
          {id: 8, food_id: 4, ingredient_id: 4, addToShoppingList: true, amount: 400},
          {id: 9, food_id: 4, ingredient_id: 5, addToShoppingList: true, amount: 2},
          {id: 10, food_id: 4, ingredient_id: 6, addToShoppingList: true, amount: 140},
      ] ; 
      const planned_food = [
        {id: 1, portions: 4},
        {id: 2, portions: 2}
      ]
      const shopping_list = [
        {id: 2, amount: 3}
      ]

      const recipe_keywords = [
        {id: 1, recipe_id: 1, keyword_id: 1}
      ]

      const keywords = [
        {id: 1, keyword: 'Soppa'}
      ]

      setData({
        foods: foods,
        ingredients: ingredients,
        food_ingredients: food_ingredients,
        planned_food: planned_food,
        shopping_list: shopping_list,
        recipe_keywords: recipe_keywords,
        keywords: keywords
      });
    }

    // load firebase data if logged in
    else {
      loadData().then(setData);
    }
  }, [isGuestMode]);

  const [homeKey, setHomeKey] = useState(0);
  const refreshHome = () => setHomeKey(prev => prev + 1);
  
  return (
    <div className = "body" style ={{paddingBottom:"100px", minHeight: "100vh", overflowX: "hidden"}}>
      <div style={{maxWidth: "550px", margin: "0 auto"}}>
        <Routes>
          <Route path = "/" element = {<HomePage key={homeKey} data={data} setData={setData}/>}/>
          <Route path = "/recipe/:id" element = {<RecipePage data={data} setData={setData} isGuestMode={isGuestMode}/>}/>
          <Route path = "/addItem" element = {<AddItemPage data = {data} setData={setData} isGuestMode={isGuestMode}/>}>
            <Route index element = {<Navigate to="recipe" replace />}/>
            <Route path = "edit-recipe/:id" element = {<RecipeForm />}/>
            <Route path = "recipe" element = {<RecipeForm />}/>
            <Route path = "ingredient" element = {<IngredientForm />}/>
          </Route>
          <Route path = "/shoppingList" element = {<ShoppingListPage data = {data} setData={setData} isGuestMode={isGuestMode}/>}/>
          <Route path = "/plannedFood" element = {<PlannedFoodPage data = {data} setData={setData} isGuestMode={isGuestMode}/>}/>
        </Routes>
        <BottomNav onHomeClick={refreshHome} />
      </div>
    </div>
  );
}

export default function App() {

  const [isAuthed, setIsAuthed] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user);
    });

    return () => unsubscribe();
  }, []);

  // const handleSignOut = () => {
  //   setIsGuestMode(false);
  //   signOut(auth)
  //     .then(() => {
  //       console.log("utloggad");
  //     })
  //     .catch((error) => {
  //       console.error("kunde int logga ut: ", error);
  //     });
  // }

  if(!isAuthed && !isGuestMode) {
    return (<Login onGuestLogin = {() => setIsGuestMode(true)}></Login>);
  }

  return (
    <>
      {/* <button
        onClick={handleSignOut}
        style={{
          position:'fixed',
          top:'10px',
          right:'10px',
          zIndex:'9999',
          fontSize:'11px'
        }}
        className='btn btn-sm btn-outline-secondary'
      >
        Logga ut
      </button> */}

      <Router>
        <AppLayout isGuestMode={isGuestMode} />
      </Router>
    </>
  );
}