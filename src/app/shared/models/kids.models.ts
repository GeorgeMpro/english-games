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

/**
 * Represents a base card used in the game, containing common properties
 * such as an ID, text, and a matched status.
 */
export interface BaseCard {
  id: number;
  text: string;
  matched: boolean;
}

/** A game card with a word*/
export interface WordCard extends BaseCard {
}

/** A game with an image*/
export interface ImageCard extends BaseCard {
  url: string;
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

export interface MatchAttempt {
  attempts: number;
  correctOnFirstTry: boolean;
}
