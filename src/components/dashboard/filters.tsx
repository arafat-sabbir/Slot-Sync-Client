import React, { useState } from "react";
import { Calendar, Filter, X, ChevronDown, MapPin } from "lucide-react";
import { format } from "date-fns";

const Filters = () => {
  const [filters, setFilters] = useState({
    resource: "all",
    date: undefined,
    status: "all",
  });

  const resources = [
    "Conference Room A",
    "Conference Room B",
    "Meeting Room 1",
    "Meeting Room 2",
  ];
  const totalBookings = 127;
  const filteredCount = 89;

  const hasActiveFilters =
    filters.resource !== "all" ||
    filters.date !== undefined ||
    filters.status !== "all";

  const clearAllFilters = () => {
    setFilters({
      resource: "all",
      date: undefined,
      status: "all",
    });
  };

  const activeFilterCount = [
    filters.resource !== "all",
    filters.date !== undefined,
    filters.status !== "all",
  ].filter(Boolean).length;

  const [showCalendar, setShowCalendar] = useState(false);
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status", color: "gray" },
    { value: "upcoming", label: "Upcoming", color: "blue" },
    { value: "ongoing", label: "Ongoing", color: "green" },
    { value: "past", label: "Past", color: "gray" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Main Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resource Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resource
          </label>
          <button
            onClick={() => setShowResourceDropdown(!showResourceDropdown)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span
                className={
                  filters.resource === "all" ? "text-gray-500" : "text-gray-900"
                }
              >
                {filters.resource === "all"
                  ? "All Resources"
                  : filters.resource}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showResourceDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setFilters({ ...filters, resource: "all" });
                    setShowResourceDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700"
                >
                  All Resources
                </button>
                {resources.map((resource) => (
                  <button
                    key={resource}
                    onClick={() => {
                      setFilters({ ...filters, resource });
                      setShowResourceDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700"
                  >
                    {resource}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-left flex items-center gap-2.5 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className={!filters.date ? "text-gray-500" : "text-gray-900"}>
              {filters.date
                ? format(filters.date, "MMM dd, yyyy")
                : "Select date"}
            </span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {filters.status !== "all" && (
                <div
                  className={`w-2 h-2 rounded-full ${
                    filters.status === "upcoming"
                      ? "bg-blue-600"
                      : filters.status === "ongoing"
                      ? "bg-green-600"
                      : "bg-gray-600"
                  }`}
                />
              )}
              <span
                className={
                  filters.status === "all" ? "text-gray-500" : "text-gray-900"
                }
              >
                {statusOptions.find((s) => s.value === filters.status)?.label}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <div className="p-1.5">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => {
                      setFilters({ ...filters, status: status.value });
                      setShowStatusDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 flex items-center gap-2.5"
                  >
                    {status.value !== "all" && (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          status.value === "upcoming"
                            ? "bg-blue-600"
                            : status.value === "ongoing"
                            ? "bg-green-600"
                            : "bg-gray-600"
                        }`}
                      />
                    )}
                    <span>{status.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters & Results */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="block text-sm font-medium text-gray-700">
              Quick Filters:
            </label>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    date: new Date(),
                    status: "all",
                  })
                }
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
              >
                Today's Bookings
              </button>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    status: "ongoing",
                  })
                }
                className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:border-green-300 transition-colors"
              >
                Active Now
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {filters.resource !== "all" && (
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                  <MapPin className="h-3.5 w-3.5" />
                  {filters.resource}
                  <button
                    onClick={() => setFilters({ ...filters, resource: "all" })}
                    className="hover:bg-blue-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.date && (
                <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(filters.date, "MMM dd")}
                  <button
                    onClick={() => setFilters({ ...filters, date: undefined })}
                    className="hover:bg-purple-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.status !== "all" && (
                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      filters.status === "upcoming"
                        ? "bg-blue-600"
                        : filters.status === "ongoing"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  />
                  {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "all" })}
                    className="hover:bg-orange-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCount} of {totalBookings} bookings
        </div>
      </div>
    </div>
  );
};

export default Filters;
