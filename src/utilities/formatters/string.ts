export const capitalizeWord = (value: string) =>
  value.trim().toLowerCase().charAt(0).toUpperCase() +
  value.trim().toLowerCase().slice(1);

export const capitalizeWords = (words: string) =>
  words.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export const initialize = (words: string) =>
  words
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

export const crumbify = (url: string) => {
  const crumbs = [{ link: '/', label: 'Home' }];

  let currentLink = '';

  url
    .split('/')
    .filter((crumb) => crumb != '')
    .map((item) => {
      currentLink += `/${item}`;

      if (item.length < 24) {
        crumbs.push({
          link: currentLink,
          label: `${capitalizeWords(item.replaceAll('-', ' '))}`,
        });
      }
    });

  return crumbs;
};

export const linkify = (string: string) =>
  string
    .trim() // Trim whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces and consecutive spaces with a single dash
    .replace(/-+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-|-$/g, ''); // Remove leading and trailing dashes

export const unlinkify = (string: string) =>
  capitalizeWords(string.replaceAll('-', ' '));

export const segmentFullName = (
  fullName: string
): { first: string; last: string } => {
  // Trim whitespace
  const trimedName = fullName.trim();

  if (!trimedName) return { first: '', last: '' };

  // Split the name by spaces
  const nameParts = trimedName.split(/\s+/);

  // Handle cases with a single name
  if (nameParts.length === 1) return { first: nameParts[0], last: '' };

  // Combine everything except the last part as first name
  const firstName = nameParts.slice(0, -1).join(' ');
  const lastName = nameParts[nameParts.length - 1];

  return { first: firstName, last: lastName };
};
