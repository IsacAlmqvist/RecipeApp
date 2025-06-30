import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddItemPage from './pages/AddItemPage';
import ShoppingListPage from './pages/ShoppingListPage';
import PlannedFoodPage from './pages/PlannedFoodPage';
import BottomNav from './components/BottomNav';
import Login from './components/Login';

import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

import { onAuthStateChanged } from "firebase/auth"

import { useState, useEffect} from 'react';
// import firebase from 'firebase/compat/app';

function AppLayout({ isGuestMode }) {

  const [data, setData] = useState({
    foods: [],
    ingredients: [],
    food_ingredients: []
  });

  const loadData = async () => {
    const [foodsSnap, ingredientsSnap, relationsSnap] = await Promise.all([
      getDocs(collection(db, "foods")),
      getDocs(collection(db, "ingredients")),
      getDocs(collection(db, "food_ingredients"))
    ]);

    const foods = foodsSnap.docs.map(doc => doc.data());
    const ingredients = ingredientsSnap.docs.map(doc => doc.data());
    const food_ingredient = relationsSnap.docs.map(doc => doc.data());

    return {foods, ingredients, food_ingredient};
  };
  
  useEffect(() => {
    // load mock data if guest mode
    if(isGuestMode) {
      const foods = [
        {id: 1, name: 'Tomatsoppa', portions: 4, description: 'Koka, sen mixa \nklart!'},
        {id: 2, name: 'Pannkakor', portions: 4, description: 'veva, stek'},
        {id: 3, name: 'Köttfärssås', portions: 4, description: 'gör pasta \ngör köttsås'},
        {id: 4, name: 'Pasta Carbonara', portions: 4, description: 'gör så\ngör pasta\n blanda'}
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
          {id: 1, food_id: 1, ingredient_id: 1, amount: 1000},
          {id: 2, food_id: 1, ingredient_id: 2, amount: 2},
          {id: 3, food_id: 2, ingredient_id: 7, amount: 2},
          {id: 3, food_id: 2, ingredient_id: 8, amount: 4},
          {id: 4, food_id: 3, ingredient_id: 2, amount: 2},
          {id: 5, food_id: 3, ingredient_id: 4, amount: 500},
          {id: 6, food_id: 3, ingredient_id: 5, amount: 2},
          {id: 6, food_id: 3, ingredient_id: 3, amount: 1000},
          {id: 7, food_id: 4, ingredient_id: 2, amount: 2},
          {id: 8, food_id: 4, ingredient_id: 4, amount: 400},
          {id: 9, food_id: 4, ingredient_id: 5, amount: 2},
          {id: 10, food_id: 4, ingredient_id: 6, amount: 140},
      ] ; 

      const plannedFood = [
        {id: 1, recipe_id: 3},
        {id: 2, recipe_id: 4}
      ]

      setData({
        foods: foods,
        ingredients: ingredients,
        food_ingredients: food_ingredients,
        plannedFood: plannedFood
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
    <div>
      <Routes>
        <Route path = "/" element = {<HomePage key={homeKey} data={data} />}/>
        <Route path = "/addItem" element = {<AddItemPage data = {data} setData={setData} isGuestMode={isGuestMode}/>}/>
        <Route path = "/shoppingList" element = {<ShoppingListPage/>}/>
        <Route path = "/plannedFood" element = {<PlannedFoodPage/>}/>
      </Routes>

      <BottomNav onHomeClick={refreshHome} />
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

  const handleSignOut = () => {
    setIsGuestMode(false);
    signOut(auth)
      .then(() => {
        console.log("utloggad");
      })
      .catch((error) => {
        console.error("kunde int logga ut: ", error);
      });
  }

  if(!isAuthed && !isGuestMode) {
    return (<Login onGuestLogin = {() => setIsGuestMode(true)}></Login>);
  }

  return (
    <>
      <button
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
      </button>

      <Router>
        <AppLayout isGuestMode={isGuestMode} />
      </Router>
    </>
  );
}