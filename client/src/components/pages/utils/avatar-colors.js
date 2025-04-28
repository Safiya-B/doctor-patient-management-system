// Function to generate a consistent color based on the user's email
export const stringToColor = (email) => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = Math.imul(31, hash) + email.charCodeAt(i); // Prime number multiplication for better distribution
  }

  // Convert hash to a hex color, ensuring it's a valid hex string
  const color = `#${((hash >>> 0) & 0xffffff)
    .toString(16)
    .padStart(6, "0")
    .toUpperCase()}`;
  return color;
};
