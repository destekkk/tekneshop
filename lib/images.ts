/** Unsplash — deniz araçları ve denizcilik (w×h kırpılmış) */
export function listingImage(url: string, w = 400, h = 300) {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${w}&h=${h}&fit=crop&q=80`;
}

export const boatImages = {
  motoryat: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
  motoryat2: "https://images.unsplash.com/photo-1605281317010-fe6ffe1f1a8a",
  yelkenli: "https://images.unsplash.com/photo-1505118380757-91f5beb46e23",
  sisme: "https://images.unsplash.com/photo-1598486511532-9e4d25384e44",
  jetSki: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
  katamaran: "https://images.unsplash.com/photo-1568605117032-23572b263c2d",
  kiralik: "https://images.unsplash.com/photo-1605281317010-fe6ffe1f1a8a",
} as const;

export const partImages = {
  motor: "https://images.unsplash.com/photo-1605746180344-9c53a0a3c0d8",
  guvenlik: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
  navigasyon: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
  bakim: "https://images.unsplash.com/photo-1544551763-77ef1f2d5c5a",
  elektrik: "https://images.unsplash.com/photo-1509409093375-9f4c79e1b3c1",
  pervane: "https://images.unsplash.com/photo-1598486511532-9e4d25384e44",
} as const;
