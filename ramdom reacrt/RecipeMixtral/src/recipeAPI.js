import { HfInference } from "@huggingface/inference";
const hf = new HfInference(import.meta.env.VITE_HF_API_KEY);
const sysPrompt = `
    You are an assistant that recieves a list of ingredients that a user has
`
export async function getRecipeFromHuggingFace (ingredientsArr) {
    const ingsString = ingredientsArr.join(",");
    try{
        const res = await hf.chatCompletion(
            {
                model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
                messages: [
                    {role: "system", content: sysPrompt},
                    {role: "user", content: `I have ${ingsString}. Recommend a recipe.`},
                ],
                max_tokens: 1024,
            }
        );
        return res.choices[0].message.content;
    }catch(err){
        console.error("ERROR! : ", err.message);
        return "Oops! couldn't get a recipe :((";
    }
    
}
