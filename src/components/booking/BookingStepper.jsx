"use client";

import React from "react";
import { CarIcon, UserIcon, CreditCardIcon, CheckIcon } from "lucide-react";

const steps = [
  { key: 1, label: "Rental Details", Icon: CarIcon },
  { key: 2, label: "Customer Info", Icon: UserIcon },
  { key: 3, label: "Payment", Icon: CreditCardIcon },
  { key: 4, label: "Review & Book", Icon: CheckIcon },
];

function circleClasses(status) {
  const base = "w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200";
  switch (status) {
    case "current":
      return `${base} bg-primary text-white shadow-sm`;
    case "done":
      return `${base} bg-primary/10 text-primary border border-primary/40`;
    default:
      return `${base} bg-white text-gray-500 border border-gray-300`;
  }
}

function lineClasses(done) {
  return done
    ? "flex-1 h-0.5 bg-primary/40"
    : "flex-1 h-0.5 bg-gray-200";
}

export default function BookingStepper({ current = 1 }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const status = s.key < current ? "done" : s.key === current ? "current" : "todo";
          const nextDone = s.key < current;
          const Icon = s.Icon;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center">
                <div className={circleClasses(status)}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="mt-2 text-sm text-gray-700">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`mx-2 ${lineClasses(nextDone)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}