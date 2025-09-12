import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import Footer from "../Homepage/Structure/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Tearm = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="back_image"></div>

        <section className="d-flex align-items-center justify-content-center">
          <div
            style={{ marginTop: "120px", height: "100%", gap: "10px" }}
            className="cards_section d-flex flex-column"
          >
            <h1 style={{ color: "grey", fontSize: "24px", fontWeight: "" }}>
              TERMS AND <span style={{ color: "#b10819" }}>CONDITIONS</span>
            </h1>
            <p style={{ color: "grey", fontWeight: "" }}>
              Welcome to motoroctane.com! These terms and conditions outline the
              rules and regulations for the use of MotorOctane's Website,
              located at https://motoroctane.com/. By accessing this website we
              assume you accept these terms and conditions. Do not continue to
              use motoroctane.com if you do not agree to take all of the terms
              and conditions stated on this page.
            </p>

            <h2 style={{ color: "#b10819", fontSize: "24px", fontWeight: "" }}>
              COOKIES
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              We employ the use of cookies. By accessing motoroctane.com, you
              agreed to use cookies in agreement with the MotorOctane's Privacy
              Policy. Most interactive websites use cookies to let us retrieve
              the user’s details for each visit. Cookies are used by our website
              to enable the functionality of certain areas to make it easier for
              people visiting our website. Some of our affiliate/advertising
              partners may also use cookies.
            </p>

            <h2 style={{ color: "#b10819", fontSize: "24px", fontWeight: "" }}>
              LICENSE
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              Unless otherwise stated, MotorOctane and/or its licensors own the
              intellectual property rights for all material on motoroctane.com.
              All intellectual property rights are reserved. You may access this
              from motoroctane.com for your own personal use subjected to
              restrictions set in these terms and conditions.
            </p>

            <h2
              style={{
                color: "#b10819",
                fontSize: "24px",
                fontWeight: "",
                fontFamily: "",
              }}
            >
              Log Files
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              motoroctane.com follows a standard procedure of using log files.
              These files log visitors when they visit websites. All hosting
              companies do this and a part of hosting services' analytics. The
              information collected by log files includes internet protocol (IP)
              addresses, browser type, Internet Service Provider (ISP), date and
              time stamp, referring/exit pages, and possibly the number of
              clicks. These are not linked to any information that is personally
              identifiable.
            </p>

            <h2
              style={{
                color: "#b10819",
                fontSize: "24px",
                fontWeight: "",
                fontFamily: "",
              }}
            >
              Cookies and Web Beacons
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              Like any other website, motoroctane.com uses 'cookies'. These
              cookies are used to store information including visitors'
              preferences, and the pages on the website that the visitor
              accessed or visited.
            </p>

            <h2
              style={{
                color: "#b10819",
                fontSize: "24px",
                fontWeight: "",
                fontFamily: "",
              }}
            >
              Google DoubleClick DART Cookie
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              Google is one of a third-party vendor on our site. It also uses
              cookies, known as DART cookies, to serve ads to our site visitors
              based upon their visit to www.website.com and other sites on the
              internet.
            </p>

            <h2
              style={{
                color: "#b10819",
                fontSize: "24px",
                fontWeight: "",
                fontFamily: "",
              }}
            >
              Our Advertising Partners
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              Some of advertisers on our site may use cookies and web beacons.
              Our advertising partners are listed below. Each of our advertising
              partners has their own Privacy Policy for their policies on user
              data.
            </p>

            <h2
              style={{
                color: "#b10819",
                fontSize: "24px",
                fontWeight: "",
                fontFamily: "",
              }}
            >
              Advertising Partners Privacy Policies
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              You may consult this list to find the Privacy Policy for each of
              the advertising partners of motoroctane.com. Third-party ad
              servers or ad networks uses technologies like cookies, JavaScript,
              or Web Beacons that are used in their respective advertisements
              and links that appear on motoroctane.com.
            </p>

            <h2
              style={{
                color: "#b10819",
                fontSize: "24px",
                fontWeight: "",
                fontFamily: "",
              }}
            >
              Third Party Privacy Policies
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              motoroctane.com's Privacy Policy does not apply to other
              advertisers or websites. Thus, we are advising you to consult the
              respective Privacy Policies of these third-party ad servers for
              more detailed information.
            </p>

            <h2 style={{ fontWeight: "", color: "grey", fontSize: "20px" }}>
              Children's Information:
            </h2>
            <p style={{ color: "grey", fontWeight: "" }}>
              Another part of our priority is adding protection for children
              while using the internet. We encourage parents and guardians to
              observe, participate in, and/or monitor and guide their online
              activity. motoroctane.com does not knowingly collect any Personal
              Identifiable Information from children under the age of 13.
            </p>

            <h2 style={{ fontWeight: "", color: "grey", fontSize: "20px" }}>
              Changes to This Privacy Policy
            </h2>
            <p style={{ fontSize: "16px", color: "grey", fontWeight: "" }}>
              We may update our Privacy Policy from time to time. Thus, we
              advise you to review this page periodically for any changes. We
              will notify you of any changes by posting the new Privacy Policy
              on this page.
            </p>

            <h2 style={{ fontWeight: "", color: "grey", fontSize: "20px" }}>
              Contact Us
            </h2>
            <p style={{ fontSize: "16px", color: "grey", fontWeight: "" }}>
              If you have any questions or suggestions about our Privacy Policy,
              do not hesitate to contact us.
            </p>
          </div>
        </section>
      </QueryClientProvider>
    </>
  );
};
export default Tearm;
