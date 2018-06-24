import { longestWord, reverseStrings } from './exercises';
import reverseStringsData from './fixtures/reverse-strings.json';
import longestWordData from './fixtures/longest-word.json';

describe('Day 1 Exercises', () => {
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
