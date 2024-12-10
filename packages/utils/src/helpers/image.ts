export const getFallbackSrc = (fallback?: {
  width: number;
  height: number;
  text: string;
}) => {
  return fallback
    ? `https://placehold.co/${fallback.width}x${fallback.height}?text=${fallback.text || 'Placeholder'}`
    : undefined;
};
