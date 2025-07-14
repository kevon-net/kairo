import { Order } from '@/enums/sort';
import { useEffect, useState } from 'react';
import { sortArray } from '@/utilities/helpers/array';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const useSortArray = <T>(
  setList: React.Dispatch<React.SetStateAction<T[]>>,
  getField: (item: T) => any | undefined // (item) => item
) => {
  const [orderMap, setOrderMap] = useState<Record<string, Order>>({});

  const sortItems = (field: keyof T) => {
    setOrderMap((orderMap) => {
      const currentOrder = orderMap[field as string] || Order.DEFAULT;
      const nextOrder =
        currentOrder === Order.DEFAULT || currentOrder === Order.DESCENDING
          ? Order.ASCENDING
          : Order.DESCENDING;

      setList((list) => sortArray([...list], getField, nextOrder)); // Create a copy

      return { ...orderMap, [field]: nextOrder };
    });
  };

  return { sortBy: sortItems, orderMap };
};

export const useDraggable = (params: { list: any[] }) => {
  const [items, setItems] = useState(params.list);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getActiveItem = () => {
    return items.find((item) => item.id === activeId) || null;
  };

  useEffect(() => {
    setItems(params.list); // Sync with external state
  }, [params.list]);

  return {
    items,
    activeId,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    getActiveItem,
  };
};

export const useSortableItem = (params: { id: string; isActive?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: params.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transform ? 'transform .25s ease-out' : undefined, // Reduced from default
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    style,
  };
};

export const useNestedDraggable = (params: { items: any[] }) => {
  const [items, setItems] = useState(params.items);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<
    'item' | 'sub-item' | null
  >(null);
  const [currentContainer, setCurrentContainer] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const findContainer = (id: string) => {
    const item = items.find((item) => item.id === id);

    if (item) return 'item';

    const containerItem = items.find((item) =>
      item.subItems?.some((subItem: any) => subItem.id === id)
    );

    return containerItem ? containerItem.id : null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const container = findContainer(active.id as string);
    setActiveId(active.id as string);
    setActiveContainer(container === 'item' ? 'item' : 'sub-item');
    setCurrentContainer(container === 'item' ? null : container);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (
      activeContainer === 'sub-item' &&
      overContainer !== activeContainer &&
      overContainer !== 'item'
    ) {
      setCurrentContainer(overContainer);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveContainer(null);
      setCurrentContainer(null);
      return;
    }

    if (active.id !== over.id) {
      setItems((items) => {
        const activeData = active.data?.current;
        const overData = over.data?.current;

        if (activeData?.type === 'item') {
          // Handle item reordering
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        } else {
          // Handle sub-item reordering
          const activeItem = items.find((item) =>
            item.subItems?.some((subItem: any) => subItem.id === active.id)
          );
          const overItem =
            overData?.type === 'item'
              ? items.find((item) => item.id === over.id)
              : items.find((item) => item.id === currentContainer);

          if (activeItem !== overItem) {
            // Move sub-item between items
            return items.map((item) => {
              if (item.id === activeItem.id) {
                return {
                  ...item,
                  subItems: item.subItems.filter(
                    (subItem: any) => subItem.id !== active.id
                  ),
                };
              }
              if (item.id === overItem.id) {
                const newSubItems = [...item.subItems];
                const activeSubItem = activeItem.subItems.find(
                  (subItem: any) => subItem.id === active.id
                );
                const overIndex = item.subItems.findIndex(
                  (subItem: any) => subItem.id === over.id
                );
                newSubItems.splice(
                  overIndex >= 0 ? overIndex : newSubItems.length,
                  0,
                  activeSubItem
                );
                return {
                  ...item,
                  subItems: newSubItems,
                };
              }
              return item;
            });
          } else {
            // Reorder within same item
            return items.map((item) => {
              if (item.id === activeItem.id) {
                const oldIndex = item.subItems.findIndex(
                  (subItem: any) => subItem.id === active.id
                );
                const newIndex = item.subItems.findIndex(
                  (subItem: any) => subItem.id === over.id
                );
                return {
                  ...item,
                  subItems: arrayMove(item.subItems, oldIndex, newIndex),
                };
              }
              return item;
            });
          }
        }
      });
    }

    setActiveId(null);
    setActiveContainer(null);
    setCurrentContainer(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveContainer(null);
    setCurrentContainer(null);
  };

  const getActiveItem = () => {
    if (activeContainer === 'item') {
      return items.find((item) => item.id === activeId);
    }
    return items
      .find((item) =>
        item.subItems?.some((subItem: any) => subItem.id === activeId)
      )
      ?.subItems.find((subItem: any) => subItem.id === activeId);
  };

  useEffect(() => {
    setItems(params.items);
  }, [params.items]);

  return {
    items,
    activeId,
    activeContainer,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    getActiveItem,
  };
};
