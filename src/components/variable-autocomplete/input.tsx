import React, { useState, useRef, useEffect } from 'react';
import { getVariablesForAutocomplete } from '@/utils/side-panel/variables/variables.constants';
import { useWorkflowStore } from '@/store/workflow.store';
import { Input } from '../ui/input';

interface VariableAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currentNodeId: string;
  triggerChars?: string[]; // Characters that trigger autocomplete (e.g., ['$', '/'])
}

export const VariableAutocompleteInput: React.FC<VariableAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Type your message...",
  currentNodeId
}) => {
  const { nodes } = useWorkflowStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{label: string, sourceNode: string}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  // Get available variables for autocomplete
  const availableVariables = getVariablesForAutocomplete(nodes, currentNodeId);

  useEffect(() => {
    if (isInputFocused) {
      setSuggestions(availableVariables);
      setShowSuggestions(true);
    } 
  }, [isInputFocused]);

  useEffect(() => {
    if (searchInput) {
      setSuggestions(availableVariables.filter(variable => variable.label.toLowerCase().includes(searchInput.toLowerCase())));
      setShowSuggestions(true);
    } 
  }, [searchInput]);

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSuggestionSelect = (suggestion: {label: string, sourceNode: string}) => {
    const newText = `{{${suggestion.label}}}`;
    onChange(newText);
    setShowSuggestions(false);
    
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && !suggestionsRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className='relative'>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className={`${
            !isInputFocused ? "bg-gray-50" : "bg-white"
          } border-gray-200`}
          value={value}
          onChange={handleInputTextChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />

        <div className='absolute top-1/2 -translate-y-1/2 right-4 z-10'>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.24735 1.66669C1.42428 3.32393 0.997293 5.14965 1.00001 7.00002C1.00001 8.91602 1.44868 10.7267 2.24735 12.3334M11.6673 12.3334C12.4902 10.6761 12.9169 8.85034 12.914 7.00002C12.914 5.08402 12.4653 3.27335 11.6673 1.66669M5.00001 5.00002H5.83068C5.97547 5.00008 6.1163 5.04728 6.23189 5.13449C6.34747 5.22169 6.43153 5.34415 6.47135 5.48335L7.52868 9.18335C7.5685 9.32256 7.65255 9.44502 7.76814 9.53222C7.88372 9.61942 8.02456 9.66662 8.16935 9.66669H9.00001M9.66668 5.00002H9.61335C9.42097 4.99994 9.23086 5.04149 9.05606 5.12181C8.88126 5.20213 8.72591 5.31933 8.60068 5.46535L5.40001 9.20135C5.27471 9.34746 5.11925 9.46471 4.94433 9.54504C4.7694 9.62536 4.57916 9.66686 4.38668 9.66669H4.33335" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="w-fit absolute top-full right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <Input 
            ref={searchInputRef} 
            className={`${
              !isSearchInputFocused ? "bg-gray-50" : "bg-white"
            } w-[calc(100%-24px)] m-3 border border-gray-200 rounded-[8px]`}
            placeholder='Search' 
            value={searchInput} 
            onChange={(e) => setSearchInput(e.target.value)} 
            onFocus={() => setIsSearchInputFocused(true)}
            onBlur={() => setIsSearchInputFocused(false)}
          />
          
          <div className='flex items-center justify-between px-[14px] py-1.5'>
            <span className='text-[13px] font-medium text-gray-500'>NODE</span>
            <span className='text-[13px] font-medium text-gray-500'>DATA</span>
          </div>

          <div className='max-h-32 overflow-y-auto'>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <div className="flex items-center justify-between gap-10">
                  <span className="text-[13px] font-medium text-black border border-gray-200 rounded-[6px] h-5 w-[19px] bg-gray-100 flex items-center justify-center">
                    {suggestion.sourceNode}
                  </span>
                  <span className="text-sm font-medium text-black">
                    {suggestion.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableAutocompleteInput;
