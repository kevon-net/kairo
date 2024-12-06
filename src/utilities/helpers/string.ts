export const getPasswordStrength = (
  password: string,
  requirements: { re: RegExp; label: string }[]
) => {
  let multiplier = password.length >= 8 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
};

// export const filterSearch = <T>(
//   items: T[],
//   search: string,
//   getField: (item: T) => string | undefined
// ): T[] => {
//   const trimmedSearch = search.toLowerCase().trim();
//   if (!trimmedSearch) return items;

//   return items
//     .map((item) => {
//       const field = getField(item)?.toLowerCase();
//       if (!field) return { item, score: 0 };

//       const matches = [...trimmedSearch].filter((char) =>
//         field.includes(char)
//       ).length;
//       const score = matches / trimmedSearch.length; // Percentage of matches

//       return { item, score };
//     })
//     .filter(({ score }) => score > 0) // Exclude items with no matches
//     .sort((a, b) => b.score - a.score) // Sort by relevance
//     .map(({ item }) => item); // Extract items
// };

/**
 * Filters an array of items based on a search string using a custom field getter
 * Matches characters in the exact order provided, ignoring spaces
 *
 * @template T The type of items in the array
 * @param items Array of items to filter
 * @param searchString The search query string
 * @param getField Function to extract searchable string from an item
 * @returns Filtered array of items
 */
export const filterSearch = <T>(
  items: T[],
  searchString: string,
  getField: (item: T) => string | undefined
): T[] => {
  // If search string is empty, return all items
  if (!searchString.trim()) return items;

  // Remove spaces from search string and convert to lowercase
  const normalizedSearch = searchString.toLowerCase().replace(/\s+/g, '');

  // Filter items that match the search criteria
  return items.filter((item) => {
    // Extract the field value to search
    const fieldValue = getField(item);

    // If no field value, skip this item
    if (fieldValue === undefined) return false;

    // Remove spaces from field value and convert to lowercase
    const normalizedFieldValue = String(fieldValue)
      .toLowerCase()
      .replace(/\s+/g, '');

    // Check if characters appear in order
    let searchIndex = 0;
    for (
      let i = 0;
      i < normalizedFieldValue.length && searchIndex < normalizedSearch.length;
      i++
    ) {
      if (normalizedFieldValue[i] === normalizedSearch[searchIndex]) {
        searchIndex++;
      }
    }

    // Return true if all characters in search string were found in order
    return searchIndex === normalizedSearch.length;
  });
};
