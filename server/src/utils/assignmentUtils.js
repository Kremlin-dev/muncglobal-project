/**
 * Utility functions for committee and country assignments
 */

// List of dummy committees (to be replaced with actual committees later)
const committees = [
  "General Assembly",
  "Security Council",
  "Economic and Social Council",
  "Human Rights Council",
  "Environmental Programme",
  "World Health Organization",
  "International Court of Justice",
  "Disarmament and International Security",
  "Special Political and Decolonization",
  "Social, Humanitarian and Cultural"
];

// List of countries for assignment
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", 
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", 
  "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", 
  "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", 
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", 
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", 
  "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", 
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", 
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", 
  "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

/**
 * Randomly assign a committee and country to a participant
 * @returns {Object} Object containing assigned committee and country
 */
function assignCommitteeAndCountry() {
  // Randomly select a committee
  const committee = committees[Math.floor(Math.random() * committees.length)];
  
  // Randomly select a country
  const country = countries[Math.floor(Math.random() * countries.length)];
  
  console.log(`Assigned committee: ${committee} and country: ${country}`);
  
  return {
    committee,
    country
  };
}

/**
 * Check if a committee is valid
 * @param {string} committee - Committee name to check
 * @returns {boolean} True if committee is valid
 */
function isValidCommittee(committee) {
  return committees.includes(committee);
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
 * @returns {Array} List of all committees
 */
function getAllCommittees() {
  return [...committees];
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
