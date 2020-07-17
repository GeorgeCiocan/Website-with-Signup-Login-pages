const typingErrors = {
  capitalLetter: /([A-Z])+/g,
  smallLetter: /([a-z])+/g,
  digit: /([0-9])+/g,
  emailMatch: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
};

export default typingErrors;
