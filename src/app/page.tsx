import CreatePoll from "~/components/CreatePoll/CreatePoll";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="mx-auto mt-10 max-w-[600px]">
      <section>
        <CreatePoll userId={session?.user?.id} />
      </section>
    </main>
  );
}
