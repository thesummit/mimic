/**
 * LICENSE
 *
 * All rights are reserved. This is not Open Source or Free. You cannot modify or redistribute this code without
 * explicit permission from the copyright holder. This is built in my personal time using private resources.
 * Copyright 2021 Summit
 *
 * Author: summit
 */

const StringOperations = {
  /** @param {string} str */
  lowerFirstCharacter: str => str[0].toLowerCase() + str.slice(1),

  /** @param {string} str */
  camelToSnakeCase: str =>
    str
      .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      .replace(/^_/, ''),
};

const Transformations = {
  // TheBlueCar
  UpperCamelCase: s => s,

  // theBlueCar
  firstLowered: StringOperations.lowerFirstCharacter,

  // thebluecar
  lowered: s => s.toLowerCase(),

  // THEBLUECAR
  capital: s => s.toUpperCase(),

  // the_blue_car
  snakeLower: StringOperations.camelToSnakeCase,

  // THE_BLUE_CAR
  snakeUpper: s => StringOperations.camelToSnakeCase(s).toUpperCase(),

  // the-blue-car
  dashed: s => StringOperations.camelToSnakeCase(s).replace(/_/g, '-'),

  // THE-BLUE-CAR
  dashedUpper: s => StringOperations.camelToSnakeCase(s).replace(/_/g, '-'),

  // the blue car
  spaced: s => StringOperations.camelToSnakeCase(s).replace(/_/g, ' '),

  // THE BLUE CAR
  spacedUpper: s => StringOperations.camelToSnakeCase(s).replace(/_/g, ' ').toUpperCase(),

  // the.blue.car
  dotted: s => StringOperations.camelToSnakeCase(s).replace(/_/g, '.'),

  // THE.BLUE.CAR
  dottedUpper: s => StringOperations.camelToSnakeCase(s).replace(/_/g, '.').toUpperCase(),
};

/**
 * @param {object} given
 * @param {string} given.filePath
 * @param {string} given.fileContents
 * @param {object} snippet
 * @param {string} snippet.content
 * @param {string=} snippet.startingLineNumber
 * @param {object} context
 * @param {string} context.findPhraseUpperCamelCase - TheBlueCar
 * @param {string} context.replPhraseUpperCamelCase - TheGreenCar
 */
const Mimic = (
  given,
  snippet,
  {findPhraseUpperCamelCase, replPhraseUpperCamelCase}
) => {
  /** @param {string} code */
  const fail = code => ({ success: false, code });

  // perform
  let modifiedSnippet = snippet.content;
  let modifiedFilePath = given.filePath;
  Object.entries(Transformations).forEach(([transformationName, transformFn]) => {
    const transformedFind = transformFn(findPhraseUpperCamelCase);
    const transformedRepl = transformFn(replPhraseUpperCamelCase);
    const applyTransformation = str => str.replace(new RegExp(transformedFind, 'g'), transformedRepl);

    modifiedSnippet = applyTransformation(modifiedSnippet);
    modifiedFilePath = applyTransformation(modifiedFilePath);
  });

  // check if Transformations caught anything
  const wereTransformationsSuccessful = snippet.content !== modifiedSnippet;
  if (!wereTransformationsSuccessful) return fail('NOTHING_TRANSFORMED');

  // patch snippet into filecontents
  let modifiedFileContents = given.fileContents;
  const findMatchPositions = (needleRegExp, haystack) => {
    const matches = [...haystack.matchAll(needleRegExp)];
    return matches.map(match => match.index);
  };
  const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const charPosToLinePos = charPos => {
    const rangedString = given.fileContents.substring(0, charPos-1); // indexing is sus
    const lineNumber = rangedString.split('\n').length;

    return lineNumber;
  };
  const originalEscapedSnippetRegExp = new RegExp(escapeRegExp(snippet.content), 'g');
  const matchLinePositions = findMatchPositions(originalEscapedSnippetRegExp, given.fileContents).map(charPosToLinePos);
  const numSnippetInstances = matchLinePositions.length;
  if (numSnippetInstances === 0) return fail('ORIGINAL_NOT_FOUND');
  else {
    const sections = given.fileContents.split(originalEscapedSnippetRegExp);

    const indexOfSmallest = arr => arr.indexOf(Math.min.apply(Math, arr));
    const posProximityToIdeal = matchLinePositions.map(pos => Math.abs(pos-snippet.startingLineNumber));
    const idxOfClosestPos = indexOfSmallest(posProximityToIdeal);
    const sectionIdxToModify = idxOfClosestPos+1;
    sections[sectionIdxToModify] = modifiedSnippet + sections[sectionIdxToModify];

    modifiedFileContents = sections.join(snippet.content);
  }

  // prepare result
  const result = ({
    success: true,
    filePath: modifiedFilePath,
    fileContents: modifiedFileContents,
  });

  // check
  return result;
};

module.exports = Mimic;
