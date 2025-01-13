function isPrimitive(obj) {
  return obj !== Object(obj);
}

/***
 * Deeply compare two objects, exluding keys in omitKeys set.
 *
 * @param {Object} lhs
 * @param {Object} rhs
 * @param {Set} omitKeys
 *
 * @returns {boolean}
 */
export default function deepEqual(lhs, rhs, omitKeys) {
  if (lhs === rhs) {
    return true;
  }

  if (isPrimitive(lhs) && isPrimitive(rhs)) {
    return lhs === rhs;
  }

  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }

  for (const key of lhs) {
    if (omitKeys.has(key)) continue;
    if (!(key in rhs)) return false;
    if (!deepEqual(lhs[key], rhs[key], omitKeys)) return false;
  }

  return true;
}
