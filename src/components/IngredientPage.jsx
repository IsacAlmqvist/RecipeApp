export default function IngredientPage({data, itemId}) {

    const ingredient = data.ingredients.find(i => i.id === itemId);
   
    return (
        <>
            <h1>
            {ingredient.name}
            </h1>

            <p>
            Enhet: {ingredient.unit}
            </p>

            <p>
            Kcal/100g: {ingredient.cals}
            </p>

        </>
    );
}