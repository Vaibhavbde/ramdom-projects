import React from "react";
import Clauderecipe from "./clauderecipe.jsx";
import Ingredientlist from "./ingredientlist.jsx";
import { getRecipeFromHuggingFace } from "../recipeAPI.js";
export default function Form(){
    const [ings, setings] = React.useState([
        "spices", "pasta", "chicken", "tomato paste"]
    )
    const [generating, setgenerating] = React.useState(false)
    const [generatedRecipe, setGeneratedRecipe] = React.useState("");
    const [recipeShown, setrecipeShown] = React.useState(false)
    async function toggleRecipeShown() {
        if(!recipeShown){
            setgenerating(true);
            const result = await getRecipeFromHuggingFace(ings);
            setGeneratedRecipe(result)
            setgenerating(false);
        }
        setrecipeShown(prevShown => !prevShown)
    }
    function removeIngredient(indexToRemove) {
    setings(prevIngs => prevIngs.filter((_, index) => index !== indexToRemove));
    }
    function adding(event){
        event.preventDefault()
        const formdata = new FormData(event.currentTarget)
        const newing = formdata.get("ing")
        if(newing){
            setings(preving => [...preving, newing])
        }
        event.currentTarget.reset()
    }
    return(
        <main>
            <form className="addingredientform" onSubmit={adding}>
                <input type="text"  
                name="ing"
                placeholder="thinking of oregano?"
                aria-label="Add an ingredient!"/>
                <button>Add Ingredient</button>
            </form>
            {ings.length>0 && (
                <>
                <Ingredientlist 
            ings={ings} 
            toggleRecipeShown={toggleRecipeShown}
            removeIngredient = {removeIngredient}
            />
            {generating && <p style={{ fontStyle: "italic", marginTop: "10px" }}>Generating recipe...</p>}
            </>
            )}
            {recipeShown && <Clauderecipe recipeText={generatedRecipe}/>}
        </main>
    )
}