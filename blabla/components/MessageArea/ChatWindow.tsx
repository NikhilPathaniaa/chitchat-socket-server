import React from "react";

const ChatWindow = () => {
  return (
    <div className="border-2 w-[24rem] h-screen flex flex-col items-center rounded-[34px] bg-black bg-[url('/Bg/bg.png')]">
      <div className="flex items-center my-6 px-6 w-full">
        <img src="https://picsum.photos/200/300" alt="user1" className="rounded-full w-[60px] h-[50px] object-cover" />

        <div className="ml-4 w-full flex items-center justify-between ">
          <div>
            <h2 className="text-lg text-white font-bold">John Doe</h2>
            <p className="text-sm text-[#8A91A8]">Online</p>
          </div>
          <div>
            {/* Options 3 dots ? */}
            <p className="text-sm text-[#8A91A8]">||</p>
          </div>
        </div>
      </div>

      <section className=" bg-white  rounded-[30px] w-[381px] h-full">
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-3xl text-black font-bold">Your Lists</h1>
        </div>
        <ul className=""></ul>
      </section>
    </div>
  );
};

export default ChatWindow;
