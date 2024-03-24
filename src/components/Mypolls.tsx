"use client";

import { api } from "~/trpc/react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { FaChartBar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyPollsClient = ({ userId }: { userId: string }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const utils = api.useUtils();

  useEffect(() => {
    const timer = setTimeout(() => {
      utils.poll.getUserPolls
        .invalidate({
          text: search,
          sortByData: sort,
        })
        .then(() => {
          console.log("invalidated");
        })
        .catch((error) => {
          console.error(error);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, sort]);

  const polls = api.poll.getUserPolls.useQuery({
    text: search,
    sortByData: sort,
  });
  const router = useRouter();
  return (
    <div className="mx-auto mt-6 max-w-[600px]">
      <h2 className="mb-5 font-Montserrat text-3xl font-semibold">My Polls</h2>
      <div className="border-b pb-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        <div className="mt-3 flex w-full justify-end ">
          <div className="w-[100px]">
            <Select
              value={sort}
              onValueChange={(value) => setSort(value)}
              defaultValue="newest"
            >
              <SelectTrigger>Sort by</SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {polls.isLoading || polls.isFetching ? (
          <LoadingPolls />
        ) : (
          polls &&
          polls.data?.map((poll) => {
            return (
              <div
                key={poll.id}
                onClick={() => router.push(`/${poll.id}`)}
                className="my-3 flex h-[70px] cursor-pointer flex-col items-start justify-center  rounded border  px-2 shadow-md"
              >
                <h2 className="font-Montserrat text-lg font-semibold">
                  {poll.name}
                </h2>
                <div>
                  <div className="flex items-center gap-1 ">
                    <FaChartBar />{" "}
                    <p className="">Total Votes: {poll.pollVotes?.length}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const LoadingPolls = () => {
  return (
    <>
      <div className="my-3 h-[70px] animate-pulse rounded bg-gray-300"></div>
      <div className="my-3 h-[70px] animate-pulse rounded bg-gray-300"></div>
      <div className="my-3 h-[70px] animate-pulse rounded bg-gray-300"></div>
      <div className="my-3 h-[70px] animate-pulse rounded bg-gray-300"></div>
    </>
  );
};

export default MyPollsClient;
