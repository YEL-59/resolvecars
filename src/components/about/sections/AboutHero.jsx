import Image from "next/image";
import React from "react";

const AboutHero = () => {
  return (
    <div>
      <div className="bg-[#FBF5F5]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-center py-16">
            <div className="flex flex-col items-center justify-center text-center py-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Find Your Perfect Car
              </h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto py-5">
                Browse our extensive fleet of premium vehicles and find the
                perfect car for your journey.
              </p>

              <div className="p-3 flex gap-3 justify-center items-center border border-primary rounded-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M22.3006 10.5C22.7573 12.7413 22.4318 15.0714 21.3785 17.1018C20.3251 19.1322 18.6075 20.74 16.5121 21.6573C14.4167 22.5746 12.0702 22.7458 9.86391 22.1424C7.65758 21.5389 5.7248 20.1974 4.38789 18.3414C3.05097 16.4854 2.39073 14.2272 2.51728 11.9434C2.64382 9.65952 3.54949 7.48808 5.08326 5.79116C6.61703 4.09424 8.68619 2.97442 10.9457 2.61844C13.2052 2.26247 15.5184 2.69185 17.4996 3.83499"
                      stroke="#00C950"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 11.5L12.5 14.5L22.5 4.5"
                      stroke="#00C950"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-600 max-w-md mx-auto ">
                  Trusted by 250,000+ customers worldwide
                </p>
              </div>
            </div>

            <div className=" flex items-center justify-center">
              <Image
                src="/assets/aboutcar.png"
                alt="About Hero"
                width={900}
                height={600}
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
