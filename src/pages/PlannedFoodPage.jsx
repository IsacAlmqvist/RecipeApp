import PlannedRecipeList from "../components/PlannedRecipeList";

import { db } from "../firebase";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";

export default function PlannedFoodPage({data, setData, isGuestMode}) {

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

    return (
        <div style={{margin: "50px auto 0 auto", width: "90%"}}>
            <PlannedRecipeList listItems={plannedFood} />
            
            <button onClick={() => clearPlannedFood()} className="btn btn-secondary">Rensa måltider</button>
        </div>
    );
}