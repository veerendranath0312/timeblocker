import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Calendar, X } from 'lucide-react';
import { EventCreationModal } from './EventCreationModal';
import { cn } from '../lib/utils';

const COLORS = [
  'bg-blue-100 border-l-4 border-blue-500 text-blue-900',
  'bg-green-100 border-l-4 border-green-500 text-green-900',
  'bg-amber-100 border-l-4 border-amber-500 text-amber-900',
  'bg-purple-100 border-l-4 border-purple-500 text-purple-900',
  'bg-pink-100 border-l-4 border-pink-500 text-pink-900',
  'bg-cyan-100 border-l-4 border-cyan-500 text-cyan-900',
];

const CELL_HEIGHT = 60; // Height per hour
const START_HOUR = 0;
const END_HOUR = 23;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
); // [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]

export function ResourceSchedular({
  events,
  resources,
  currentDate,
  onDateChange,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}) {


  const [draggedEvent, setDraggedEvent] = useState(null);
  const [resizingEvent, setResizingEvent] = useState(null);
  const [enabledPlans, setEnabledPlans] = useState(() => {
    // Initially only plan-a is enabled
    return new Set(['plan-a']);
  });
  const [currentPlan, setCurrentPlan] = useState('plan-a');
  const [replanTimes, setReplanTimes] = useState({}); // { 'plan-b': '14:00', 'plan-c': '15:00' }
  const [crossedOffEvents, setCrossedOffEvents] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null); // { x, y, resourceIndex, time }

  const [creationModalOpen, setCreationModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);

  const gridRef = useRef(null);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    onDateChange(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    onDateChange(nextDate);
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onDateChange(today);
  };

  // const handleReplan = () => {
  //   // Enable all plans when replan is clicked
  //   setEnabledPlans(new Set(resources.map((r) => r.id)));
  // };

  const dateString = currentDate.toISOString().split('T')[0];
  const todayEvents = events.filter((e) => e.date === dateString);

  const handleCreateEventAtTime = (selectedTime, position) => {
    // Create a default 30-minute event at the clicked time
    const [hour, min] = selectedTime.split(':').map(Number);
    const startMinutes = hour * 60 + min;
    const endMinutes = startMinutes + 30;

    const startHour = Math.floor(startMinutes / 60);
    const startMin = startMinutes % 60;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;

    const startTime = `${String(startHour).padStart(2, '0')}:${String(
      startMin
    ).padStart(2, '0')}`;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(
      endMin
    ).padStart(2, '0')}`;



    setNewEventData({
      title: '',
      startTime,
      endTime,
      date: dateString,
      resourceId: currentPlan,
      color: COLORS[events.length % COLORS.length],
    });

    // Adjust position to not be exactly under cursor if possible, or just pass as is
    setModalPosition(position);
    setCreationModalOpen(true);
    closeContextMenu();
  };

  const handleSaveNewEvent = (eventData) => {
    if (eventData.id) {
      onUpdateEvent(eventData.id, eventData);
    } else {
      onAddEvent(eventData);
    }
    setCreationModalOpen(false);
    setNewEventData(null);
  };

  const handleDeleteEventFromModal = (eventId) => {
    onDeleteEvent(eventId);
    setCreationModalOpen(false);
    setNewEventData(null);
  };

  const handleReplanAtTime = (selectedTime, resourceIndex) => {
    const resource = resources[resourceIndex];
    if (resource.id !== currentPlan) return;

    // Find the next plan
    const currentIndex = resources.findIndex((r) => r.id === currentPlan);
    if (currentIndex === -1 || currentIndex === resources.length - 1) return;

    const nextPlan = resources[currentIndex + 1];
    const nextPlanId = nextPlan.id;

    // Find all events in current plan that start at or after selectedTime
    const [selectedHour, selectedMin] = selectedTime.split(':').map(Number);
    const selectedMinutes = selectedHour * 60 + selectedMin;

    const eventsToCrossOff = todayEvents.filter((event) => {
      if (event.resourceId !== currentPlan) return false;
      const [startHour, startMin] = event.startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      return startMinutes >= selectedMinutes;
    });

    // Mark events as crossed-off
    const newCrossedOffEvents = new Set(crossedOffEvents);
    eventsToCrossOff.forEach((event) => {
      newCrossedOffEvents.add(event.id);
      // Mark event as read-only
      onUpdateEvent(event.id, { editable: false });
    });

    setCrossedOffEvents(newCrossedOffEvents);

    // Activate next plan
    setEnabledPlans((prev) => new Set([...prev, nextPlanId]));
    setCurrentPlan(nextPlanId);
    setReplanTimes((prev) => ({
      ...prev,
      [nextPlanId]: selectedTime,
    }));

    // Close context menu
    setContextMenu(null);
  };

  const handleContextMenu = (e, resourceIndex) => {
    e.preventDefault();
    const resource = resources[resourceIndex];
    if (resource.id !== currentPlan) return;

    const position = getPositionFromMouseEvent(e, resourceIndex);
    if (!position) return;

    const timeString = `${String(position.hour).padStart(2, '0')}:${String(
      position.minutes
    ).padStart(2, '0')}`;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      resourceIndex,
      time: timeString,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const getPositionFromMouseEvent = (e, resourceIndex) => {
    if (!gridRef.current) return null;

    const rect = gridRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const totalHours = relativeY / CELL_HEIGHT;
    const hour = Math.floor(totalHours) + START_HOUR;
    const minutes = Math.round(((totalHours % 1) * 60) / 15) * 15; // Snap to 15-minute intervals
    return { resourceIndex, hour, minutes };
  };

  const getMinutesFromY = (y) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const relativeY = y - rect.top;
    const totalHours = relativeY / CELL_HEIGHT;
    const totalMinutes = totalHours * 60 + START_HOUR * 60;
    return Math.round(totalMinutes / 15) * 15; // Snap to 15-minute intervals
  };

  const minutesToTimeString = (minutes) => {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  };

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };





  const handleEventMouseDown = (e, event) => {
    if (!enabledPlans.has(event.resourceId)) return;
    if (crossedOffEvents.has(event.id)) return; // Prevent interaction with crossed-off events
    if (event.resourceId !== currentPlan) return; // Prevent interaction with previous plan events

    if (e.target.closest('.resize-handle')) return;
    if (e.target.closest('button')) return;

    e.preventDefault();
    e.stopPropagation();
    setDraggedEvent({
      id: event.id,
      startY: e.clientY,
      originalStart: event.startTime,
      originalEnd: event.endTime,
    });
  };

  const handleResizeMouseDown = (e, event, edge) => {
    if (!enabledPlans.has(event.resourceId)) return;
    if (crossedOffEvents.has(event.id)) return; // Prevent resizing crossed-off events
    if (event.resourceId !== currentPlan) return; // Prevent resizing previous plan events

    e.preventDefault();
    e.stopPropagation();

    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);

    setResizingEvent({
      id: event.id,
      edge,
      startY: e.clientY,
      originalStartMinutes: startHour * 60 + startMin,
      originalEndMinutes: endHour * 60 + endMin,
    });
  };

  const handleMouseMove = (e) => {
    if (draggedEvent) {
      const deltaMinutes = getMinutesFromY(e.clientY);
      const originalMinutes = getMinutesFromY(draggedEvent.startY);

      if (deltaMinutes === null || originalMinutes === null) return;

      const diff = deltaMinutes - originalMinutes;

      const [startHour, startMin] = draggedEvent.originalStart
        .split(':')
        .map(Number);
      const [endHour, endMin] = draggedEvent.originalEnd.split(':').map(Number);

      const originalStartMinutes = startHour * 60 + startMin;
      const originalEndMinutes = endHour * 60 + endMin;
      const duration = originalEndMinutes - originalStartMinutes;

      let newStartMinutes = originalStartMinutes + diff;
      let newEndMinutes = newStartMinutes + duration;

      // Clamp to valid range
      const minMinutes = START_HOUR * 60;
      const maxMinutes = END_HOUR * 60;

      if (newStartMinutes < minMinutes) {
        newStartMinutes = minMinutes;
        newEndMinutes = newStartMinutes + duration;
      }
      if (newEndMinutes > maxMinutes) {
        newEndMinutes = maxMinutes;
        newStartMinutes = newEndMinutes - duration;
      }

      onUpdateEvent(draggedEvent.id, {
        startTime: minutesToTimeString(newStartMinutes),
        endTime: minutesToTimeString(newEndMinutes),
      });
    } else if (resizingEvent) {
      const deltaMinutes = getMinutesFromY(e.clientY);
      const originalMinutes = getMinutesFromY(resizingEvent.startY);

      if (deltaMinutes === null || originalMinutes === null) return;

      const diff = deltaMinutes - originalMinutes;

      let newStartMinutes = resizingEvent.originalStartMinutes;
      let newEndMinutes = resizingEvent.originalEndMinutes;

      if (resizingEvent.edge === 'top') {
        newStartMinutes = resizingEvent.originalStartMinutes + diff;
        // Ensure minimum 30 minutes
        if (newEndMinutes - newStartMinutes < 30) {
          newStartMinutes = newEndMinutes - 30;
        }
      } else {
        newEndMinutes = resizingEvent.originalEndMinutes + diff;
        // Ensure minimum 30 minutes
        if (newEndMinutes - newStartMinutes < 30) {
          newEndMinutes = newStartMinutes + 30;
        }
      }

      // Clamp to valid range
      const minMinutes = START_HOUR * 60;
      const maxMinutes = END_HOUR * 60;
      newStartMinutes = Math.max(
        minMinutes,
        Math.min(newStartMinutes, maxMinutes - 30)
      );
      newEndMinutes = Math.max(
        newStartMinutes + 30,
        Math.min(newEndMinutes, maxMinutes)
      );

      onUpdateEvent(resizingEvent.id, {
        startTime: minutesToTimeString(newStartMinutes),
        endTime: minutesToTimeString(newEndMinutes),
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedEvent(null);
    setResizingEvent(null);
  };

  const getEventStyle = (event) => {
    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;

    const topPosition = ((startMinutes - START_HOUR * 60) / 60) * CELL_HEIGHT;
    const height = (durationMinutes / 60) * CELL_HEIGHT;

    return {
      top: `${topPosition}px`,
      height: `${height}px`,
    };
  };

  // Close context menu when clicking outside
  const handleClickOutside = (e) => {
    if (contextMenu && !e.target.closest('.context-menu')) {
      closeContextMenu();
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-background"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClickOutside}
    >
      <div className="w-full border-b border-black p-2 flex items-center justify-between bg-muted/30">
        <div className="text-base font-semibold flex items-center gap-1">
          <Calendar size={16} />
          {formatDate(currentDate)}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* <div
              onClick={handleReplan}
              className="text-sm flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full px-3 py-1 cursor-pointer"
            >
              Replan
            </div> */}

            <div
              onClick={handleToday}
              className="text-sm flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full px-3 py-1 cursor-pointer"
            >
              Today
            </div>
            <div className="flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full p-1 cursor-pointer">
              <ChevronLeft size={20} onClick={handlePrevDay} />
            </div>
            <div className="flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full p-1 cursor-pointer">
              <ChevronRight size={20} onClick={handleNextDay} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="sticky top-0 z-20 bg-background border-b grid"
        style={{ gridTemplateColumns: `80px repeat(${resources.length}, 1fr)` }}
      >
        <div className="border-r bg-muted/30 flex items-center justify-center text-xs font-medium p-3">
          Time
        </div>
        {resources.map((resource) => {
          const isEnabled = enabledPlans.has(resource.id);
          const isCurrentPlan = resource.id === currentPlan;
          return (
            <div
              key={resource.id}
              className={cn(
                'border-r p-3 text-center text-xs font-semibold bg-muted/30 flex flex-wrap items-center justify-center gap-2',
                !isEnabled && 'opacity-50',
                isCurrentPlan && ''
              )}
            >
              {resource.name}
              {isCurrentPlan && (
                <span className="text-[10px] font-medium px-[6px] py-[2px] text-black border border-black rounded-full bg-(--color-6)">
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `80px repeat(${resources.length}, 1fr)`,
          }}
        >
          {/* Hours labels */}
          <div className="border-r">
            {HOURS.map((hour, hourIndex) => (
              <div
                key={hour}
                className={cn(
                  'text-xs text-muted-foreground text-right pr-2 pt-1',
                  hourIndex < HOURS.length - 1 && 'border-b'
                )}
                style={{ height: CELL_HEIGHT }}
              >
                {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>

          {/* Resource columns */}
          {resources.map((resource, idx) => {
            const isEnabled = enabledPlans.has(resource.id);
            const replanTime = replanTimes[resource.id];
            const isCurrentPlan = resource.id === currentPlan;

            return (
              <div
                key={resource.id}
                className={cn(
                  'border-r relative',
                  !isEnabled && 'opacity-50 pointer-events-none'
                )}
                ref={idx === 0 ? gridRef : undefined}
                onContextMenu={(e) => {
                  if (isCurrentPlan) {
                    handleContextMenu(e, idx);
                  }
                }}
              >
                {/* Hours cells */}
                {HOURS.map((hour, hourIndex) => {
                  // Check if this hour cell is before replan time (disabled area)
                  // Disable hours that start before the replan time
                  const hourStartMinutes = hour * 60;
                  const isBeforeReplanTime =
                    replanTime &&
                    (() => {
                      const [replanHour, replanMin] = replanTime
                        .split(':')
                        .map(Number);
                      const replanMinutes = replanHour * 60 + replanMin;
                      // Disable if the hour starts before the replan time
                      return hourStartMinutes < replanMinutes;
                    })();

                  const isDisabledArea =
                    isCurrentPlan && replanTime && isBeforeReplanTime;
                  const isLastHour = hourIndex === HOURS.length - 1;

                  return (
                    <div
                      key={hour}
                      className={cn(
                        'transition-colors relative',
                        !isLastHour && 'border-b',
                        isEnabled && !isDisabledArea
                          ? 'hover:bg-muted/20 cursor-crosshair'
                          : 'cursor-not-allowed',
                        isDisabledArea && 'bg-gray-100 opacity-50'
                      )}
                      style={{ height: CELL_HEIGHT }}
                    />
                  );
                })}

                {/* Events in this resource column */}
                {todayEvents
                  .filter((event) => event.resourceId === resource.id)
                  .map((event) => {
                    const style = getEventStyle(event);
                    const isCrossedOff = crossedOffEvents.has(event.id);
                    const isPreviousPlan = event.resourceId !== currentPlan;
                    const canDelete = !isCrossedOff && !isPreviousPlan;
                    const canInteract = !isCrossedOff && !isPreviousPlan;

                    return (
                      <div
                        key={event.id}
                        onMouseDown={(e) => handleEventMouseDown(e, event)}
                        className={cn(
                          'schedule-event absolute left-1 right-1 rounded shadow-sm group hover:shadow-md transition-all overflow-hidden select-none',
                          event.color,
                          draggedEvent?.id === event.id && 'opacity-90',
                          resizingEvent?.id === event.id && 'opacity-50',
                          canInteract ? 'cursor-move' : 'cursor-not-allowed',
                          isCrossedOff && 'opacity-50'
                        )}
                        style={style}
                      >
                        {canInteract && (
                          <div
                            className="resize-handle absolute top-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-opacity"
                            onMouseDown={(e) =>
                              handleResizeMouseDown(e, event, 'top')
                            }
                          />
                        )}

                        <div className="flex items-start justify-between h-full p-2 gap-1">
                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                'text-xs font-medium line-clamp-2',
                                canInteract
                                  ? 'cursor-pointer'
                                  : 'cursor-not-allowed',
                                isCrossedOff && 'line-through',
                                isCrossedOff && 'opacity-50'
                              )}
                              onClick={(e) => {
                                if (canInteract) {
                                  e.stopPropagation();
                                  setNewEventData(event);
                                  setModalPosition({ x: e.clientX, y: e.clientY });
                                  setCreationModalOpen(true);
                                }
                              }}
                            >
                              {event.title}
                            </div>
                            <div
                              className={cn(
                                'text-[10px] opacity-70 mt-1',
                                isCrossedOff && 'line-through'
                              )}
                            >
                              {formatTime12Hour(event.startTime)} -{' '}
                              {formatTime12Hour(event.endTime)}
                            </div>
                          </div>
                        </div>

                        {canInteract && (
                          <div
                            className="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-opacity"
                            onMouseDown={(e) =>
                              handleResizeMouseDown(e, event, 'bottom')
                            }
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg p-1 flex flex-col"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            onClick={() => {
              handleCreateEventAtTime(contextMenu.time, { x: contextMenu.x, y: contextMenu.y });
            }}
            className="text-left px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer rounded-sm"
          >
            Create Event ({formatTime12Hour(contextMenu.time)})
          </button>
          <button
            onClick={() => {
              handleReplanAtTime(contextMenu.time, contextMenu.resourceIndex);
            }}
            className="text-left px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer rounded-sm"
          >
            Re-Plan ({formatTime12Hour(contextMenu.time)})
          </button>
        </div>
      )}
      {/* Event Creation Modal */}
      <EventCreationModal
        isOpen={creationModalOpen}
        onClose={() => setCreationModalOpen(false)}
        onSave={handleSaveNewEvent}
        onDelete={handleDeleteEventFromModal}
        initialData={newEventData}
        position={modalPosition}
      />
    </div>
  );
}
