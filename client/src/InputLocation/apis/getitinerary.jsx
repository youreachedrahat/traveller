const GPT_KEY = process.env.REACT_APP_GPT_API_KEY;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${GPT_KEY}`,
};

export async function getItinerary(days, city) {
  try {
    if (days > 10) {
      days = 10;
    }

    const basePrompt = `You are embarking on a memorable journey to ${city}, for a ${days}-day trip. In this immersive experience, you will dive into the vibrant culture, historical landmarks, and culinary delights of Pune. Your task is to create a detailed itinerary, encompassing Morning, Afternoon, Evening, and Night sections for each day, while considering the budget for food, travel, and accommodation in local currency.
Instructions:
    
    Plan an itinerary for each day, dividing it into four sections: Morning, Afternoon, Evening, and Night.
    Ensure that the itinerary covers popular attractions, landmarks, and activities in ${city}.
    Estimate the budget required for each location, considering expenses for food, travel, stay, and any additional costs. also include Hotels.
    Make necessary adjustments in the itinerary if a particular visit requires more time, while maintaining the four-section structure.
    Present the budget in the local currency, allowing travelers to plan accordingly.
    Do not add any additional text at the end of itinerary for eg: Notes. `;

    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550,
      }),
    });

    const data = await response.json();

    const itinerary =
      data.choices && data.choices.length > 0 ? data.choices[0].text : "";
    const pointsOfInterestPrompt =
      "Extract the points of interest out of this text, with no additional words, separated by commas: " +
      itinerary;
    const morningPrompt =
      "Extract the Morning content out of this text " + itinerary;
    const afternoonPrompt =
      "Extract the Afternoon content out of this text, separated by commas: " +
      itinerary;
    const eveningPrompt =
      "Extract the Evening content out of this text, separated by commas: " +
      itinerary;
    // const pointsOfInterestPrompt =
    // "Extract the points of interest out of this text, with no additional words, separated by commas: " +
    // itinerary;

    return {
      message: "Success",
      pointsOfInterestPrompt,
      itinerary,
      morningPrompt,
      afternoonPrompt,
      eveningPrompt,
    };
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Failed to fetch itinerary");
  }
}
