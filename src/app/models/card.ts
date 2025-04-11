export interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
  imageUrl?: string;
}