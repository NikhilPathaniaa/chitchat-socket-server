import React from "react";

const UserLists = () => {
  return (
    <div className="border-2 w-[24rem] h-full flex flex-col items-center rounded-[34px] bg-black bg-[url('/Bg/bg.png')]">
      <h1 className="text-white my-10">
        Welcome Back,<span className="font-bold"> Jhon Show</span>🤙
      </h1>

      <section className=" bg-white  rounded-[30px] w-[381px] h-[580px]">
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-3xl text-black font-bold">Your Lists</h1>
        </div>
        <ul className="">
          <li className="p-3">
            <div className="flex items-center">
              <img src="https://picsum.photos/200/300" alt="user1" className="rounded-full w-[60px] h-[50px] object-cover" />

              <div className="ml-4 w-full flex  justify-between ">
                <div>
                  <h2 className="text-lg text-black font-bold">John Doe</h2>
                  <p className="text-sm text-[#8A91A8]">okay sure!!</p>
                </div>
                <div>
                  {/* time and blue ticks ? */}
                  <p className="text-sm text-[#8A91A8]">12:25 PM</p>
                  <p className="text-sm text-blue-500">2 likes</p>
                </div>
              </div>
            </div>
            {/* <hr className="mt-3" /> */}
          </li>
          <li className="p-3">
            <div className="flex items-center">
              <img src="https://picsum.photos/200/300" alt="user1" className="rounded-full w-[60px] h-[50px] object-cover" />

              <div className="ml-4 w-full flex  justify-between ">
                <div>
                  <h2 className="text-lg text-black font-bold">John Doe</h2>
                  <p className="text-sm text-[#8A91A8]">okay sure!!</p>
                </div>
                <div>
                  {/* time and blue ticks ? */}
                  <p className="text-sm text-[#8A91A8]">12:25 PM</p>
                  <p className="text-sm text-blue-500">2 likes</p>
                </div>
              </div>
            </div>
            {/* <hr className="mt-3" /> */}
          </li>
        </ul>
      </section>
    </div>
  );
};

export default UserLists;
