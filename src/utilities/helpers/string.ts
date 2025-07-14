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

export const getEmailLocalPart = (email: string): string => {
  const atIndex = email.indexOf('@');
  return atIndex !== -1 ? email.slice(0, atIndex) : email;
};

export function extractUuidFromParam(param: string): string | null {
  // Define the UUID regex pattern
  const uuidPattern =
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

  // Match the UUID at the end of the string
  const match = param.match(uuidPattern);

  // Return the UUID if found, otherwise null
  return match ? match[0] : null;
}

export function extractSlugFromParam(param: string): string | null {
  // Match everything before the last UUID segment
  const uuidPattern =
    /-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

  // Remove the UUID part from the string
  const title = param.replace(uuidPattern, '');

  // Return the title if it's not empty, otherwise null
  return title || null;
}

export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
