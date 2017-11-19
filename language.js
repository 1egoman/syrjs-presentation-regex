const ADD = /^\(\+ *(.+)\)/; // (+ MORE TOKENS IN HERE )
const SUBTRACT = /^\(\- *(.+)\)/; // (- MORE TOKENS IN HERE )
const MULTIPLY = /^\(\* *(.+)\)/; // (* MORE TOKENS IN HERE )
const DIVIDE = /^\(\/ *(.+)\)/; // (/ MORE TOKENS IN HERE )
const NUMBER = /^([0-9.]+)/; // 123

const TOKENS = [ ADD, SUBTRACT, MULTIPLY, DIVIDE, NUMBER ];
const TOKEN_NAMES = [ 'add', 'subtract', 'multiply', 'divide', 'number' ];

function tokenizer(tokens) {
  const output = [];
  let foundToken = false;

  while (true) {
    // Set the flag to false.
    foundToken = false;

    // Remove white space
    tokens = tokens.trim()

    // Find the token at the start of the string.
    for (let i = 0; i < TOKENS.length; i++) {
      const match = TOKENS[i].exec(tokens);
      if (match) {
        // Found a valid token! Set flag to true.
        foundToken = true;

        // Remove the token we just handled from the start of the token string
        tokens = tokens.slice(match[0].length);

        // Tell the user about we we found.
        const name = TOKEN_NAMES[i];

        // Does the token have contents that need to be parsed too?
        let children = null;
        if (name === 'add' || name === 'subtract' || name === 'multiply' || name === 'divide') {
          children = tokenizer(match[1]);
        }


        // Add the token to the output.
        output.push({
          token: name,
          value: match[0],
          children: children,
        });
        break;
      }
    }

    // No matching token was found, bail...
    if (!foundToken) {
      break;
    }
  }

  return output;
}

function interpreter(head) {
  switch (head.token) {
  case 'add':
    if (head.children && head.children.length === 2) {
      return interpreter(head.children[0]) + interpreter(head.children[1]);
    } else {
      throw new Error('add was called without two children.');
    }
  case 'subtract':
    if (head.children && head.children.length === 2) {
      return interpreter(head.children[0]) - interpreter(head.children[1]);
    } else {
      throw new Error('add was called without two children.');
    }
  case 'multiply':
    if (head.children && head.children.length === 2) {
      return interpreter(head.children[0]) * interpreter(head.children[1]);
    } else {
      throw new Error('add was called without two children.');
    }
  case 'divide':
    if (head.children && head.children.length === 2) {
      return interpreter(head.children[0]) / interpreter(head.children[1]);
    } else {
      throw new Error('add was called without two children.');
    }
  case 'number':
    return parseInt(head.value, 10);
  default:
    throw new Error(`No such token called ${head.token}!`);
  }
}

// console.log(JSON.stringify(tokenizer('(+ 1 (* 5 1))'), null, 2));

const code = '(+ (+ 1 1) (* 5 1))';
const tokens = tokenizer(code)[0];
console.log(code, ' => ', interpreter(tokens));
