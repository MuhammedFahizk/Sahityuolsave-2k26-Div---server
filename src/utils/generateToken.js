
export const activeTokens = new Set();

export const generateToken = () => {
  // Creates a random string like: "a3f8b2c1d4e5"
  
  const token = Math.random().toString(36).slice(2) +
                Math.random().toString(36).slice(2);

  activeTokens.add(token); 
  return token;
};