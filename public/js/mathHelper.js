Math.map = function(value, iStart, iStop, oStart, oStop) {
  return oStart + (oStop - oStart) * ((value - iStart) / (iStop - iStart));
}

// Returns a random integer between min(inclusive) and max(inclusive)
Math.randInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + parseInt(min);
}

// Returns a random float between min(inclusive) and max(exclusive)
Math.randFloat = function(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}