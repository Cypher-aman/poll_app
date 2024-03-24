import MyPollsClient from "~/components/Mypolls";
import { getServerAuthSession } from "~/server/auth";
const MyPolls = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  return <MyPollsClient userId={session.user.id} />;
};

export default MyPolls;
