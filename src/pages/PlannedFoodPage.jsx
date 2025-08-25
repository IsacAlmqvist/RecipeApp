import PlannedRecipeList from "../components/PlannedRecipeList";

import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

import { db } from "../firebase";
import { collection, doc, getDocs, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";

export default function PlannedFoodPage({data, setData, isGuestMode}) {

    const [showDeletePrompt, setShowDeletePrompt] = useState(false);

    const clearPlannedFoodDb = async () => {
        if(!isGuestMode) {
            const collectionRef = collection(db, "planned_food");
            const snapshot = await getDocs(collectionRef);
            const deletePromises = snapshot.docs.map((docSnap) =>
                deleteDoc(doc(db, "planned_food", docSnap.id))
            );
            await Promise.all(deletePromises);
            console.log("Deleted planned food from database!");
        }
    }

    const clearPlannedFood = () => {
        setData(prev => ({
            ...prev,
            planned_food: []
        }));

        clearPlannedFoodDb();
    }

    const plannedFoodData = data.planned_food;
    const plannedFood = [];

    for (const item of plannedFoodData) {
        const foodFound = data.foods.find(i => i.id === item.id);
        plannedFood.push({
            id: item.id,
            name: foodFound.name,
            portions: item.portions
        })
    }

    const handleMarkedDone = (itemId) => {
            setData((prev) => {
                const item = prev.planned_food.find(i => i.id === itemId);
                if(!item) return prev;
    
                const newValue = !item.markedDone;
    
                markDoneDb(itemId, newValue);
    
                return {
                    ...prev,
                    planned_food: prev.planned_food.map(i => 
                        i.id === itemId ? {...i, markedDone: newValue} : i
                    )
                };
            });
        }
    
        const markDoneDb = async (itemId, value) => {
            const docRef = doc(db, "planned_food", itemId.toString());
    
            await updateDoc(docRef, {
                markedDone: value
            });
        }
    
        const clearMarkedItems = () => {
            const itemsToDelete = data.planned_food.filter(i => i.markedDone);
    
            setData((prev) => ({
                ...prev,
                planned_food: prev.planned_food.filter(i => !i.markedDone)
            }));
    
            clearMarkedItemsDb(itemsToDelete);
        }
    
        const clearMarkedItemsDb = async (itemsToDelete) => {
            const batch = writeBatch(db);
    
            itemsToDelete.forEach(item => {
                const ref = doc(db, "planned_food", item.id.toString());
                batch.delete(ref);
            });
            await batch.commit();
        }
    
        const ref = useRef();
        
        useEffect(() => {
            function handleClickOutside(e) {
                if(ref.current && !ref.current.contains(e.target)) {
                    setShowDeletePrompt(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

    return (
        <div style={{margin: "50px auto 0 auto", width: "90%"}}>
            <PlannedRecipeList listItems={plannedFood} plannedFoodData={data.planned_food} onMarkedDone={handleMarkedDone}/>
            
            <div style={{width:'90%', margin: '0 auto'}} className="d-flex">
                <button onClick={() => clearMarkedItems()} style={{width:'50%', textAlign: 'left'}} className="btn btn-secondary mt-4">Rensa markerade</button>
                { showDeletePrompt ? (
                    <div style={{width: '50%'}} className="d-flex btn btn-secondary mt-4 pe-0">
                        <div>Säker?</div>
                        <button
                            ref={ref}
                            style={{borderRadius: '6px', border: '1px solid currentColor', width: '24px', height:'24px', margin: 'auto 8px auto auto'}} 
                            className="btn d-flex align-items-center justify-content-center"
                            onClick={() => clearPlannedFood()}
                        >
                            <i className="bi bi-check-lg fs-4 text-success"/>
                        </button>
                    </div>
                ) : (
                    <button style={{width: '50%', textAlign:'left'}} onClick={() => setShowDeletePrompt(true)} className="btn btn-secondary mt-4 text-color-danger">Rensa allt</button>
                )}
            </div>
        </div>
    );
}