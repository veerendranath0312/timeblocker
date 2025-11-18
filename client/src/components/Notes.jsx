import { useState } from 'react';
import { PencilLine, Save } from 'lucide-react';
import { Streamdown } from 'streamdown';

function Notes() {
  const [isEdit, setIsEdit] = useState(false);
  const [markdown, setMarkdown] = useState('');

  return (
    <div className="flex flex-col h-full">
      <p className="text-sm text-gray-600 p-2 border-b border-gray-200 font-light flex items-center justify-between shrink-0 text-balance">
        Capture thoughts, ideas, and important notes
        {isEdit ? (
          <Save
            size={18}
            color="black"
            strokeWidth={2.5}
            className="cursor-pointer"
            onClick={() => setIsEdit(false)}
          />
        ) : (
          <PencilLine
            size={18}
            color="black"
            strokeWidth={2.5}
            className="cursor-pointer"
            onClick={() => setIsEdit(true)}
          />
        )}
      </p>
      {isEdit ? (
        <textarea
          className="w-full h-full p-2 border-b border-gray-200 resize-none outline-none font-(--font-family) text-sm no-scrollbar"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      ) : (
        <div className="text-sm tw-full h-full p-2 border-b border-gray-200 no-scrollbar overflow-y-auto">
          {markdown ? (
            <Streamdown>{markdown}</Streamdown>
          ) : (
            <p className="text-gray-500 italic text-[13px]">
              No notes yet. Click the pen icon to add notes.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Notes;
