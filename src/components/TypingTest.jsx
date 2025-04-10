import { useState, useEffect, useRef } from 'react';
import { getRandomText, generateRandomParagraph } from '../utils/textGenerator';

const TypingTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60); // Default 1 minute in seconds
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [typedTextHistory, setTypedTextHistory] = useState('');
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const textEndThreshold = 20; // Number of characters remaining before adding more text

  // Initialize with a random text
  useEffect(() => {
    resetTest();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsCompleted(true);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeRemaining]);

  const resetTest = () => {
    // Generate initial text using the new random paragraph generator
    const newText = generateRandomParagraph(50); // Start with a longer paragraph
    setText(newText);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    setWordCount(0);
    setCharCount(0);
    setTotalCorrectChars(0);
    setTotalCharsTyped(0);
    setTypedTextHistory('');
    setTimeRemaining(timeLimit);
    setTimerActive(false);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const setTimer = (seconds) => {
    setTimeLimit(seconds);
    setTimeRemaining(seconds);
    resetTest();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    // Start the timer on first input
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
      setTimerActive(true);
    }

    // Calculate accuracy for current input
    let correctChars = 0;
    const inputLength = Math.min(value.length, text.length);
    for (let i = 0; i < inputLength; i++) {
      if (value[i] === text[i]) {
        correctChars++;
      }
    }
    
    // Update total correct characters and total characters typed
    if (value.length > userInput.length) {
      // User added characters
      const newChars = value.length - userInput.length;
      setTotalCharsTyped(prev => prev + newChars);
      
      // Count new correct characters
      let newCorrectChars = 0;
      for (let i = userInput.length; i < value.length && i < text.length; i++) {
        if (value[i] === text[i]) {
          newCorrectChars++;
        }
      }
      setTotalCorrectChars(prev => prev + newCorrectChars);
    }
    
    // Calculate overall accuracy based on total characters
    const newAccuracy = totalCharsTyped > 0 ? Math.floor((totalCorrectChars / totalCharsTyped) * 100) : 100;
    setAccuracy(newAccuracy);

    // Calculate WPM (words per minute) based on all text typed so far
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
      // Count words in current input plus words in history
      const currentInputWords = value.trim().split(/\s+/).length;
      const historyWords = typedTextHistory.trim().length > 0 ? typedTextHistory.trim().split(/\s+/).length : 0;
      const totalWords = historyWords + currentInputWords;
      
      // Update word and character counts
      setWordCount(totalWords);
      setCharCount(totalCharsTyped);
      
      // Calculate WPM based on total words typed
      const newWpm = timeElapsed > 0 ? Math.round(totalWords / timeElapsed) : 0;
      setWpm(newWpm);
    }

    // Check if user is approaching the end of the current text
    if (value.length >= text.length - textEndThreshold && timeRemaining > 0) {
      // Generate additional text
      const additionalText = generateRandomParagraph(30);
      setText(prevText => prevText + ' ' + additionalText);
    }
    
    // If user has completed the visible portion of text, move the window forward
    if (value.length === text.length && timeRemaining > 0) {
      // Save the completed text to history
      setTypedTextHistory(prev => prev + (prev.length > 0 ? ' ' : '') + value);
      
      // Generate new text for the user to continue typing
      const newText = generateRandomParagraph(50);
      setText(newText);
      setUserInput('');
    } else if (timeRemaining <= 0) {
      // If time is up, mark as completed
      setIsCompleted(true);
    }
  };

  // Render text with highlighting for correct/incorrect characters
  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = '';
      if (index < userInput.length) {
        className = userInput[index] === char ? 'correct' : 'incorrect';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };
  
  // Render test results when completed
  const renderResults = () => {
    return (
      <div className="test-results">
        <h2>Test Complete!</h2>
        <div className="results-metrics">
          <div className="result-metric">
            <span className="result-value">{wpm}</span>
            <span className="result-label">Words Per Minute</span>
          </div>
          <div className="result-metric">
            <span className="result-value">{accuracy}%</span>
            <span className="result-label">Accuracy</span>
          </div>
          <div className="result-metric">
            <span className="result-value">{wordCount}</span>
            <span className="result-label">Total Words</span>
          </div>
          <div className="result-metric">
            <span className="result-value">{charCount}</span>
            <span className="result-label">Total Characters</span>
          </div>
        </div>
        <button onClick={resetTest} className="reset-button">
          Try Again
        </button>
      </div>
    );
  };

  return (
    <div className="typing-test">
      {isCompleted ? (
        renderResults()
      ) : (
        <>
          <div className="metrics">
            <div className="metric">
              <span className="metric-value">{wpm}</span>
              <span className="metric-label">WPM</span>
            </div>
            <div className="metric">
              <span className="metric-value">{accuracy}%</span>
              <span className="metric-label">Accuracy</span>
            </div>
            <div className="metric">
              <span className="metric-value">{charCount}</span>
              <span className="metric-label">Characters</span>
            </div>
            <div className="metric">
              <span className="metric-value">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
              <span className="metric-label">Time</span>
            </div>
          </div>

          <div className="timer-select">
            <select 
              className="timer-dropdown" 
              value={timeLimit} 
              onChange={(e) => setTimer(Number(e.target.value))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

          <div className="text-display">{renderText()}</div>

          <input
            ref={inputRef}
            type="text"
            className="input-field"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing..."
            disabled={isCompleted}
            autoFocus
          />

          <div className="controls">
            <button onClick={resetTest} className="reset-button">
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TypingTest;