export default function Toggle({toggleIndex, onToggleClick}) {

    let foodOrIngredient = ['Recept', 'Ingredienser'];

    return (
        <div className="mt-3 text-center">
            <ul className="list-group list-group-horizontal d-inline-flex">
                {foodOrIngredient.map((item, index) => (
                    <li
                        className={toggleIndex === index ? "list-group-item active" : "list-group-item"}
                        key = {index}
                        onClick={() => {onToggleClick(index)}}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}