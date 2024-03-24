import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { MdOutlinePoll } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";

import { getServerAuthSession } from "~/server/auth";

const DropDown = async () => {
  const session = await getServerAuthSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={session?.user?.image ?? "https://github.com/shadcn.png"}
          />
          <AvatarFallback>
            {session?.user?.name?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link className="flex items-center gap-1" href="/my-polls">
            {" "}
            <MdOutlinePoll /> My Polls
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="flex items-center gap-1" href="/api/auth/signout">
            {" "}
            <BiLogOutCircle /> Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
