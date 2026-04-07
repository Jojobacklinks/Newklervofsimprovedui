import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export function EditTaskModal({ isOpen, task, onClose, onSave }: EditTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('');

  useEffect(() => {
    // Parse the existing due date (format: "Feb 12, 2026, 2:13 pm")
    if (task.dueDate) {
      const dateTimeMatch = task.dueDate.match(/([A-Za-z]+\s\d+,\s\d+),\s(\d+:\d+\s[ap]m)/);
      if (dateTimeMatch) {
        setTaskDueDate(dateTimeMatch[1]);
        setTaskDueTime(dateTimeMatch[2]);
      }
    }
    setTaskTitle(task.title);
  }, [task]);

  const handleSave = () => {
    const updatedTask: Task = {
      id: task.id,
      title: taskTitle,
      dueDate: `${taskDueDate}, ${taskDueTime}`
    };
    onSave(updatedTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="bg-white rounded-[20px] w-full max-w-lg p-6 relative mx-4" style={{ boxShadow: 'rgba(226, 232, 240, 0.5) 0px 2px 16px 2px' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Edit task</h2>

        <div className="space-y-4">
          <textarea
            placeholder="Your note goes here..."
            rows={6}
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#e8e8e8] rounded-[15px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
          />

          <div>
            <label className="text-sm text-gray-900 mb-2 block">Due date:</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Sat Feb 7, 2026"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="12:00 AM"
                value={taskDueTime}
                onChange={(e) => setTaskDueTime(e.target.value)}
                className="px-4 py-2.5 border border-[#e8e8e8] rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-sm border border-[#e8e8e8] text-[#051046] rounded-[32px] hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[#9473ff] text-white text-sm font-medium rounded-[32px] hover:bg-[#7f5fd9]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
