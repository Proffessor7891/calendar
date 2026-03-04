export interface Task {
  _id: string;
  title: string;
  date: string; // YYYY-MM-DD
  order: number;
  color?: string;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  localName: string;
  name: string;
  countryCode: string;
}

export interface DragItem {
  taskId: string;
  sourceDate: string;
  sourceIndex: number;
}
