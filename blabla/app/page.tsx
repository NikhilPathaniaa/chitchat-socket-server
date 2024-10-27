import ChatWindow from "@/components/MessageArea/ChatWindow";
import UserLists from "@/components/UserList/UserLists";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="flex">
        {/* <UserLists /> */}
        <ChatWindow />
        <section className="w-full h-96 border-2 border-black hidden">Hey</section>
      </main>
    </>
  );
}
