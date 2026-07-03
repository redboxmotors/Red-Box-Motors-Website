'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Generic drag-to-reorder list (admin-cms-build.md §3c/§3d). Rows render via
// renderRow; a successful drop calls onReorder with the full ordered id list.
// Keyboard-sortable out of the box (space to lift, arrows to move).
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderRow,
  disabled,
}: {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  renderRow: (item: T, dragHandle: React.ReactNode) => React.ReactNode;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex).map((i) => i.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className="divide-y divide-rb-line border border-rb-line">
          {items.map((item) => (
            <SortableRow key={item.id} item={item} renderRow={renderRow} disabled={disabled} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow<T extends { id: string }>({
  item,
  renderRow,
  disabled,
}: {
  item: T;
  renderRow: (item: T, dragHandle: React.ReactNode) => React.ReactNode;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  });

  const handle = (
    <button
      type="button"
      aria-label="Reorder"
      {...attributes}
      {...listeners}
      className={`flex h-8 w-6 shrink-0 items-center justify-center text-rb-tx-ghost transition-colors hover:text-rb-tx-mute focus-visible:outline focus-visible:outline-1 focus-visible:outline-rb-red ${
        disabled ? 'cursor-not-allowed opacity-30' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      ⠿
    </button>
  );

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`bg-rb-surface ${isDragging ? 'relative z-10 shadow-rb-hover' : ''}`}
    >
      {renderRow(item, handle)}
    </li>
  );
}
