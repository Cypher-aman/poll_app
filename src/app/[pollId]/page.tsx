import PollId from "~/components/PollId";
import { getServerAuthSession } from "~/server/auth";

const Poll = async ({ params }: { params: { pollId: string } }) => {
  const { pollId } = params;
  const session = await getServerAuthSession();

  return <PollId pollId={pollId} userId={session?.user.id} />;
};

export default Poll;
