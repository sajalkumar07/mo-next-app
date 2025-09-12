import React, { useState } from "react";

const Frequentlyasked = () => {
  const [openFAQ, setOpenFAQ] = useState(3);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index); // Close if clicked again
  };

  const faqData = [
    {
      question: "How is car loan EMI calculated monthly?",
      answer:
        "EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay your car loan, including both principal and interest.",
    },
    {
      question: "What is minimum down payment?",
      answer:
        "Customers usually prefer to pay 10–20 percent of the vehicle’s on-road price as down-payment.",
    },
    {
      question: "What will be the rate of interest on a car loan?",
      answer:
        "Current car loan interest rate ranges from 7.5 to 9.5 percent based on the customer’s credit score. Car loan interest rate are subjected to changes without prior notice",
    },
    {
      question: "What is the maximum number of years for a car loan?",
      answer:
        "A new car loan can be availed for a tenure of 1 year (12 months) to 7 years (84 months). Shorter tenures (1–2 years) attract a higher rate of interest, while longer tenures (5–7 years) offer better rates and lower EMIs.",
    },
  ];

  return (
    <section className="">
      <section>
        <div className="label">
          <p className="FIND-YOUR-INFO mt-5 brand  ml-4 justify-start items-start text-left flex flex-col">
            <span className="text-wrapper">FREQUENTLY ASKED </span>
            <span className="text-wrapper-2">QUESTIONS</span>
          </p>
        </div>
      </section>
      <section className="d-flex gap-3 align-items-center justify-content-center mobile-dec">
        <section className=" d-flex flex-column w-55 privebrek kkeyhr">
          {faqData.map((item, index) => (
            <div key={index} onClick={() => toggleFAQ(index)}>
              <div className="fages">
                <span>{item.question}</span>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {openFAQ === index ? (
                    <g clipPath="url(#clip0_5154_49597)">
                      <path
                        d="M12.5 24C9.3174 24 6.26516 22.7357 4.01472 20.4853C1.76428 18.2348 0.5 15.1826 0.5 12C0.5 8.8174 1.76428 5.76516 4.01472 3.51472C6.26516 1.26428 9.3174 0 12.5 0C15.6826 0 18.7348 1.26428 20.9853 3.51472C23.2357 5.76516 24.5 8.8174 24.5 12C24.5 15.1826 23.2357 18.2348 20.9853 20.4853C18.7348 22.7357 15.6826 24 12.5 24ZM18.5 10.8H6.5V13.2H18.5V10.8Z"
                        fill="#B1081A"
                      />
                    </g>
                  ) : (
                    <path
                      d="M20.9878 4.01217C25.6707 8.70969 25.6707 16.2901 20.9878 20.9876C18.7357 23.2367 15.683 24.5 12.5001 24.5C9.31724 24.5 6.26451 23.2367 4.01237 20.9876C1.76327 18.7355 0.5 15.6828 0.5 12.4999C0.5 9.31704 1.76327 6.26431 4.01237 4.01217C8.70989 -0.670722 16.2903 -0.670722 20.9878 4.01217ZM14.6952 20.5486V14.695H20.5488V10.3048H14.6952V4.45119H10.305V10.3048H4.45139V14.695H10.305V20.5486H14.6952Z"
                      fill="#B1081A"
                    />
                  )}
                </svg>
              </div>
              <div
                className={`faq-answer ${openFAQ === index ? "openss" : ""}`}
              >
                {openFAQ === index && <p className="ml-2">{item.answer}</p>}
              </div>
              <span className="linos"></span>
            </div>
          ))}
        </section>
        <section className="aods">
          <img src="https://www.adspeed.com/placeholder-300x450.gif" />
        </section>
      </section>
    </section>
  );
};

export default Frequentlyasked;
