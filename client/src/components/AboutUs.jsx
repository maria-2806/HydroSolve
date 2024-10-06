import React from "react";
import { PlusIcon } from "./PlusIcon";
import content from "./content.svg";
import line25 from "./line-25.svg";

export const ProcessBlock = ({ className }) => {
  return (
    <div
      className={`inline-flex flex-col items-start gap-[30px] px-[100px] py-0 relative shadow-[0px_4px_4px_#00000040] ${className}`}
    >
      <div className="gap-[30px] bg-black flex flex-col w-[1234px] items-start px-[60px] py-[41px] relative flex-[0_0_auto] rounded-[45px] overflow-hidden border border-solid border-[#191a23] shadow-[0px_5px_0px_#191a23]">
        <img className="relative w-[1117px] flex-[0_0_auto] mr-[-3.00px]" alt="Content" src={content} />
        <img className="relative w-[1114px] h-px object-cover" alt="Line" src={line25} />
        <p className="relative w-[1114px] h-[60px] font-p font-[number:var(--p-font-weight)] text-white text-[length:var(--p-font-size)] tracking-[var(--p-letter-spacing)] leading-[var(--p-line-height)] [font-style:var(--p-font-style)]">
          During the initial consultation, we will discuss your business goals and objectives, target audience, and
          current marketing efforts. This will allow us to understand your needs and tailor our services to best fit
          your requirements.
        </p>
      </div>
      <div className="gap-2.5 bg-grey flex flex-col w-[1234px] items-start px-[60px] py-[41px] relative flex-[0_0_auto] rounded-[45px] overflow-hidden border border-solid border-[#191a23] shadow-[0px_5px_0px_#191a23]">
        <div className="flex items-center justify-between relative w-[1117px] flex-[0_0_auto] mr-[-3.00px]">
          <div className="inline-flex items-center gap-[25px] relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Space_Grotesk-Medium',Helvetica] font-medium text-black text-6xl tracking-[0] leading-[normal]">
              02
            </div>
            <div className="relative w-[612px] [font-family:'Space_Grotesk-Medium',Helvetica] font-medium text-black text-3xl tracking-[0] leading-[normal]">
              Research and Strategy Development
            </div>
          </div>
          <PlusIcon className="!relative !w-[58px] !h-[58px]" />
        </div>
      </div>
      <div className="gap-2.5 bg-grey flex flex-col w-[1234px] items-start px-[60px] py-[41px] relative flex-[0_0_auto] rounded-[45px] overflow-hidden border border-solid border-[#191a23] shadow-[0px_5px_0px_#191a23]">
        <div className="flex items-center justify-between relative w-[1117px] flex-[0_0_auto] mr-[-3.00px]">
          <div className="inline-flex items-center gap-[25px] relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Space_Grotesk-Medium',Helvetica] font-medium text-black text-6xl tracking-[0] leading-[normal]">
              03
            </div>
            <div className="relative w-[612px] [font-family:'Space_Grotesk-Medium',Helvetica] font-medium text-black text-3xl tracking-[0] leading-[normal]">
              Implementation
            </div>
          </div>
          <PlusIcon className="!relative !w-[58px] !h-[58px]" />
        </div>
      </div>
    </div>
  );
};
