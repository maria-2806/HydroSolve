import React, { useState } from "react";
import { PlusIcon } from "./assets/PlusIcon";

const AccordionItem = ({ number, title, description, isOpen, toggle }) => {
  return (
    <div className="w-full">
      <div
        className={`flex justify-between items-center border border-gray-800 rounded-3xl shadow-md p-10 cursor-pointer ${
          isOpen ? "bg-black" : "bg-gray-100"
        }`}
        onClick={toggle}
      >
        <div className="flex items-center gap-6">
          <div className={`text-5xl font-medium ${isOpen ? "text-white" : "text-black"}`}>
            {number}
          </div>
          <div className={`text-2xl font-medium ${isOpen ? "text-white" : "text-black"}`}>
            {title}
          </div>
        </div>
        <PlusIcon className="h-14 w-14 text-gray-400" />
      </div>

      {isOpen && (
        <div className="bg-black border border-gray-800 rounded-3xl shadow-md p-10 mt-4">
          <p className="text-white text-lg">{description}</p>
        </div>
      )}
    </div>
  );
};

export const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-6 p-12">
      <AccordionItem
        number="01"
        title="Consultation"
        description="During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts."
        isOpen={openIndex === 0}
        toggle={() => toggleAccordion(0)}
      />
      <AccordionItem
        number="02"
        title="Research and Strategy Development"
        description="We will conduct research to understand your market and develop a strategy."
        isOpen={openIndex === 1}
        toggle={() => toggleAccordion(1)}
      />
      <AccordionItem
        number="03"
        title="Implementation"
        description="Once a strategy is in place, we will begin implementing the agreed plan."
        isOpen={openIndex === 2}
        toggle={() => toggleAccordion(2)}
      />
    </div>
  );
};
