import IngredientList from "./IngredientList";

export default function RecipePage({data, itemId}) {

    const recipe = data.foods.find(f => f.id === itemId);
    const ingreientList = data.food_ingredients
        .filter(fi => fi.food_id === itemId)
        .map(fi => {
            const ingredient = data.ingredients.find(i => i.id === fi.ingredient_id);
            return {
                name: ingredient.name,
                unit: ingredient.unit,
                amount: fi.amount
            }
        });

    return (
        <>

            <h1>
            {recipe.name}
            </h1>

            <div style={{ width: '90%', margin: '0 auto'}}>
                <IngredientList listItems={ingreientList} />
            </div>

            <p>
            {recipe.description}
            </p>

        </>
    );
}