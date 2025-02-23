import { getReq } from "@/app/utils/api";

//


//probability function {probability} takes a probability and returns number between 1 and 4
//I want to 4 corespond to 0.85-1, 3 corespond to 0.6-0.85, 2 correspond to 0.30-0.6 and 1 between 0.0 and 0.3.
function convertProbabilityToRiskFactor(probability: number): number {
  if (probability >= 0.85 && probability <= 1) {
    return 4;
  } else if (probability >= 0.6 && probability < 0.85) {
    return 3;
  } else if (probability >= 0.3 && probability < 0.6) {
    return 2;
  } else if (probability >= 0 && probability < 0.3) {
    return 1;
  } else {
    throw new Error("Probability must be between 0 and 1.");
  }
}
export const countyCoordinates: Record<string, [number, number]> = {
  "Alameda": [37.6015, -121.7195],
  "Alpine": [38.5000, -119.7500],
  "Amador": [38.4000, -120.6000],
  "Butte": [39.5000, -121.6000],
  "Calaveras": [38.2000, -120.5000],
  "Colusa": [39.2000, -122.0000],
  "Contra Costa": [38.0000, -121.9000],
  "Del Norte": [41.0000, -124.0000],
  "El Dorado": [38.7000, -120.8000],
  "Fresno": [36.7000, -119.7000],
  "Glenn": [39.5000, -122.0000],
  "Humboldt": [40.5000, -124.0000],
  "Imperial": [32.8000, -115.5000],
  "Inyo": [36.5000, -118.0000],
  "Kern": [35.5000, -118.0000],
  "Kings": [36.5000, -119.5000],
  "Lake": [39.0000, -122.5000],
  "Lassen": [40.5000, -120.5000],
  "Los Angeles": [34.0500, -118.2500],
  "Madera": [37.0000, -119.7500],
  "Marin": [38.0000, -122.5000],
  "Mariposa": [37.5000, -119.7500],
  "Mendocino": [39.5000, -123.0000],
  "Merced": [37.3000, -120.5000],
  "Modoc": [41.5000, -120.5000],
  "Mono": [37.5000, -118.0000],
  "Monterey": [36.5000, -121.5000],
  "Napa": [38.5000, -122.5000],
  "Nevada": [39.5000, -120.5000],
  "Orange": [33.8000, -117.8000],
  "Placer": [39.5000, -120.5000],
  "Plumas": [40.5000, -120.5000],
  "Riverside": [33.8000, -116.0000],
  "Sacramento": [38.5000, -121.5000],
  "San Benito": [36.5000, -121.5000],
  "San Bernardino": [34.5000, -116.0000],
  "San Diego": [32.8000, -116.0000],
  "San Francisco": [37.7500, -122.5000],
  "San Joaquin": [37.5000, -121.5000],
  "San Luis Obispo": [35.5000, -120.5000],
  "San Mateo": [37.5000, -122.5000],
  "Santa Barbara": [34.5000, -120.5000],
  "Santa Clara": [37.5000, -121.5000],
  "Santa Cruz": [37.5000, -122.5000],
  "Shasta": [40.5000, -122.5000],
  "Sierra": [39.5000, -120.5000],
  "Siskiyou": [41.5000, -122.5000],
  "Solano": [38.5000, -121.5000],
  "Sonoma": [38.5000, -122.5000],
  "Stanislaus": [37.5000, -121.5000],
  "Sutter": [39.5000, -121.5000],
  "Tehama": [40.5000, -122.5000],
  "Trinity": [40.5000, -123.0000],
  "Tulare": [36.5000, -118.0000],
  "Tuolumne": [38.5000, -120.5000],
  "Ventura": [34.5000, -119.5000],
  "Yolo": [38.5000, -121.5000],
  "Yuba": [39.5000, -121.5000]
};

// Function to process each county
async function processCounties(): Promise<Record<string, number>> {
  const countyRiskFactors: Record<string, number> = {};

  for (const [county, [lat, lng]] of Object.entries(countyCoordinates)) {
    try {
      // Call the getReq API with the county's latitude and longitude
      const response = await getReq(lat, lng);
      const probability = response.prediction_probability;
      // // Convert the probability to a risk factor
      const riskFactor = convertProbabilityToRiskFactor(probability);

      // // Assign the risk factor to the county
      countyRiskFactors[county] = riskFactor;
    } catch (error) {
      console.error(`Error processing county ${county}:`, error);
      // Handle the error appropriately, e.g., set a default risk factor or continue
      countyRiskFactors[county] = 1; // Default risk factor
    }
  }

  return countyRiskFactors;
}


let countyColors: Record<string, number> = {};

export async function updateCountyColors() {
  countyColors = await processCounties();
}

export { countyColors };
