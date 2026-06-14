export default function Ingredientlist(props){
    const inglistitems = props.ings.map((ing, i) =>
    (
        <li key={i}>
            {ing}
            <button onClick={() => props.removeIngredient(i)} style={{marginLeft: "10px"}}>
                Delete
            </button>
            </li>
    )
    )
    return(
         <section>
                <h2>Ingredients on hand:</h2>
                <ul className="ingredients-list" aria-live="polite">{inglistitems}</ul>
                {props.ings.length>3 && <div className="getrecipe-container">
                <div>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={props.toggleRecipeShown}>Get a recipe</button>
                </div>}
            </section>
    )
}