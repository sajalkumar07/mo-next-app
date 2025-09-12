import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import VariantsTab from "./variantstable";

const Variants = () => {
  const [singlecardData, setSingleCardData] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <section className="mt-40">
      <div className="label flex justify-center items-center">
        <p className="text-[19px] text-left ">
          <span className="text-wrapper">{singlecardData.carname}</span>
          <span className="span">&nbsp;</span>
          <span className="text-wrapper-2">VARIANTS</span>
        </p>
      </div>

      <VariantsTab carId={params.id} />
    </section>
  );
};

export default Variants;
