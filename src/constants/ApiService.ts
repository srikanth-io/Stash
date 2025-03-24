import { Config } from "../Config"

export const ApiService = async (userInput: string): Promise<undefined> => {
  try {
    const APIBaseURL = `${Config.API_URL}${Config.API_KEY}`    
     const response = await fetch(APIBaseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userInput }] }],
      }),
     });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (e: any) {
    console.error('Error fetching response:', e);
  }
}