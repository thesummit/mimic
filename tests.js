const Mimic = require('./Mimic');

const fileContents = `// my cool car stuff

class Car {
  // Handle blue car
  constructor() {
    const isBlueCarHandled = true;
  }

  // Handle blue car
  static getIsBlueCar() {
    const title = 'blue car';
    return title;
  }
}
`;

// TEST
console.log(Mimic({
  filePath: '/Users/summits/project/BlueCar/main.js',
  fileContents,
}, {
  content: `

  // Handle blue car
  static getIsBlueCar() {
    const title = 'blue car';
    return title;
  }`,
  startingLineNumber: 7,
}, {
  findPhraseUpperCamelCase: 'BlueCar',
  replPhraseUpperCamelCase: 'GreenCar',
}).success);


// TEST
console.log(Mimic({
  filePath: '/Users/summits/project/BlueCar/main.js',
  fileContents,
}, {
  content: `
  // Handle blue car`,
  startingLineNumber: 4,
}, {
  findPhraseUpperCamelCase: 'BLAH',
  replPhraseUpperCamelCase: 'Cat',
}).success === false);


// TEST
console.log(Mimic({
  filePath: '/Users/summits/project/BlueCar/main.js',
  fileContents,
}, {
  content: `
  // Handle blue car`,
  startingLineNumber: 3,
}, {
  findPhraseUpperCamelCase: 'BlueCar',
  replPhraseUpperCamelCase: 'GreenCar',
}).success);


// TEST
console.log(Mimic({
  filePath: '/Users/summits/project/BlueCar/main.js',
  fileContents,
}, {
  content: `
  // Handle blue car`,
  startingLineNumber: 9,
}, {
  findPhraseUpperCamelCase: 'BlueCar',
  replPhraseUpperCamelCase: 'GreenCar',
}).success);
