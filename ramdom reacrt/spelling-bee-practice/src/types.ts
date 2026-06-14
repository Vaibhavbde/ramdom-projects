export type Difficulty = "easy" | "medium" | "hard";

export type WordEntry = {
  id: string;
  word: string;
  difficulty: Difficulty;
  category: string;
  definition?: string;
};
