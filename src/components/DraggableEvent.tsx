import { useDrag } from 'react-dnd';

const ItemTypes = {
  EVENT: 'event',
};

interface DraggableEventProps {
  event: {
    id: string;
    type: 'job' | 'task' | 'appointment';
    title: string;
    date: number;
    time?: string;
    startTime?: string;
    endTime?: string;
  };
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function DraggableEvent({ event, children, className, onClick }: DraggableEventProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={className}
      onClick={onClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
}
