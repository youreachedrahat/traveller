import fetch from "node-fetch";

const GS_KEY = process.env.REACT_APP_GS_KEY;

export async function fetchLocations(pointsOfInterest, city) {
  try {
    const locations = [];
    await Promise.all(
      pointsOfInterest.map(async (point) => {
        try {
          const GSURL = `https://www.googleapis.com/customsearch/v1?key=${GS_KEY}&cx=6573f103116714e0d&q=${encodeURIComponent(
            point + " in " + city
          )}`;

          const response = await fetch(GSURL);
          const data = await response.json();

          if (data && data.items && data.items.length > 0) {
            locations.push(data.items[0]);
          }
        } catch (err) {
          console.log("error: ", err);
        }
      })
    );

    return locations;
  } catch (err) {
    console.log("error: ", err);
    throw new Error("Failed to fetch data");
  }
}
