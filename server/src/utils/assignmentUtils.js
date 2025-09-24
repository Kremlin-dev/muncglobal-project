/**
 * Utility functions for committee and country assignments
 */

// Single committee for all delegates
const committee = "World Health Organization (WHO)";

// List of specific countries for assignment
const countries = [
  "Singapore",
  "New Zealand",
  "Ghana",
  "Morocco",
  "Senegal",
  "Uganda",
  "Tanzania",
  "Côte d'Ivoire",
  "Peru",
  "Rwanda"
];


function assignCommitteeAndCountry() {
 
  const country = countries[Math.floor(Math.random() * countries.length)];
  
  console.log(`Assigned committee: ${committee} and country: ${country}`);
  
  return {
    committee,
    country
  };
}


function isValidCommittee(committeeToCheck) {
  return committeeToCheck === committee;
}

/**
 * Check if a country is valid
 * @param {string} country - Country name to check
 * @returns {boolean} True if country is valid
 */
function isValidCountry(country) {
  return countries.includes(country);
}

/**
 * Get all available committees
 * @returns {Array} List of all committees (only WHO)
 */
function getAllCommittees() {
  return [committee];
}

/**
 * Get all available countries
 * @returns {Array} List of all countries
 */
function getAllCountries() {
  return [...countries];
}

export {
  assignCommitteeAndCountry,
  isValidCommittee,
  isValidCountry,
  getAllCommittees,
  getAllCountries
};
