import axios from 'axios';


const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY!}`;

export const getGeminiResponse = async (prompt: string) => {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [
        {
          text: `You are an expert movie recommender. Your task is to suggest movies based on the given input.
          
          The input could be a **genre, theme, mood, specific movie, actor's movie, director, or combination** (e.g., "sci-fi thrillers", "movies like Inception", "best romantic comedies of the 2000s", "Leonardo DiCaprio adventure films", "Rober downey junior movie", "shahrukh khan").
          
          - **Only return the movie names**, formatted as a **numbered list** (1 to ...).
          - **Do not include descriptions, explanations, or anything else**.
          - **Do not repeat movie names** within the list.
          - If the exact match is not available, suggest related movies.
          - If no related movies are available, indicate that no recommendations can be made.
          
          Here is the user input: "${prompt}".
          
          Now, generate movie recommendations based on this input. If no exact matches are found, provide related movies. If no related movies are available, indicate that no recommendations can be made.`
        }
      ] }],
    });
    // console.log("GEMINI RESPOSNE: ", response);
    

    return response.data.candidates[0]?.content?.parts[0]?.text || "No response";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error fetching response.";
  }
};


export const getSearchSuggestion = async (query: string) => {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [
        {
          text: `You are an expert movie recommender. Your task is to suggest movies based on the given input.
          
          The input could be a **genre, theme, mood, specific movie, actor's movie, director, or combination** (e.g., "sci-fi thrillers", "movies like Inception", "best romantic comedies of the 2000s", "Leonardo DiCaprio adventure films", "Rober downey junior movie", "shahrukh khan").
          
          - **Only return the movie names**, formatted as a **numbered list** (1 to ...).
          - **Do not include descriptions, explanations, or anything else**.
          - **Do not repeat movie names** within the list.
          - If the exact match is not available, suggest related movies.
          - If no related movies are available, indicate that no recommendations can be made.
          
          Here is the user input: "${query}".
          
          Now, generate movie recommendations based on this input. If no exact matches are found, provide related movies. If no related movies are available, indicate that no recommendations can be made.`
        }
      ] }],
    });
    

    return response.data.candidates[0]?.content?.parts[0]?.text || "No response";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error fetching response.";
  }
}
