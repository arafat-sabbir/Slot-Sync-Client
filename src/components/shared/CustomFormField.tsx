import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Control, FieldValues } from "react-hook-form";
import { ReactNode, useState } from "react";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";

export type FormFieldType =
  | "input"
  | "text_area"
  | "phone_input"
  | "select"
  | "calendar"
  | "date_picker"
  | "date_range_picker"
  | "tags"
  | "checkbox"
  | "password"
  | "range"
  | "image"
  | "file";

export const FormFieldType = {
  INPUT: "input",
  TEXTAREA: "text_area",
  PHONE_INPUT: "phone_input",
  SELECT: "select",
  CALENDAR: "calendar",
  TAGS: "tags",
  CHECKBOX: "checkbox",
  PASSWORD: "password",
  RANGE: "range",
  IMAGE: "image",
  FILE: "file",
} as const;

export interface CustomFormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  label?: string;
  name: string;
  labelClassname?: string;
  containerClassName?: string;
  fieldType: FormFieldType;
  placeholder?: string;
  className?: string;
  type?: "text" | "password" | "email" | "number";
  min?: number;
  max?: number;
  step?: number;
  image?: File | string;
  setImage?: (file: File | string) => void;
  fromYear?: number;
  toYear?: number;
  disableDate?: (date: Date) => boolean;
  selectTriggerClassName?: string;
  setError?: (error: string) => void;
  contentClassName?: string;
  disabled?: boolean;
  dateFormat?: string;
  children?: ReactNode;
  onChange?: (value: any) => void;
  inputClassName?: string;
  countrySelectClassName?: string;
  showDialCode?: boolean;
  mode?: "single" | "range";
  showTimePicker?: boolean;
  minDate?: Date;
  maxDate?: Date;
  calendarClassName?: string;
  checkBoxLabelClassName?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  avoidCollisions?: boolean;
  onSelect?: (date: Date) => void;
  onDateRangeChange?: (start: Date | null, end: Date | null) => void;
  indicator?: boolean;
}

interface FieldProps {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  name: string;
}

interface RenderFieldProps {
  field: FieldProps;
  props: CustomFormFieldProps;
}

const RenderIField = ({ field, props }: RenderFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    fieldType,
    placeholder,
    className,
    type,
    onChange,
    selectTriggerClassName,
    disabled,
    mode,
  } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <Input
            placeholder={placeholder}
            disabled={disabled}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            type={type}
            className={cn(
              "h-[3.25rem] border-transparent bg-[#F8F8F8] px-5 py-4 text-base",
              className
            )}
          />
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            disabled={disabled}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            className={cn(
              "h-[3.25rem] border-transparent bg-[#F8F8F8] px-5 py-4 text-base",
              className
            )}
          />
        </FormControl>
      );

    case FormFieldType.PASSWORD:
      return (
        <div className={cn("flex items-center rounded-md border", className)}>
          <FormControl>
            <Input
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              type={showPassword ? "text" : "password"}
              className={cn(
                "flex-1 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0",
                className
              )}
            />
          </FormControl>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-2 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="text-gray-500" size={20} />
            ) : (
              <Eye className="text-gray-500" size={20} />
            )}
          </button>
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              if (onChange) onChange(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger className={cn(selectTriggerClassName)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={props.contentClassName}>
              <ScrollArea className={cn("h-fit")}>{props.children}</ScrollArea>
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.CALENDAR:
      return (
        <FormControl>
          <DropdownMenu open={calendarOpen} onOpenChange={setCalendarOpen}>
            <DropdownMenuTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn("text-c-body2 hover:text-c-body2", className)}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={props.align}
              side={props.side || "bottom"}
              avoidCollisions={props.avoidCollisions || true}
              alignOffset={8}
              sideOffset={8}
              className={cn(
                "custom-scrollbar z-50 w-full rounded-xl custom-shadow-sm border border-c-stroke-gray",
                props.contentClassName
              )}
            >
              <Calendar
                mode={mode || "single"}
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                captionLayout="dropdown"
                required={mode === "range"}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={disabled}
              className="peer data-[state=checked]:border-c-action-brand data-[state=checked]:bg-c-action-brand"
            />
            {props.label && (
              <span className={cn("text-sm", props.checkBoxLabelClassName)}>
                {props.label}
              </span>
            )}
          </div>
        </FormControl>
      );

    case FormFieldType.FILE:
      return (
        <FormControl>
          <Input
            disabled={disabled}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              field.onChange(file);
              if (onChange) onChange(file);
            }}
            onBlur={field.onBlur}
            name={field.name}
            className="border-transparent bg-[#F8F8F8] p-0 text-t-500 file:mr-4 file:h-[3.25rem] file:rounded-l-md file:border-0 file:bg-p-300 file:px-5 file:py-4 file:text-sm file:text-p-900"
            accept=".png,.jpg,.jpeg"
          />
        </FormControl>
      );

    default:
      return null;
  }
};

const CustomFormField = <T extends FieldValues>(
  props: CustomFormFieldProps<T>
) => {
  const { control, label, name, labelClassname, fieldType } = props;

  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          {label && fieldType !== FormFieldType.CHECKBOX && (
            <FormLabel className={cn("", labelClassname)}>{label}</FormLabel>
          )}
          <RenderIField field={field} props={props as any} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
