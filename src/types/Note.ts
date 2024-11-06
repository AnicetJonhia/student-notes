
export type Note = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: {
    name: string;
    color: string;
  };
};