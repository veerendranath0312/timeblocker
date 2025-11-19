import { useState, useContext, useEffect } from 'react';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogContext,
} from './Dialog';
import { useDateStore } from '../store/useDateStore';

// Component to access dialog context and handle form submission
function TaskForm({ task, setTask, onSave, isEdit, onDelete }) {
  const context = useContext(DialogContext);

  const handleSave = () => {
    if (!task.title.trim()) return; // Don't save empty tasks

    onSave(task, () => {
      if (context) {
        context.setIsOpen(false);
      }
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(() => {
        if (context) {
          context.setIsOpen(false);
        }
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col">
      {/* Header with date and delete icon */}
      <div className="flex justify-between items-center mb-6">
        {isEdit && task.date && (
          <p className="text-[13px] text-gray-600 flex items-center gap-1">
            <CalendarDays size={13} color="black" /> {formatDate(task.date)}
          </p>
        )}
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="Delete task"
          >
            <Trash2 size={16} color="black" className="cursor-pointer" />
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <input
          id="name"
          name="title"
          className="h-9 w-full text-[18px] text-zinc-900 outline-hidden sm:text-[18px] border-b border-gray-400 mb-0"
          placeholder="Enter your task"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
        <input
          type="text"
          name="description"
          id="date"
          className="h-9 w-full text-base text-zinc-900 mt-2 outline-hidden sm:text-sm space-y-0"
          placeholder="Add some extra notes here..."
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
        <button
          className="inline-flex items-center justify-center self-end rounded-lg bg-black px-4 py-2 text-sm font-medium text-zinc-50 cursor-pointer"
          type="button"
          onClick={handleSave}
        >
          {isEdit ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  );
}

function Tasks() {
  const currentDate = useDateStore((state) => state.currentDate);
  const tasksByDate = useDateStore((state) => state.tasksByDate);
  const addTaskToStore = useDateStore((state) => state.addTask);
  const updateTaskInStore = useDateStore((state) => state.updateTask);
  const deleteTaskFromStore = useDateStore((state) => state.deleteTask);

  // Get date string for current date
  const dateString = currentDate.toISOString().split('T')[0];
  const tasks = tasksByDate[dateString] || [];

  const [task, setTask] = useState({
    title: '',
    description: '',
    date: '',
    completed: false,
  });

  const [editingTask, setEditingTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Update task form date when currentDate changes
  useEffect(() => {
    const dateString = currentDate.toISOString().split('T')[0];
    setTask((prev) => ({ ...prev, date: dateString }));
  }, [currentDate]);

  const toggleTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTaskInStore(currentDate, taskId, { completed: !task.completed });
    }
  };

  const addTask = (task, onClose) => {
    addTaskToStore(currentDate, task);
    setTask({
      title: '',
      description: '',
      date: currentDate.toISOString().split('T')[0],
      completed: false,
    });
    if (onClose) {
      onClose(); // Close the dialog
    }
  };

  const updateTask = (updatedTask, onClose) => {
    updateTaskInStore(currentDate, updatedTask.id, updatedTask);
    handleCloseEditDialog();
    if (onClose) {
      onClose();
    }
  };

  const deleteTask = (taskId, onClose) => {
    deleteTaskFromStore(currentDate, taskId);
    handleCloseEditDialog();
    if (onClose) {
      onClose();
    }
  };

  const handleTaskClick = (task) => {
    setEditingTask({ ...task });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="flex flex-col h-full">
      <p className="text-sm text-gray-600 p-2 border-b border-gray-200 font-light flex items-center justify-between shrink-0 text-balance">
        Manage daily tasks and track your progress
        <Dialog>
          <DialogTrigger className="p-0 border-0 bg-transparent hover:bg-transparent">
            <Plus
              size={18}
              color="black"
              strokeWidth={2.5}
              className="cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="w-full max-w-md bg-(--color-2) p-6">
            <TaskForm
              task={task}
              setTask={setTask}
              onSave={addTask}
              isEdit={false}
            />
            {/* <DialogClose /> */}
          </DialogContent>
        </Dialog>
      </p>
      <ul className="list-none">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex gap-2 p-2 items-start border-b border-dotted border-gray-300"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="task-checkbox mt-1 w-4 h-4 cursor-pointer appearance-none border-2 border-gray-400 rounded-sm focus:outline-none transition-colors"
              onClick={(e) => e.stopPropagation()}
            />
            <Dialog
              open={isEditDialogOpen && editingTask?.id === task.id}
              onOpenChange={(open) => {
                if (!open) {
                  setIsEditDialogOpen(false);
                  setEditingTask(null);
                } else {
                  handleTaskClick(task);
                }
              }}
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <p
                  className={`font-bold text-[15px] ${
                    task.completed ? 'line-through text-gray-500' : 'text-black'
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p
                    className={`text-[13px] mt-0.5 ${
                      task.completed ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
              <DialogContent className="w-full max-w-md bg-(--color-2) p-6">
                {editingTask && (
                  <TaskForm
                    task={editingTask}
                    setTask={setEditingTask}
                    onSave={updateTask}
                    isEdit={true}
                    onDelete={() => deleteTask(task.id)}
                  />
                )}
                {/* <DialogClose /> */}
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
