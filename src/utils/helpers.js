export const getRandomImage = (id) => {
    const imageNumber = (id % 10) + 1; // Generates a number between 1-10
    return `https://picsum.photos/id/${imageNumber + 100}/200`;
  };