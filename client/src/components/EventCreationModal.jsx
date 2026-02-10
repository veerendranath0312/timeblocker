import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, AlignLeft, Calendar as CalendarIcon, MapPin, User, Video, Check, Trash2 } from 'lucide-react';

const COLORS = [
    { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-900', ring: 'ring-blue-500', fill: 'bg-blue-500' },
    { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-900', ring: 'ring-green-500', fill: 'bg-green-500' },
    { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-900', ring: 'ring-amber-500', fill: 'bg-amber-500' },
    { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-900', ring: 'ring-purple-500', fill: 'bg-purple-500' },
    { bg: 'bg-pink-100', border: 'border-pink-500', text: 'text-pink-900', ring: 'ring-pink-500', fill: 'bg-pink-500' },
    { bg: 'bg-cyan-100', border: 'border-cyan-500', text: 'text-cyan-900', ring: 'ring-cyan-500', fill: 'bg-cyan-500' },
    { bg: 'bg-gray-100', border: 'border-gray-500', text: 'text-gray-900', ring: 'ring-gray-500', fill: 'bg-gray-500' },
];
export function EventCreationModal({ isOpen, onClose, onSave, onDelete, initialData, position }) {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title || '');
            setStartTime(initialData.startTime || '');
            setEndTime(initialData.endTime || '');
            setDescription(initialData.description || '');

            // Try to find matching color from initialData
            if (initialData.color) {
                // The color string in initialData is a class string like "bg-blue-100 border-l-4 border-blue-500 text-blue-900"
                // We need to find the COLOR object that matches one of these classes, e.g. border-blue-500
                const colorMatch = COLORS.find(c => initialData.color.includes(c.border));
                if (colorMatch) {
                    setSelectedColor(colorMatch);
                } else {
                    // Fallback or keep default if no match found (e.g. custom color or legacy data)
                    // If it's a new event, initialData.color might be set by the scheduler (which uses the cycle)
                    // Let's try to match by bg as well
                    const bgMatch = COLORS.find(c => initialData.color.includes(c.bg));
                    if (bgMatch) setSelectedColor(bgMatch);
                }
            }

            // Focus title input on open
            setTimeout(() => {
                document.getElementById('event-title-input')?.focus();
            }, 50);
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startTime || !endTime) {
            alert('Please specify both start and end times.');
            return;
        }

        onSave({
            ...initialData,
            title: title || 'New Event',
            startTime,
            endTime,
            description,
            color: `${selectedColor.bg} border-l-4 ${selectedColor.border} ${selectedColor.text}`,
        });
    };

    // Calculate position
    const getModalStyle = () => {
        if (!position) {
            // Fallback to center if no position provided
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        // Default to positioning near the click
        // We want to prevent overflow off the screen
        const modalWidth = 400;
        const modalHeight = 350; // Approximated height
        const padding = 20;

        let left = position.x;
        let top = position.y;

        // Check right edge
        if (left + modalWidth > window.innerWidth - padding) {
            left = window.innerWidth - modalWidth - padding;
        }

        // Check bottom edge
        if (top + modalHeight > window.innerHeight - padding) {
            top = window.innerHeight - modalHeight - padding;
        }

        return {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
        };
    };

    const modalStyle = getModalStyle();

    return (
        <div className="fixed inset-0 z-50">
            {/* Transparent backdrop to handle outside clicks is managed by ref/listener, but we can add one if needed. 
               The current implementation uses a document listener, which is fine. 
               We just need the container to NOT block clicks if we want true 'modeless' feel, 
               but for a modal, blocking interaction with the back is usually preferred or at least accepted.
               However, to make it feel like a "popup", we might want a transparent full-screen div.
           */}
            <div
                ref={modalRef}
                style={modalStyle}
                className="bg-white text-gray-700 rounded-lg shadow-2xl w-[275px] overflow-hidden border border-gray-200 animation-in fade-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50 drag-handle cursor-move">
                    <span className="text-sm font-medium text-gray-400">
                        {initialData?.id ? 'Edit Event' : 'Create Event'}
                    </span>
                    <div className="flex items-center gap-2">
                        {initialData?.id && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(initialData.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors mr-2 cursor-pointer"
                                title="Delete Event"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-3 py-4 space-y-4">

                    {/* Title Input */}
                    <div className="relative">
                        <input
                            id="event-title-input"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-sm focus:ring-1 focus:ring-gray-200 focus:bg-gray-100 rounded p-2 font-medium text-black  focus:outline-none"
                            autoComplete="off"
                        />
                    </div>

                    {/* Time Selection */}
                    <div className="flex items-center gap-3 text-sm text-gray-300 pl-2">
                        <Clock size={16} className="text-gray-500 shrink-0" />
                        <div className="flex items-center gap-2">
                            <input
                                type="string"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="rounded px-2 py-1 w-20 text-center focus:ring-1 focus:ring-gray-200 focus:bg-gray-100 focus:outline-none border border-gray-200 text-gray-600"
                            />
                            <span className="text-gray-500">→</span>
                            <input
                                type="string"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="rounded px-2 py-1 w-20 text-center focus:ring-1 focus:ring-gray-200 focus:bg-gray-100 focus:outline-none border border-gray-200 text-gray-600"
                            />
                            {/* We could add duration calc here if we want */}
                        </div>
                    </div>

                    {/* Date Display (Static for now based on initialData) */}
                    <div className="flex items-center gap-3 text-sm text-gray-300 pl-2">
                        <CalendarIcon size={16} className="text-gray-500 shrink-0" />
                        <span className="text-gray-600">
                            {initialData?.date ? new Date(initialData.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date'}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-3 mt-2">
                        {/* <AlignLeft size={16} className="text-gray-500 shrink-0 mt-1" /> */}
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-transparent text-[13px] text-gray-700 placeholder-gray-500 focus:ring-1 focus:ring-gray-200 focus:bg-gray-100 focus:outline-none rounded p-2 resize-none min-h-[60px]"
                        />
                    </div>

                    {/* Color Selector */}
                    <div className="flex items-center gap-2 px-2">
                        {COLORS.map((color, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`w-4 h-4 rounded-sm ${color.fill} flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-offset-1 ring-gray-300' : ''}`}
                            >
                                {selectedColor === color && <Check size={12} className="text-white" strokeWidth={3} />}
                            </button>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 pt-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#2a2a2a] rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-medium bg-[var(--color-6)] hover:opacity-90 text-black rounded-md transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
                        >
                            Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
