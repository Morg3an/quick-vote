import React from 'react';

const PollOption = ({ option, selected, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer border px-4 py-2 rounded ${selected ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'
                }`}
        >
            {option.text}
        </div>
    );
};

export default PollOption;