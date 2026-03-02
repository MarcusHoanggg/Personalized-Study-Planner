import { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { Task } from "../types";
import { searchUsers, shareTasks, type UserSearchResult } from "../services/notifications";

interface ShareTaskModalProps {
  tasks: Task[];
  onClose: () => void;
}

export default function ShareTaskModal({
  tasks,
  onClose,
}: ShareTaskModalProps) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const searchRequestId = useRef(0);

  // Debounced user search with race condition protection
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const currentRequestId = ++searchRequestId.current;

    const handler = setTimeout(async () => {
      try {
        setSearching(true);
        const results = await searchUsers(searchQuery);
        
        // Only update if this is the latest request
        if (currentRequestId !== searchRequestId.current) return;
        
        // Filter out already selected users
        const filteredResults = results.filter(
          (user) => !selectedUsers.some((u) => u.userId === user.userId)
        );
        setSearchResults(filteredResults);
        setShowDropdown(filteredResults.length > 0);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        if (currentRequestId === searchRequestId.current) {
          setSearching(false);
        }
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedUsers]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isTaskShareable = (taskId: string) => {
    const numId = parseInt(taskId, 10);
    return !isNaN(numId) && numId > 0;
  };

  const shareableTasks = tasks.filter((t) => isTaskShareable(t.id));

  const toggleTask = (taskId: string) => {
    if (!isTaskShareable(taskId)) return;
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedTaskIds.size === shareableTasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(shareableTasks.map((t) => t.id)));
    }
  };

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((u) => u.userId !== userId));
  };

  const handleShare = async () => {
    if (selectedTaskIds.size === 0) {
      setError("Please select at least one task");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Please select at least one recipient");
      return;
    }

    // Convert task IDs to numbers, filtering out invalid (non-numeric) IDs
    const numericTaskIds = Array.from(selectedTaskIds)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id) && id > 0);

    if (numericTaskIds.length === 0) {
      setError("Selected tasks cannot be shared. Please create tasks using the backend API first.");
      return;
    }

    if (numericTaskIds.length < selectedTaskIds.size) {
      console.warn("Some tasks have invalid IDs and will not be shared");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await shareTasks({
        receiverUserIds: selectedUsers.map((u) => u.userId),
        taskIds: numericTaskIds,
      });
      setSuccess(`Tasks sent to ${selectedUsers.length} recipient(s) successfully.`);
      setSelectedTaskIds(new Set());
      setSelectedUsers([]);
      setSearchQuery("");
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-xl border border-purple-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Share Tasks</h2>

        {/* Recipient Search */}
        <div className="mb-6" ref={searchRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Recipients
          </label>
          
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full border border-purple-200"
                >
                  <span className="text-sm text-purple-800 truncate max-w-32">
                    {user.fullName || user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.userId)}
                    className="text-purple-500 hover:text-purple-700"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name or email to add recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              className="bg-white border-purple-200 focus:border-purple-400"
              disabled={loading}
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
              </div>
            )}
            
            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-purple-100 max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.userId}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-300 text-purple-900 flex items-center justify-center font-semibold text-sm">
                      {user.fullName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{user.fullName || user.email}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Select All */}
        <div className="mb-4 pb-4 border-b border-purple-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTaskIds.size === shareableTasks.length && shareableTasks.length > 0}
              onChange={toggleAll}
              disabled={shareableTasks.length === 0 || loading}
              className="w-4 h-4 rounded cursor-pointer accent-purple-500"
            />
            <span className="font-medium text-gray-700">
              Select All Shareable ({selectedTaskIds.size}/{shareableTasks.length})
              {shareableTasks.length < tasks.length && (
                <span className="text-xs text-gray-500 ml-1">
                  ({tasks.length - shareableTasks.length} local only)
                </span>
              )}
            </span>
          </label>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks available</p>
        ) : (
          <div className="space-y-3 mb-6">
            {tasks.map((task) => {
              const isShareable = isTaskShareable(task.id);
              return (
              <label
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition ${
                  isShareable 
                    ? "hover:bg-purple-50 cursor-pointer" 
                    : "opacity-50 cursor-not-allowed bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTaskIds.has(task.id)}
                  onChange={() => isShareable && toggleTask(task.id)}
                  disabled={loading || !isShareable}
                  className="w-4 h-4 rounded mt-1 cursor-pointer accent-purple-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {task.title}
                    {!isShareable && (
                      <span className="ml-2 text-xs text-orange-500 font-normal">
                        (Local only - cannot share)
                      </span>
                    )}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.deadline && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </label>
            );})}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-100"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            onClick={handleShare}
            disabled={loading || selectedTaskIds.size === 0}
          >
            {loading ? "Sharing..." : "Share Tasks"}
          </Button>
        </div>
      </div>
    </div>
  );
}