"use client";

import FirstScene from "./scenes/firstScene";
import SecondScene from "./scenes/secondScene";
import useMultiScreenForm from "../../hooks/multiStepForm";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { pollSchema } from "~/schema/pollSchema";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import ThreeDots from "../LoadingUi/ThreeDots";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CreatePoll = ({ userId }: { userId: string | undefined }) => {
  const form = useForm<z.infer<typeof pollSchema>>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      name: "",
      expiry: undefined,
      options: [{ option: "" }, { option: "" }],
    },
  });

  const router = useRouter();

  const createPoll = api.poll.create.useMutation({
    onSuccess: (data) => {
      form.reset();
      router.push(`/${data.id}`);
    },
    onError: (error) => {
      console.log(error);
      alert(error.message);
    },
  });

  const { next, back, currentStep, isFirstStep, isLastStep, currentStepIndex } =
    useMultiScreenForm([
      <FirstScene key="firstScene" form={form} />,
      <SecondScene key="secondScene" form={form} />,
    ]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof pollSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!userId) return toast.error("You are not logged in");
    createPoll.mutate({
      name: values.name,
      expiry: values.expiry,
      noExpiry: values.noExpiry,
      options: values.options,
    });
  }

  const handleNext = async () => {
    switch (currentStepIndex) {
      case 0: {
        const name = form.getValues("name");
        const category = form.getValues("category");
        const expiry = form.getValues("expiry");
        const noExpiry = form.getValues("noExpiry");

        !name
          ? form.setError("name", {
              type: "required",
              message: "Title is required",
            })
          : form.clearErrors("name");

        !category
          ? form.setError("category", {
              type: "required",
              message: "Category is required",
            })
          : form.clearErrors("category");

        if (noExpiry !== true && expiry === undefined) {
          form.setError("expiry", {
            type: "required",
            message: "Expiry date is required",
          });
        }

        if (noExpiry !== true && expiry !== undefined && expiry < new Date()) {
          form.setError("expiry", {
            type: "invalid",
            message: "Expiry date must be in the future",
          });
        }

        if (name && category && (noExpiry ?? (expiry && expiry > new Date()))) {
          form.clearErrors();
          next();
        }

        break;
      }
      case 1: {
        const options = form.getValues("options");
        if (options.length < 2) {
          form.setError("options", {
            type: "invalid",
            message: "At least 2 options are required",
          });
        }
        for (const option of options) {
          if (option.option === "") {
            form.setError("options", {
              type: "invalid",
              message: "All options are required",
            });
            return;
          }
        }
        onSubmit(form.getValues());
        break;
      }
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentStep}

          <div className="flex w-full justify-end gap-5">
            {!isFirstStep && (
              <Button
                disabled={isFirstStep}
                onClick={() => {
                  back();
                }}
              >
                Back
              </Button>
            )}
            {!isLastStep ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button className="mmin-w-10" type="submit">
                {createPoll.isPending ? <ThreeDots /> : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePoll;
