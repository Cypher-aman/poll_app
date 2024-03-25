/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import SceneWrapper from "../sceneWrapper";
import { Input } from "~/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "~/components/ui/button";

interface SecondSceneProps {
  form: any;
}

const SecondScene: React.FC<SecondSceneProps> = ({ form }) => {
  const { setValue, register, getValues } = form;

  const title = getValues("name");

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control,
  });
  const handleAddOption = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    append({ option: "" }, { shouldFocus: true });
  };

  return (
    <SceneWrapper title="Create poll options">
      <h2 className="font-Montserrat text-xl font-semibold">{title}</h2>
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        fields.map((field, index) => (
          <>
            <FormField
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              control={form.control}
              key={field.id}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              name={`options.${index}.option` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option {index + 1}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Option"
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        {...register(`options.${index}.option` as const)}
                      />
                    </FormControl>
                    {index >= 2 && (
                      <Button
                        onClick={() => remove(index)}
                        variant="destructive"
                        className=""
                      >
                        <RiDeleteBin6Line />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ))
      }

      <Button
        variant="secondary"
        disabled={fields.length >= 5}
        onClick={handleAddOption}
      >
        Add option
      </Button>
    </SceneWrapper>
  );
};

export default SecondScene;
