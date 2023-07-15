import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";

export const removeAtIndex = (array: any[], index: number): any[] => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (
  array: any[],
  index: number,
  item: any
): any[] => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (
  array: any[],
  oldIndex: number,
  newIndex: number
): any[] => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};
