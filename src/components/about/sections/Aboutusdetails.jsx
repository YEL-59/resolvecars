import {
  BookCheckIcon,
  CarIcon,
  LocateIcon,
  PercentSquareIcon,
} from "lucide-react";
import React from "react";

const Aboutusdetails = () => {
  const details = [
    {
      icon: <CarIcon className="w-5 h-5 text-primary" />,
      title: "10,000+",
      description: "Vehicles Available",
    },
    {
      icon: <PercentSquareIcon className="w-5 h-5 text-primary" />,
      title: "24/7",
      description: "24/7 Support",
    },
    {
      icon: <LocateIcon className="w-5 h-5 text-primary" />,
      title: "100+",
      description: "Happy Customers",
    },
    {
      icon: <BookCheckIcon className="w-5 h-5 text-primary" />,
      title: "4.9/5",
      description: "Average Rating",
    },
  ];
  return (
    <div className="bg-white h-[60vh] flex items-center justify-center">
      <div className="container mx-auto px-4 py-20 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center p-3 ">
          {details.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between p-5 py-5 border border-[#FBF5F5] rounded-md hover:border-[#ECE5E5] transition-colors max-w-[300px]"
            >
              <div className=" h-15 w-15 rounded-full bg-[#FBF5F5] hover:bg-[#ECE5E5] transition-colors flex items-center justify-center">
                {item.icon}
              </div>
              <div className="text-center pt-10">
                <h1 className="text-3xl font-bold text-black">{item.title}</h1>
                <p className="text-lg text-black ">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Aboutusdetails;
