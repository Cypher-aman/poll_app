import { Input } from "~/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import SceneWrapper from "../sceneWrapper";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import React from "react";
import { Checkbox } from "~/components/ui/checkbox";

interface FirstSceneProps {
  form: any;
}

const FirstScene: React.FC<FirstSceneProps> = ({ form }) => {
  const [isChecked, setIsChecked] = React.useState(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    form.getValues("noExpiry") as boolean,
  );

  const handleCheckboxChange = (event: boolean, field: any) => {
    setIsChecked(event);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    field.onChange(event);
  };

  return (
    <SceneWrapper title="Create new poll">
      <FormField
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Who will win US 2024 election?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                value={field.value as string}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Category 1</SelectItem>
                  <SelectItem value="dark">Category 2</SelectItem>
                  <SelectItem value="system">Category 3</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        control={form.control}
        name="expiry"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Set an expiry date</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    disabled={isChecked}
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value as Date | undefined}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        control={form.control}
        name="noExpiry"
        render={({ field }) => (
          <FormItem className=" flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value as boolean}
                onCheckedChange={(e: boolean) => handleCheckboxChange(e, field)}
                className="h-4 w-4"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Never expire</FormLabel>
              <FormDescription>
                If you do not want this poll to expire, check the box above
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </SceneWrapper>
  );
};
export default FirstScene;
