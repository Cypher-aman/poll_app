"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { FaVoteYea } from "react-icons/fa";
import { LuClock5 } from "react-icons/lu";
import { FaChartBar } from "react-icons/fa";
import ThreeDots from "~/components/LoadingUi/ThreeDots";
import { PiShareFat } from "react-icons/pi";
import { api } from "~/trpc/react";
import { PollOption } from "~/server/types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const PollId = ({
  pollId,
  userId,
}: {
  pollId: string;
  userId?: string | null | undefined;
}) => {
  const [pollOption, setPollOption] = useState<PollOption | undefined>();
  const [animation, setAnimation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | undefined>();
  const [pollChartData, setPollChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: (string | undefined)[];
      hoverOffset: number;
    }[];
  }>({ labels: [], datasets: [] });

  const router = useRouter();

  const trpcAPI = api.useUtils();

  const getPoll = api.poll.get.useQuery({ id: pollId });

  const deletePoll = api.poll.deletePoll.useMutation({
    onSuccess: (data) => {
      toast.success("Poll deleted successfully");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const alreadyVoted = api.poll.alreadyVoted.useQuery({
    id: pollId,
  });

  const getColor = useCallback((index: number) => {
    const colors = ["#EAE6FF", "#7FFFD4", " #87CEEB", "#F5F5DC", "#7FFFD4"];
    return colors[index];
  }, []);

  const init = useCallback(() => {
    if (getPoll.data) {
      setPollChartData({
        labels: getPoll.data.options.map((option) => option.name),
        datasets: [
          {
            label: "Total Votes",
            data: getPoll.data.options.map((option) => option.pollVotes.length),
            backgroundColor: getPoll.data?.options.map((option, index) =>
              getColor(index),
            ),
            hoverOffset: 4,
          },
        ],
      });
    }

    if (getPoll.data?.expiry) {
      const currentTime = new Date().getTime();
      const expiryTime = new Date(getPoll?.data?.expiry).getTime();
      const _daysUntilExpiry = Math.ceil(
        (expiryTime - currentTime) / (1000 * 3600 * 24),
      );
      setDaysUntilExpiry(_daysUntilExpiry);
      if (currentTime > expiryTime) {
        setShowResults(true);
      }
    }
  }, [getPoll.data]);

  useEffect(() => {
    init();
  }, [init, getPoll.data]);

  useEffect(() => {
    if (alreadyVoted.data?.alreadyVoted && alreadyVoted.data?.option) {
      setPollOption(alreadyVoted.data.option);
      setShowResults(true);
    }
  }, [alreadyVoted.data]);

  const vote = api.poll.vote.useMutation({
    onSuccess: (data) => {
      setAnimation(false);
      setShowResults(true);
      trpcAPI.poll.get
        .invalidate()
        .then(() => {
          init();
        })
        .catch((error: Error) => {
          alert(error.message);
        });
    },
    onError: (error) => {
      setAnimation(false);
      alert(error.message);
    },
  });

  const handleVote = () => {
    if (!userId) return router.push("/api/auth/signin");
    if (!pollOption) return alert("Please select an option");
    setAnimation(true);
    vote.mutate({
      id: pollId,
      optionId: pollOption.id,
    });
  };

  const handleDelete = () => {
    const confirmation = confirm("Are you sure you want to delete this poll?");
    if (confirmation) {
      deletePoll.mutate({ id: pollId });
      return;
    } else {
      return;
    }
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/${pollId}`)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        toast.error("Something went wrong. Please try again");
      });
  };

  if (getPoll.isLoading)
    return (
      <div className="flex h-[600px] w-full items-center justify-center gap-2 text-gray-600">
        <ThreeDots color="black" /> Loading...
      </div>
    );

  if (!getPoll.data)
    return (
      <div className="py-20 text-center text-2xl font-bold">
        No poll found for id: {pollId}
      </div>
    );
  return (
    <main className="mt-20 md:container">
      <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
        <section className="h-full px-2 md:border-r md:pr-10">
          <div className="flex items-center justify-between gap-1">
            <h2 className="mb-3 max-w-[90%] font-Montserrat text-xl font-semibold">
              {getPoll?.data?.name}
            </h2>
            <PiShareFat
              onClick={handleShare}
              className="cursor-pointer text-3xl"
            />
          </div>
          <RadioGroup value={pollOption?.name}>
            {getPoll.data?.options.map((option, i) => (
              <div
                key={option.id}
                onClick={() => setPollOption(option)}
                className={` relative z-20 flex cursor-pointer items-center gap-2  rounded border bg-transparent px-1 py-4 transition-all duration-150 ease-linear hover:translate-x-2 hover:shadow-md `}
              >
                {/* <span
                  className={`absolute bottom-0  left-0 top-0 z-10 block transition-all duration-500 ease-in-out ${showResults ? "w-full" : "w-0"}`}
                  style={{ backgroundColor: showResults ? getColor(i) : "" }}
                ></span> */}
                <RadioGroupItem value={option.name} id={option.id} />
                <Label htmlFor={option.id}>{option.name}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="mt-6">
            <div className="flex flex-col gap-2 font-medium">
              <div className="flex items-center gap-1 font-medium">
                <FaChartBar />{" "}
                <p className="">
                  Total Votes: {getPoll?.data?.pollVotes?.length}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {!getPoll?.data?.neverExpire ? (
                  getPoll?.data?.expired ? (
                    <>
                      <p className="text-red-500">Poll Expired</p>
                    </>
                  ) : (
                    <>
                      {" "}
                      <LuClock5 /> <p>Expiry In: {daysUntilExpiry} days</p>
                    </>
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end gap-2">
            {userId && (
              <Button onClick={handleDelete} variant="destructive">
                Delete
              </Button>
            )}
            <Button
              disabled={getPoll?.data?.expired}
              onClick={handleVote}
              className="min-w-9 space-x-1"
            >
              {!animation ? (
                <>
                  {" "}
                  <FaVoteYea /> Vote{" "}
                </>
              ) : (
                <ThreeDots />
              )}
            </Button>
          </div>
        </section>
        <section className="">
          <div
            className={`flex h-[60vh] items-center justify-center px-6  ${showResults ? "blur-0" : "blur-md"} `}
          >
            <Pie data={pollChartData} className="" />
          </div>
        </section>
      </div>
    </main>
  );
};

export default PollId;
