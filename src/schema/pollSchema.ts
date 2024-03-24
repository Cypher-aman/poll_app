import * as z from "zod";

const pollOptionsSchema = z.object({
  option: z.string().trim().min(1, { message: "Option is required" }),
});

export const pollSchema = z.object({
  name: z.string().min(1, { message: "Title is required" }),
  category: z.string({ required_error: "Category is required" }),
  expiry: z.date().optional(),
  noExpiry: z.boolean().optional(),
  options: z.array(pollOptionsSchema).nonempty(),
});
