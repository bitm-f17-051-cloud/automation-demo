import React, { useState, useRef, useEffect } from 'react';
import { getVariablesForAutocomplete } from '@/utils/side-panel/variables/variables.constants';
import { useWorkflowStore } from '@/store/workflow.store';

interface VariableAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currentNodeId: string;
  triggerChars?: string[]; // Characters that trigger autocomplete (e.g., ['$', '/'])
}

export const VariableAutocomplete: React.FC<VariableAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Type your message...",
  currentNodeId,
  triggerChars = ['$']
}) => {
  const { nodes } = useWorkflowStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{label: string, sourceNode: string}>>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get available variables for autocomplete
  const availableVariables = getVariablesForAutocomplete(nodes, currentNodeId);

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(cursorPos);
    
    // Check if cursor is after a trigger character
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastTriggerChar = triggerChars.find(char => textBeforeCursor.endsWith(char));
    
    if (lastTriggerChar) {
      // Show suggestions
      setSuggestions(availableVariables);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: {label: string, sourceNode: string}) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Find the last trigger character
    const lastTriggerChar = triggerChars.find(char => textBeforeCursor.endsWith(char));
    
    if (lastTriggerChar) {
      // Replace the trigger character with the variable
      const newText = textBeforeCursor.slice(0, -1) + `{{${suggestion.label}}}` + textAfterCursor;
      onChange(newText);
      setShowSuggestions(false);
      
      // Focus back to textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node) && !suggestionsRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onFocus={() => setIsTextareaFocused(true)}
        onBlur={() => setIsTextareaFocused(false)}
        className={`w-full p-3 border border-gray-300 rounded-lg resize-none ${isTextareaFocused ? "bg-white" : "bg-gray-50"}`}
        rows={4}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {suggestion.label}
                </span>
                <span className="text-xs text-gray-500">
                  {suggestion.sourceNode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariableAutocomplete;
