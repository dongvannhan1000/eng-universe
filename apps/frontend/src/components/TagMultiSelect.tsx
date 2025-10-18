// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { TAGS } from "../features/decks/mock/fixtures";

// interface TagMultiSelectProps {
//   selectedTags: string[];
//   onChange: (tags: string[]) => void;
// }

// export const TagMultiSelect = React.memo<TagMultiSelectProps>(({ selectedTags, onChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleTagToggle = (tag: string) => {
//     const newTags = selectedTags.includes(tag)
//       ? selectedTags.filter((t) => t !== tag)
//       : [...selectedTags, tag];
//     onChange(newTags);
//   };

//   const handleKeyDown = (event: React.KeyboardEvent, tag: string) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       handleTagToggle(tag);
//     }
//   };

//   return (
//     <div className="relative" ref={containerRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center justify-between w-full px-3 py-2 text-left bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
//         aria-haspopup="listbox"
//         aria-expanded={isOpen}
//         aria-label={`Filter by tags. ${selectedTags.length} tags selected`}
//       >
//         <span className="block truncate">
//           {selectedTags.length === 0
//             ? "Select tags..."
//             : `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"} selected`}
//         </span>
//         <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
//           <div className="py-1" role="listbox">
//             {TAGS.map((tag) => (
//               <div
//                 key={tag}
//                 role="option"
//                 aria-selected={selectedTags.includes(tag)}
//                 tabIndex={0}
//                 className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none"
//                 onClick={() => handleTagToggle(tag)}
//                 onKeyDown={(e) => handleKeyDown(e, tag)}
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedTags.includes(tag)}
//                   onChange={() => handleTagToggle(tag)}
//                   className="mr-3 h-4 w-4 text-primary focus:ring-ring border-border rounded"
//                   tabIndex={-1}
//                 />
//                 <span className="text-sm">{tag}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// });

// TagMultiSelect.displayName = "TagMultiSelect";
