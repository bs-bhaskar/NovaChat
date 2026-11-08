import React from "react";
import { format } from "date-fns";

const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "hh:mm a");
};

const StatusList = ({ contact, onPreview, theme }) => {
    const lastStatus = contact.statuses[contact.statuses.length - 1];

    return (
        <div
            className="flex items-center space-x-4 py-2 cursor-pointer"
            onClick={onPreview}
        >
            <div className="relative">
                <img
                    src={contact.avatar}
                    alt={contact?.name}
                    className="h-14 w-14 rounded-full object-cover"
                />

                <svg className="absolute top-0 left-0 w-14 h-14" viewBox="0 0 100 100">
                    {contact.statuses.map((_, index) => (
                        <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="48"
                            fill="none"
                            stroke="#250366"
                            strokeWidth="4"
                            transform="rotate(-90 50 50)"
                        />
                    ))}
                </svg>
            </div>

            <div>
                <p className="font-semibold">{contact?.name}</p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {formatTimestamp(lastStatus?.timestamp)}
                </p>
            </div>
        </div>
    );
};

export default StatusList;