import { useDrop } from 'react-dnd';

const ItemTypes = {
  EVENT: 'event',
};

interface DroppableCalendarCellProps {
  date: number;
  hour?: number | null; // Optional hour for week/day views
  onDrop: (event: any, newDate: number, newHour?: number | null) => void;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DroppableCalendarCell({ date, hour, onDrop, children, className, onClick }: DroppableCalendarCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.EVENT,
    drop: (item: { event: any }) => {
      onDrop(item.event, date, hour);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: isActive ? 'rgba(148, 115, 255, 0.1)' : undefined,
        borderColor: isActive ? '#9473ff' : undefined,
      }}
    >
      {children}
    </div>
  );
}
