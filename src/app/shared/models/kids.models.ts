/** Represents a matchable item with a word and image from Wikipedia. */
export interface MatchItem {
  id: number;
  word: string;
  imageUrl: string;
  wikiUrl: string;
  matched: boolean;
}

/** Raw Wikipedia page structure returned by the API. */
export interface WikiPage {
  title: string;
  thumbnail?: { source: string };
  fullurl: string;
}

/** Wikipedia API response for a batch query. */
export interface WikiQueryResponse {
  query: { pages: Record<string, WikiPage> };
}

/** A game card with a word*/
export interface WordCard {
  id: number;
  text: string;
  matched: boolean;
}

/** A game with an image*/
export interface ImageCard {
  id: number;
  url: string;
  text: string;
  matched: boolean;
}

/** Category metadata for specific age groups*/
export interface AgeCategory {
  label: string,
  icon: string,
  route: string
}

/**
 * Represents the result of a match attempt in the game.
 */
export interface MatchResult {
  updatedWords: WordCard[];
  updatedImages: ImageCard[];
  message: string;
}
