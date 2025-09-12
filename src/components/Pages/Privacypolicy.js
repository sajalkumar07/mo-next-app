import React from "react";
import Header from "../Homepage/Structure/header";
import Footer from "../Homepage/Structure/footer";

const Privacypolicy = () => {
  return (
    <>
      <div className="p-6 mt-40 w-[347px]">
        <div className="">
          <h1 className="text-[20px] font-bold mb-4 text-[#818181]">
            PRIVACY & <span className="text-[#AB373A]">POLICY</span>
          </h1>
          <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium ml-4">
            MotorOctane <span className="font-bold">("we," "our," "us")</span>{" "}
            operates the MotorOctane website (The{" "}
            <span className="font-bold">"Service"</span>). This Privacy Policy
            explains how we collect, use, and protect your personal information
            when you use our Service.
          </p>
        </div>

        <div className="">
          <h1 className="text-[20px] font-bold mb-4 text-[#818181]">
            INFORMATION <span className="text-[#AB373A]">WE COLLECT</span>
          </h1>
          <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] ml-4 font-medium">
            We Collect And Process Different Types OF Personal Data To Enhance
            Our Services:
          </p>

          <div className="space-y-8 ml-4">
            {/*section 1*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Personal Information
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We may collect personally identifiable information when you
              voluntarily provide it, including but not limited to:
            </p>

            <div className="flex flex-col font-[Montserrat] font-bold ml-4 mb-4 text-[12px]">
              <span>• Name</span>
              <span>• Email Address</span>
              <span>• Phone Number</span>
              <span>• Postal Address</span>
            </div>

            {/*section 2*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Log Data
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We automatically collect information sent by your browser when you
              visit our service, such as:
            </p>

            <div className="flex flex-col font-[Montserrat] font-bold ml-4 mb-4 text-[12px]">
              <span>• IP Address</span>
              <span>• Browser Type and Version</span>
              <span>• Pages Visited and Time Spent</span>
              <span>• Date and Time of Visit</span>
            </div>

            {/*section 3*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Cookies & Tracking Technologies
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We use cookies and similar technologies to:
            </p>

            <div className="flex flex-col font-[Montserrat] font-bold ml-4 mb-4 text-[12px]">
              <span>• Enhance User Experience</span>
              <span>• Analyze Website Traffic</span>
              <span>• Serve Targeted Advertisements</span>
            </div>

            <div className="font-[Montserrat] font-medium mb-4 text-[12px]">
              You can modify your browser settings to disable cookies, but some
              features may not function properly.
            </div>

            {/*section 5*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              How We Use Your Information
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We Use Collected Information For The Following Purposes:
            </p>

            <div className="flex flex-col font-[Montserrat] font-bold ml-4 mb-4 text-[12px]">
              <span>• Provide and maintain our services</span>
              <span>• Improve and personalize user experience</span>
              <span>• Send updates and promotions</span>
              <span>• Ensure fraud prevention and security</span>
              <span>• Comply with legal obligations</span>
            </div>

            {/*section 6*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Data Sharing & Third-Party Access
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We May Share Your Personal Information With Trusted Third Parties,
              Such As
            </p>

            <div className="flex flex-col  font-[Montserrat] text-[12px] ml-4 mb-4">
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">Service Providers:</span>{" "}
                  <span className="font-medium">
                    To Facilitate Our Service (E.G., Payment Gateways, Customer
                    Support)
                  </span>
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">
                    Advertising & Analytics Partners:
                  </span>{" "}
                  <span className="font-medium">
                    (E.G., Google, Meta) To Optimize Ad Targeting
                  </span>
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">Legal Authorities:</span>{" "}
                  <span className="font-medium">
                    If Required By Law, Court Order, Or Government Request
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col font-[Montserrat] font-medium mb-4 text-[12px]">
              We Do Not Sell Or Rent Your Data To Third Parties For Marketing
              Purposes:
            </div>

            {/*section 7*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Data Retention & security
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We Retain Your Personal Data Only As Long As Necessary For The
              Purposes Stated. We Implement{" "}
              <span className="font-bold">
                Industry-Standard Encryption, Firewalls, And Secure Access
                Controls
              </span>
              To Protect Your Information. However, No System Is 100% Secure.
            </p>

            {/*section 8*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Your Rights & Choices:
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              You Have The Right To:
            </p>

            <div className="flex flex-col font-[Montserrat] text-[12px] ml-4 mb-4">
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">Access Your Data:</span>{" "}
                  <span className="font-medium">
                    Request A Copy Of Your Personal Information
                  </span>
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">Request Deletion:</span>{" "}
                  <span className="font-medium">
                    Ask Us To Delete Your Data
                  </span>
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">Opt-Out Of Marketing:</span>{" "}
                  <span className="font-medium">
                    Unsubscribe From Promotional Emails
                  </span>
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">Restrict Processing:</span>{" "}
                  <span className="font-medium">
                    Limit How We Use Your Data
                  </span>
                </span>
              </div>
            </div>

            <div className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              To Exercise These Rights, Contact Us At [Insert Contact Email]
            </div>

            {/*section 9*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Children's Privacy:
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              Our Service Is Not Intended For Children Under{" "}
              <span className="font-bold">16 Years</span> (As Per GDPR
              Compliance). If We Become Aware Of Collected Data From A Child
              Under 16, We Will Delete It Immediately.
            </p>

            {/*section 10*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Compliance With Laws
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We Comply With Applicable Data Protection Laws, Including:
            </p>

            <div className="flex flex-col font-[Montserrat] text-[12px] ml-4 mb-4">
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">India:</span>{" "}
                  <span className="font-medium">
                    Digital Personal Data Protection Act (DPDP), 2023
                  </span>
                </span>
              </div>
              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">EU:</span>{" "}
                  <span className="font-medium">
                    General Data Protection Regulation (GDPR)
                  </span>
                </span>
              </div>

              <div className="flex items-start">
                <span className="mr-2 font-bold">•</span>
                <span>
                  <span className="font-bold">US:</span>{" "}
                  <span className="font-medium">
                    California Consumer Privacy Act (CCPA), If Applicable
                  </span>
                </span>
              </div>
            </div>

            {/*section 11*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Changes To This Privacy Policy
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              We May Update This Privacy Policy Periodically. Any Changes Will
              Be Posted Here, And We Encourage You To Review It Regularly.
            </p>

            {/*section 12*/}
            <h2 className="text-[12px] font-bold mb-4 text-[#AB373A] font-[Montserrat]">
              Contact Us
            </h2>
            <p className="mb-4 leading-relaxed text-[12px] font-[Montserrat] font-medium">
              For Any Questions Regarding This Privacy Policy, Contact Us At:
            </p>

            <div className="flex flex-col font-[Montserrat] font-bold mb-4 text-[12px]">
              <span className="mb-1">
                📧{" "}
                <a
                  className="border-b border-black"
                  href="mailto:Talktous@Motoroctane.Com"
                  style={{ textDecoration: "underline !important" }}
                >
                  Talktous@Motoroctane.Com
                </a>
              </span>

              <span>
                <span className="font-medium">WhatsApp:</span>{" "}
                <a href="https://wa.me/918779952811">+91 877 995 2811</a>
              </span>
            </div>

            {/*section 13*/}
            <div className="flex flex-col font-[Montserrat] font-bold mb-4 text-[12px]">
              <span>
                📍Akshar Business Park. T Wing, Office #1067 & #1067A, 1st
                Floor.
              </span>
              <span> Sector 25, Turbhe, Vashi,</span>
              <span> Navi Mumbai 400703</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacypolicy;
