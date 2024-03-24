import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { Poll } from "~/server/types";

export async function GET(req: NextRequest, res: Response) {
  try {
    // Fetch polls that have neverExpire set to false and are not already expired
    const polls = (await db.poll.findMany({
      where: {
        neverExpire: false,
        expired: false,
      },
    })) as Poll[];

    // Get current date
    const currentDate = new Date();

    // Iterate over the polls and update those that are expired
    for (const poll of polls) {
      // Check if the expiry date is in the past
      if (poll.expiry && poll.expiry <= currentDate) {
        // Update the poll to set expired to true
        await db.poll.update({
          where: { id: poll.id },
          data: { expired: true },
        });

        console.log(`Poll ID ${poll.id} expired.`);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}
