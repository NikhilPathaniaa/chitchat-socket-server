import ChatWindow from "@/components/MessageArea/ChatWindow";
import UserLists from "@/components/UserList/UserLists";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex">
        <UserLists />
        <ChatWindow />
      </main>
    </>
  );
}
