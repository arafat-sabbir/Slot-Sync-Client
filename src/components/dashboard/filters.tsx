import React from "react";
import { Calendar, X, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";
import CustomFormField, { FormFieldType } from "../shared/CustomFormField";
import {
  getInputClassNames,
  getLabelClassNames,
  getSelectTriggerClassName,
} from "@/styles";
import { FilterOptions } from "@/app/types";

const Filters = ({
  filters,
  setFilters,
  resources,
}: {
  filters: FilterOptions;
  resources: string[];
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
}) => {
  const hasActiveFilters =
    filters.resource !== "all" ||
    filters.date !== undefined ||
    filters.status !== "all";

  const statusOptions = [
    { value: "all", label: "All Status", color: "gray" },
    { value: "upcoming", label: "Upcoming", color: "blue" },
    { value: "ongoing", label: "Ongoing", color: "green" },
    { value: "past", label: "Past", color: "gray" },
  ];

  const form = useForm({
    defaultValues: {
      resource: filters.resource,
      date: filters.date,
      status: filters.status,
    },
  });

  const handleValueChange = (field: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilter = (field: keyof FilterOptions) => {
    setFilters((prev) => ({
      ...prev,
      [field]:
        field === "resource" ? "all" : field === "status" ? "all" : undefined,
    }));
    form.setValue(
      field,
      field === "resource" ? "all" : field === "status" ? "all" : undefined
    );
  };

  return (
    <div className="p-6 rounded-xl custom-shadow-sm border border-c-stroke-gray">
      {/* Main Filter Grid */}
      <Form {...form}>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Resource Filter */}
          <CustomFormField
            control={form.control}
            name="resource"
            selectTriggerClassName={getSelectTriggerClassName()}
            labelClassname={getLabelClassNames()}
            className={getInputClassNames()}
            fieldType={FormFieldType.SELECT}
            label="Resource"
            placeholder="Select Resource"
            onValueChange={(value) => handleValueChange("resource", value)}
            value={filters.resource}
          >
            <SelectItem value="all">All Resources</SelectItem>
            {resources.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </CustomFormField>

          {/* Date Filter */}
          <CustomFormField
            control={form.control}
            labelClassname={getLabelClassNames()}
            className={getInputClassNames()}
            name="date"
            fieldType={FormFieldType.CALENDAR}
            label="Date"
            placeholder="Select Date"
            onValueChange={(value) => handleValueChange("date", value)}
            value={filters.date}
          />

          {/* Status Filter */}
          <CustomFormField
            control={form.control}
            name="status"
            selectTriggerClassName={getSelectTriggerClassName()}
            labelClassname={getLabelClassNames()}
            className={getInputClassNames()}
            fieldType={FormFieldType.SELECT}
            placeholder="Select Status"
            label="Status"
            onValueChange={(value) => handleValueChange("status", value)}
            value={filters.status}
          >
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </CustomFormField>
        </form>
      </Form>

      {/* Active Filters & Results */}
      <div className="mt-6 pt-4 border-t border-c-stroke-gray">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="block text-sm font-medium text-c-heading">
              Quick Filters:
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    resource: "all",
                    date: new Date(),
                    status: "all",
                  });
                  form.reset({
                    resource: "all",
                    date: new Date(),
                    status: "all",
                  });
                }}
                className="px-3 py-0.5 text-sm rounded-full cursor-pointer font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors"
              >
                Today's Bookings
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    status: "ongoing",
                  }));
                  form.setValue("status", "ongoing");
                }}
                className="px-3 py-0.5 text-sm font-medium rounded-full cursor-pointer text-green-600 bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors"
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
                    type="button"
                    onClick={() => clearFilter("resource")}
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
                    type="button"
                    onClick={() => clearFilter("date")}
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
                    type="button"
                    onClick={() => clearFilter("status")}
                    className="hover:bg-orange-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
