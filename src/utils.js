export const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) {
    const base = import.meta.env.BASE_URL || '/';
    return base.endsWith('/') ? base + url.slice(1) : base + url;
  }
  return url;
};
