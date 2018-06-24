import {
  compose,
  countBy,
  identity,
  prop,
  sum,
  times,
} from 'ramda';
import { lotsOfSmiles, longestWord, reverseStrings } from './exercises';
import reverseStringsData from './fixtures/reverse-strings.json';
import longestWordData from './fixtures/longest-word.json';

const randomInt = (min, max) => Math.floor(min + (Math.random() * max));

describe('Day 1 Exercises', () => {
  describe('lotsOfSmiles()', () => {
    const countSmiles = compose(
      prop('😀'),
      countBy(identity),
    );
    it('should return "" when array sums to zero', () => {
      expect(lotsOfSmiles([0])).to.equal('');
    });
    it('should return the number of 😀s when passed an array of #s', () => {
      // Run the test three times, with different data:
      times(() => {
        const randomTestData = times(() => randomInt(1, 10), randomInt(6, 18));
        expect(countSmiles(lotsOfSmiles(randomTestData))).to.equal(sum(randomTestData));
      }, 3);
    });
  });
  describe('longestWord()', () => {
    it('should return the longest word when passed a sentence.', () => {
      expect(longestWord(longestWordData.differentLength)).to.equal('flame');
    });
    it('should return the alphabetically first word when passed a sentence with similar word lengths', () => {
      expect(longestWord(longestWordData.sameLength)).to.equal('abe');
    });
    it('should ignore punctuation', () => {
      expect(longestWord(longestWordData.punctuation)).to.equal('fez');
    });
  });
  describe('reverseStrings()', () => {
    it('should return [] when passed []', () => {
      expect(reverseStrings([])).to.deep.equal([]);
    });
    it('should reverse fixture data', () => {
      expect(reverseStrings(reverseStringsData.forwards))
        .to.deep.equal(reverseStringsData.backwards);
      expect(reverseStrings(reverseStringsData.backwards))
        .to.deep.equal(reverseStringsData.forwards);
    });
    it('should do nothing to an array of numbers', () => {
      expect(reverseStrings(reverseStringsData.numbers))
        .to.deep.equal(reverseStringsData.numbers);
    });
    it('should reverse strings and ignore numbers in a mixed array of numbers and string', () => {
      expect(reverseStrings(reverseStringsData.mixedForwards))
        .to.deep.equal(reverseStringsData.mixedBackwards);
      expect(reverseStrings(reverseStringsData.mixedBackwards))
        .to.deep.equal(reverseStringsData.mixedForwards);
    });
  });
});
