// Collection of sample texts for typing practice
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "The best way to predict the future is to invent it.",
  "Good code is its own best documentation. As you're about to add a comment, ask yourself, 'How can I improve the code so that this comment isn't needed?'",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency. When you can do something simply, do it simply.",
  "The most important property of a program is whether it accomplishes the intention of its user.",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
  "The function of good software is to make the complex appear to be simple."
];

// Collection of common words for random paragraph generation
const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "was", "were", "has", "had", "does", "did", "been", "being", "am", "should", "could", "would", "might", "must", "shall", "will", "can", "may",
  "code", "program", "type", "write", "read", "learn", "create", "build", "develop", "design", "test", "debug", "fix", "improve", "optimize", "refactor", "deploy", "run", "execute", "compile"
];

/**
 * Returns a random text from the collection
 * @returns {string} A random text for typing practice
 */
export const getRandomText = () => {
  const randomIndex = Math.floor(Math.random() * sampleTexts.length);
  return sampleTexts[randomIndex];
};

/**
 * Generates a random paragraph with a specified number of words
 * @param {number} wordCount - Number of words to generate (default: 25)
 * @returns {string} A randomly generated paragraph
 */
export const generateRandomParagraph = (wordCount = 25) => {
  let paragraph = '';
  let sentenceLength = 0;
  let currentSentenceWords = 0;
  
  for (let i = 0; i < wordCount; i++) {
    // Get a random word
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    let word = commonWords[randomIndex];
    
    // Capitalize first word of a sentence
    if (sentenceLength === 0) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    
    // Add the word to the paragraph
    paragraph += word;
    currentSentenceWords++;
    
    // Determine if we should end the sentence
    // Sentences vary between 3-12 words
    if (currentSentenceWords >= 3 && (Math.random() < 0.2 || currentSentenceWords >= 12)) {
      paragraph += '.';
      sentenceLength = 0;
      currentSentenceWords = 0;
    } else {
      // Add space after word if not at the end of paragraph and not ending a sentence
      if (i < wordCount - 1) {
        paragraph += ' ';
      }
      sentenceLength++;
    }
  }
  
  // Ensure paragraph ends with a period
  if (!paragraph.endsWith('.')) {
    paragraph += '.';
  }
  
  return paragraph;
};

/**
 * Returns a specific text by index
 * @param {number} index - The index of the text to return
 * @returns {string} The text at the specified index
 */
export const getTextByIndex = (index) => {
  if (index >= 0 && index < sampleTexts.length) {
    return sampleTexts[index];
  }
  return sampleTexts[0]; // Default to first text if index is invalid
};

/**
 * Returns all available texts
 * @returns {string[]} Array of all available texts
 */
export const getAllTexts = () => {
  return [...sampleTexts];
};