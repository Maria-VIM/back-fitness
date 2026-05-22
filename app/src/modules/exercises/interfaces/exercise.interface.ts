export interface ExerciseInterface {
  id: string;
  title: string;
  content: string;
  imagePath: string | null;
  during: number;
  createdAt: Date;
  deletedAt: Date | null;
  categories: string[] | null;
  categoriesId: number[] | null;
}
