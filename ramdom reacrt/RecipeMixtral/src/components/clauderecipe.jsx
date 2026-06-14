export default function Clauderecipe({ recipeText }) {
    return (
        <section>
            <h2>Chef Mixtral Recommends:</h2>
            <article className="suggested-recipe-container" aria-live="polite">
                <p dangerouslySetInnerHTML={{ __html: formatRecipe(recipeText) }} />
            </article>
        </section>
    );
}
function formatRecipe(text) {
    const formatted = text
        .replace(/Ingredients:/gi, "<h3> Ingredients:</h3><ul>")
        .replace(/[*•]\s*(.+)/g, "<li>$1</li>")
        .replace(/Instructions:/gi, "</ul><h3> Instructions:</h3><ol>")
        .replace(/\d+\.\s*(.+?)(?=(\d+\.|$))/gs, "<li>$1</li>") + "</ol>";

    return formatted;
}
