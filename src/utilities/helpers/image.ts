export const getFallbackSrc = (fallback?: {
  width: number;
  height: number;
  text: string;
}) => {
  return fallback
    ? `https://placehold.co/${fallback.width || 800}x${fallback.height || 800}?text=${fallback.text || 'Placeholder'}`
    : undefined;
};
