import levenshteinDistance from "../src/utils/levenshteinDistance";
import { expect, test } from "vitest";

test('Levenshtein distance of "kitten" and "sitting" is 3', () => {
  expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
});

test ('Levenshtein distance of "Saturday" and "Sunday" is 3', () => {
  expect(levenshteinDistance('Saturday', 'Sunday')).toBe(3);
});
