import React from "react";

const ChatWindow = () => {
  return (
    <div className="border-2 md:w- w-[24rem] md:h-screen h-[93vh] flex flex-col items-center rounded-[34px] bg-black bg-[url('/Bg/bg.png')]">
      <div className="flex items-center my-6 px-6 w-full">
        <p className="mr-3 text-white">?</p>
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
        <div className="flex flex-col items-start justify-center pt-2 px-2">
          <div className="bg-[#FFC700] text-left mb-1 rounded-full">
            <p className="w-full p-3 text-black">Hey! How have you been?</p>
          </div>
          <div className="bg-[#FFC700] w-[16rem] mb-1  text-left rounded-full">
            <p className="w-full p-3 text-black">Wanna catch up for a beer?</p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center pt-2 px-2">
          <div className="bg-[#FF8933] text-right mb-1 rounded-full">
            <p className="w-full p-3 text-black">Awesome! Let’s meet up</p>
          </div>
          <div className="bg-[#FF8933] w-[16rem] mb-1 text-right rounded-full">
            <p className="w-full p-3 text-black">Can I also get my cousin along? Will that be okay?</p>
          </div>
        </div>
        <ul></ul>
        <form action="" className="absolute bottom-3 px-3">
          <input type="text" className="border-2 border-black w-[22.2rem] rounded-full h-10 pl-3" placeholder="Message" />
        </form>
      </section>
    </div>
  );
};

export default ChatWindow;
