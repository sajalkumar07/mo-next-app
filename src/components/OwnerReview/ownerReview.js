import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import ChangeCar from "./changeCarOwner";
import { Bookmark, Star, Info, Share2, X } from "lucide-react";

const Sharereviews = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [selectedyesType, setSelectedtesType] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [value, setValue] = useState(2);
  const [value1, setValue1] = useState(2);
  const [value2, setValue2] = useState(2);
  const [value3, setValue3] = useState(2);
  const [value4, setValue4] = useState(2);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    customerName: "",
    email_id: "",
    whatsAppNumber: "",
    mobileNumber: "",
    pinCode: "",
    profession: "",
    refferedBy: "",
    brandName: "",
    product_id: "",
    year: "",
    varient: "",
    fuelType: "",
    transMission: "",
    carNumber: "",
    ratingOfCar: "",
    kindOfCar: "",
    approxKMdriven: "",
    modificationOfVehicle: "",
    whatKindofRoadDrivenon: "",
    howManypropleDrive: "",
    milageinCity: "",
    milageInHighway: "",
    overallRangeApplicableForEV: "",
    whyThisCar: "",
    keyReasons: "",
    featuresLearntAfterPurchaseing: "",
    thingsLackinThisCar: "",
    shortlistedCar1: "",
    shortlistedCar2: "",
    shortlistedCar3: "",
    issueWithCar: "",
    willingToRecommende: "",
    whatsYourEmotion: "",
    nameOfDelership: "",
    cityAndArea: "",
    raingOfDelershipExperience: "",
    whyThisDelership: "",
    didDelershipForcedtoSellanything: "",
    recomendationOfDelership: "",
    serviceOfcarOnDelership: "",
    haveYouServiced: "",
    differentNameOfDelership: "",
    tipForpeopleForService: "",
    shareAboutDelerchip: "",
    serviceExperience: "",
    approxServiceCost: "",
    yourStory: "",
  });

  const [imageOfCar, setImageOfCar] = useState(null);
  const [selectedyesTypeone, setSelectedyesTypeone] = useState("");
  const params = useParams();

  const handleImageUploadone = (e) => {
    const file = e.target.files[0]; // Get the first selected file

    if (file) {
      const ext = file.name.split(".").pop().toLowerCase(); // Check file extension
      if (["gif", "png", "jpg", "jpeg"].indexOf(ext) === -1) {
        setErrorMessage("Not an Image...");
      } else {
        setErrorMessage(""); // Clear any error message
        setImageOfCar(file); // Set the image in the new state
      }
    }
  };

  // Handle input change to update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
  //       );
  //       const data = await response.json();
  //       setFormData((prevState) => ({
  //         ...prevState,
  //         brand: data.brand?._id, // Store brand ID
  //         brandName: data.brand?.name, // Store brand name
  //         product_id: data._id, // Extract product ID
  //         carName: data.carname, // Store car name separately
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching car data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [params.id]);

  const handleSubmit = async (skipValidation = false) => {
    // Skip validation if skipValidation flag is true
    if (!skipValidation && (!formData.brand || !formData.product_id)) {
      toast.error("Brand and Product ID are required!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setCurrentPage(999); // Set current page to 999 to indicate form submission

    const formDataToSend = new FormData();

    // Prepare the form data to send
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (imageOfCar) {
      formDataToSend.append("imageOfCar", imageOfCar);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/tern/add-review`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const responseData = await response.json();

      if (skipValidation === true) {
        setCurrentPage(1);
      } else {
        if (responseData.error === "Approved is not defined") {
          setShowSuccessPopup(true); // Show success popup instead of toast
        } else if (response.ok) {
          setShowSuccessPopup(true); // Show success popup for successful submission
        } else {
          toast.error(`Error: ${responseData.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/brands`)
      .then((response) => response.json())
      .then((data) => setBrands(data.data))
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  const fetchModels = (brandId) => {
    const url = `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${brandId}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setModels(data);
      })
      .catch((error) => console.error("Error fetching models:", error));
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setFormData((prev) => ({ ...prev, brand: brandId }));
  };

  useEffect(() => {
    // Fetch models automatically when the brand is set (either from API or user selection)
    if (formData.brand) {
      fetchModels(formData.brand); // Trigger fetch when brand is set
    } else {
      setModels([]); // If brand is not set, clear models
    }
  }, [formData.brand]); // Effect runs when formData.brand changes

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setFormData((prev) => ({ ...prev, product_id: modelId }));
  };

  const handleYearChange = (date) => {
    setSelectedYear(date);
    setFormData((prev) => ({
      ...prev,
      year: date ? date.getFullYear() : "",
    }));
    setIsCalendarOpen(false);
  };

  // Handle calendar toggle on SVG click
  const handleCalendarToggle = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  // Handle car type selection
  const handleCarTypeSelect = (carType) => {
    setSelectedCarType(carType); // Set the selected car type
  };
  const handleyesTypeSelect = (carType) => {
    setSelectedtesType(carType); // Set the selected car type
  };

  // Handle file input change (when images are selected)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert file list to array
    setImages([...images, ...files]); // Add selected images to state
  };

  const handleRatingChange = (ratingOfCar) => {
    setFormData({
      ...formData,
      ratingOfCar,
    });
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index); // Remove image by index
    setImages(newImages); // Update state
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prevState) => {
      // If the checkbox is checked, add it to the selected options
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value); // Uncheck: Remove from the selected options
      } else {
        return [...prevState, value]; // Check: Add to the selected options
      }
    });
  };

  // Handle range change
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleChange1 = (event) => {
    setValue1(event.target.value1);
  };
  const handleChange2 = (event) => {
    setValue2(event.target.value2);
  };

  const labels = ["Very Poor", "Poor", "Average", "Good", "Excellent"];
  const labels2 = ["No Indeed", "May Be", "Definitely"];
  const labels3 = ["Unhappy", "Okay", "Average", "Satisfied", "Very Happy"];

  // Function for updating willingToRecommende
  const handleWillingToRecommendSubmit = () => {
    setFormData((prevData) => ({
      ...prevData,
      willingToRecommende: labels2[value3], // Map the selected index to the label for willingToRecommende
    }));
  };

  // Function for updating whatsYourEmotion
  const handleEmotionSubmit = () => {
    setFormData((prevData) => ({
      ...prevData,
      whatsYourEmotion: labels3[value4], // Map the selected index to the label for whatsYourEmotion
    }));
  };

  const handleChange3 = (e) => {
    const { value } = e.target;
    const recommendationMap = {
      0: "Not Recommended",
      1: "Maybe Recommended",
      2: "Definitely Recommended",
    };

    setFormData((prevData) => ({
      ...prevData,
      recommendation: recommendationMap[value], // Send the string value
    }));
  };

  const handleChange4 = (e) => {
    const { value } = e.target;
    const emotionMap = {
      0: "Very Bad",
      1: "Bad",
      2: "Neutral",
      3: "Good",
      4: "Very Good",
    };

    setFormData((prevData) => ({
      ...prevData,
      emotionWithCar: emotionMap[value], // Send the string value
    }));
  };

  const handleEmotionChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      whatsYourEmotion: e.target.value,
    }));
  };

  const handleyesTypeSelectone = (type) => {
    setSelectedyesTypeone(type);
    setFormData((prevData) => ({
      ...prevData,
      modificationOfVehicle: type === "no" ? "no" : "", // Set 'no' or clear the field
    }));
  };

  const handleRoadTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      whatKindofRoadDrivenon: value,
    }));
  };

  const handlePeopleDriveChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      howManypropleDrive: value,
    }));
  };

  const handleKeyReasonsChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevData) => {
      const selectedReasons = prevData.keyReasons
        ? prevData.keyReasons.split(",").map((item) => item.trim())
        : [];

      if (checked) {
        // Add the selected value to the array
        selectedReasons.push(value);
      } else {
        // Remove the unselected value from the array
        const index = selectedReasons.indexOf(value);
        if (index > -1) {
          selectedReasons.splice(index, 1);
        }
      }

      return {
        ...prevData,
        keyReasons: selectedReasons.join(", "), // Store the selected values as comma-separated
      };
    });
  };

  const handleLackInThisCarChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevData) => {
      let updatedThingsLackinThisCar = prevData.thingsLackinThisCar
        ? prevData.thingsLackinThisCar.split(", ")
        : [];

      if (checked) {
        updatedThingsLackinThisCar.push(value);
      } else {
        updatedThingsLackinThisCar = updatedThingsLackinThisCar.filter(
          (item) => item !== value
        );
      }

      return {
        ...prevData,
        thingsLackinThisCar: updatedThingsLackinThisCar.join(", "), // Store the selected values as comma-separated
      };
    });
  };

  const handleIssueChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevData) => {
      const selectedIssues = prevData.issueWithCar
        ? prevData.issueWithCar.split(",").map((item) => item.trim())
        : [];

      if (checked) {
        // Add the selected value to the array
        selectedIssues.push(value);
      } else {
        // Remove the unselected value from the array
        const index = selectedIssues.indexOf(value);
        if (index > -1) {
          selectedIssues.splice(index, 1);
        }
      }

      return {
        ...prevData,
        issueWithCar: selectedIssues.join(", "), // Store the selected values as comma-separated
      };
    });
  };

  const handleWhyThisDealershipChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevData) => {
      const selectedReasons = prevData.whyThisDelership
        ? prevData.whyThisDelership.split(",").map((item) => item.trim())
        : [];

      if (checked) {
        selectedReasons.push(value);
      } else {
        const index = selectedReasons.indexOf(value);
        if (index > -1) {
          selectedReasons.splice(index, 1);
        }
      }

      return {
        ...prevData,
        whyThisDelership: selectedReasons.join(", "),
      };
    });
  };

  const handleForcedCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevData) => {
      const selectedReasons = prevData.didDelershipForcedtoSellanything
        ? prevData.didDelershipForcedtoSellanything
            .split(",")
            .map((item) => item.trim())
        : [];

      if (checked) {
        selectedReasons.push(value);
      } else {
        const index = selectedReasons.indexOf(value);
        if (index > -1) {
          selectedReasons.splice(index, 1);
        }
      }

      return {
        ...prevData,
        didDelershipForcedtoSellanything: selectedReasons.join(", "),
      };
    });
  };

  const handleHaveYouServicedChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      haveYouServiced: value,
    }));
  };

  const handleServiceCheckboxChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedService =
        value === "Same" ? "Same" : value === "Another" ? "Another" : "";
      return {
        ...prevData,
        serviceOfcarOnDelership: updatedService,
      };
    });
  };

  const handleDealerNameChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      dealerName: value,
    }));
  };

  const handleEmotionChangeone = (e) => {
    const { value } = e.target;
    const emotionMap = {
      0: "veryBad",
      1: "sad",
      2: "neutral",
      3: "good",
      4: "veryGood",
    };

    setFormData((prevData) => ({
      ...prevData,
      serviceOfcarOnDelership: emotionMap[value], // Map the range value to the appropriate emotion string
    }));
  };

  const handleWhatsAppRadioChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      whatsAppNumber:
        value === "mobile" ? prevData.mobileNumber : prevData.whatsAppNumber,
    }));
  };

  // In Sharereviews component
  const handleCarSelect = (selectedCar) => {
    setFormData((prev) => ({
      ...prev,
      brand: selectedCar.brandId, // Store brand ID
      brandName: selectedCar.brandName, // Store brand name
      product_id: selectedCar.carId,
      carName: selectedCar.carName, // Store the car model name
      varient: selectedCar.variantName,
      fuelType: selectedCar.fuelType || "",
      transmission: selectedCar.transmission || "",
    }));
  };

  const toggleTooltip = (tooltipId) => {
    setActiveTooltip(activeTooltip === tooltipId ? null : tooltipId);
  };

  const Tooltip = ({ id, content, children }) => {
    return (
      <div className="relative tooltip-container inline-flex justify-center">
        <div
          onClick={() => toggleTooltip(id)}
          onMouseEnter={() => setActiveTooltip(id)}
          className="cursor-pointer flex justify-center"
        >
          {children}
        </div>
        {activeTooltip === id && (
          <div className="absolute z-10 w-[210px] min-h-[75px] px-2 pt-3 pb-2 text-[9px] font-medium text-white bg-[#828282F2] rounded-2xl shadow-lg transform -translate-x-1/2 left-1/2 bottom-full mb-2 ">
            <button
              onClick={() => setActiveTooltip(null)}
              className="absolute top-1 right-2 text-white text-xs font-bold focus:outline-none"
            >
              <X size={14} />
            </button>
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-32 md:mt-20 p-10 md:p-10 text-[#6B6B6B]">
      <div className="flex justify-center items-center flex-col w-full">
        <div className="owners-review-hed sapce-x-4">
          <span>OWNER’S </span>&nbsp;
          <span className="text-[#b1081a]"> REVIEW</span>
        </div>

        <p className=" text-center font-medium  text-[12px] p-4 font-[Montserrat]">
          THIS FORM WILL MAKE IT EASY FOR US TO UNDERSTAND EVERYTHING ABOUT THE
          CAR OWNER
        </p>
      </div>
      <div className="font-[Montserrat] font-bold text-[13px]">
        <div className="d-flex gap-3">
          <div className="form-group w-50">
            <label>
              First Name <sup>*</sup>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  firstName: e.target.value,
                  customerName: `${e.target.value} ${
                    formData.lastName || ""
                  }`.trim(),
                });
              }}
              className="w-full bg-transparent border-b-2 border-[#6B6B6B]"
            />
          </div>
          <div className="form-group w-50">
            <label>
              Last Name <sup>*</sup>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                  customerName: `${formData.firstName || ""} ${
                    e.target.value
                  }`.trim(),
                });
              }}
              className="w-full bg-transparent border-b-2 border-[#6B6B6B]"
            />
          </div>
        </div>

        <div className="flex flex-col  gap-3 mt-3">
          <div className="form-group w-full">
            <label>
              Email <sup>*</sup>
            </label>
            <input
              type="text"
              name="email_id"
              value={formData.email_id}
              onChange={handleInputChange}
              className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
            />
          </div>

          <div className="form-group w-full">
            <label>
              Mobile Number <sup>*</sup>
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
            />
          </div>
        </div>

        <div className="d-flex gap-3 mt-3">
          <div className="form-group w-50 -mt-4">
            <label className="mb-122">Whatsapp Number</label>
            <br></br>
            <div className="d-flex">
              <input
                type="radio"
                id="sameAsMobile"
                name="whatsAppNumberRadio"
                checked={formData.whatsAppNumber === formData.mobileNumber}
                onChange={() => {
                  setFormData({
                    ...formData,
                    whatsAppNumber: formData.mobileNumber,
                  });
                }}
              />
              <span className="gfk">Same as above</span>{" "}
            </div>
            <input
              type="text"
              name="whatsAppNumber"
              value={formData.whatsAppNumber}
              onChange={(e) => {
                // Allow manual entry when not using "Same as above"
                if (formData.whatsAppNumber !== formData.mobileNumber) {
                  setFormData({
                    ...formData,
                    whatsAppNumber: e.target.value,
                  });
                }
              }}
              className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
              disabled={formData.whatsAppNumber === formData.mobileNumber}
              style={{
                cursor:
                  formData.whatsAppNumber === formData.mobileNumber
                    ? "not-allowed"
                    : "auto", // Disable cursor if input is disabled
              }}
            />
          </div>
          <div className="form-group w-50">
            <label>Pincode</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
            />
          </div>
        </div>
        <div className="d-flex gap-3 mt-3">
          <div className="form-group w-50">
            <label>Profession </label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
            />
          </div>
          <div className="form-group w-50">
            <label>Referred By</label>
            <input
              type="text"
              name="refferedBy"
              value={formData.refferedBy}
              onChange={handleInputChange}
              className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-col">
          <div className="flex items-center ">
            <span className="text-4xl font-semibold text-[#818181]">
              YOUR CAR <span className="text-[#B10819]">DETAILS</span>
            </span>
          </div>

          <div className="flex justify-center items-center space-x-4 mt-2 mb-4 font-[Montserrat] text-[13px] font-bold">
            <label className="block border-black text-gray-600 mt-2">
              BRAND
            </label>
            <div className="flex items-center space-x-2">
              <div className="">
                {formData.brandName ? (
                  <span className="font-semibold text-gray-600 border-2 border-gray-600 px-2 h-[19px] text-center items-center flex justify-center ">
                    {formData.brandName}
                  </span>
                ) : (
                  <span className="text-gray-400"></span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 font-[Montserrat] text-[13px] font-bold ">
          <div>
            <ChangeCar
              onCarSelect={(selectedCar) => {
                // Only update transmission (normalize "single speed automatic" to "automatic")
                const normalizedTransmission = selectedCar.transmission
                  ?.toLowerCase()
                  .includes("automatic")
                  ? "automatic"
                  : selectedCar.transmission?.toLowerCase();

                setFormData((prev) => ({
                  ...prev,
                  brand: selectedCar.brandId,
                  brandName: selectedCar.brandName,
                  product_id: selectedCar.carId,
                  carName: selectedCar.carName,
                  varient: selectedCar.variantName,
                  fuelType: selectedCar.fuelType,
                  transmission: normalizedTransmission || "",
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Year</label>
            <div className="relative">
              <input
                type="text"
                value={formData.year}
                onChange={handleInputChange}
                name="year"
                className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Variant</label>
            <input
              type="text"
              // readOnly
              name="varient"
              value={formData.varient}
              onChange={handleInputChange}
              className="w-full bg-transparent text-black border-b-2 border-[#6B6B6B]"
            />
          </div>

          {/* Third Row */}
          <div>
            <label className="block text-gray-600 mb-1">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className="w-[159px] h-[20px] border-[#6B6B6B] border-2"
            >
              <option value="">Choose Fuel</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="cng">CNG</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 font-[Montserrat] font-bold mt-2 text-[13px] ">
          <div className="">
            <label className="block text-gray-600 mb-1">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className="border-[#6B6B6B] border-2 w-[159px] h-[20px]"
            >
              <option value="">Choose Transmission</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="amt">AMT</option>
              <option value="cvt">CVT</option>
              <option value="imt">IMT</option>
              <option value="dct">Duel Clutch</option>
            </select>
          </div>

          <div className="">
            <label className="block text-gray-600 mb-1">Car Number</label>
            <input
              type="text"
              value={formData.carNumber}
              onChange={handleInputChange}
              name="carNumber"
              className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
            />
          </div>
        </div>

        {/* Rating Slider */}
        <div className="mt-6 font-[Montserrat] font-bold">
          <label className="block text-gray-600 mt-4 text-[13px]">
            How much do you like this car?
          </label>
          <div className="flex items-center flex-col">
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={formData.ratingOfCar}
              onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#AE3E41] rounded-lg appearance-none cursor-pointer accent-[#AE3E41]"
            />

            {/* Labels under slider */}
            <div className="flex justify-between sapce-x-8 w-full mt-2 ">
              {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((val) => (
                <span className="font-[Montserrat] font-bold" key={val}>
                  <p className="font-[Montserrat] font-bold">{val}</p>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Image Upload Section */}

        <div className="flex justify-center items-center flex-col text-center">
          {/* Image Upload */}
          <span className="font-[Montserrat] font-bold text-[13px] mb-4">
            Upload Images of you with your car
          </span>
          <div className="bg-[#D4D4D4] w-full h-[152px] flex justify-center items-center font-[Montserrat] font-bold relative">
            {/* Show image preview if an image is selected */}
            {imageOfCar && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(imageOfCar)}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={() => setImageOfCar(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload buttons (only show if no image is selected) */}
            {!imageOfCar && (
              <div className="flex flex-col gap-4">
                {/* Remove the Open Camera button if you don't want camera functionality */}
                {/* Or keep it separate with capture attribute */}
                <label
                  htmlFor="cameraUpload"
                  className="bg-[#F3F3F3] w-[147px] h-[23px] text-center items-center flex justify-center cursor-pointer"
                >
                  <span>Open Camera</span>
                </label>
                <input
                  type="file"
                  id="cameraUpload"
                  accept="image/*"
                  capture="environment" // This will open camera
                  onChange={handleImageUploadone}
                  style={{ display: "none" }}
                />

                {/* Regular file upload without capture attribute */}
                <label
                  htmlFor="galleryUpload"
                  className="bg-[#F3F3F3] w-[147px] h-[23px] text-center items-center flex justify-center"
                >
                  <span>Upload Images here</span>
                </label>
                <input
                  type="file"
                  id="galleryUpload"
                  accept="image/*"
                  onChange={handleImageUploadone}
                  style={{ display: "none" }}
                  // Remove the capture attribute to open gallery
                />
              </div>
            )}
          </div>

          {/* Error message display */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}
        </div>

        {/* Car Type Selection */}
        <div className="mt-6">
          <label className="block text-gray-600 font-[Montserrat] font-bold text-[13px] mb-4">
            What kind of a Car?
          </label>
          <div className="flex justify-center space-x-4">
            <button
              className={`font-[Montserrat] font-bold border w-[113px] h-[28px] flex justify-center items-center rounded-md
        ${
          formData.kindOfCar === "Brand New"
            ? "bg-[#AB373A] text-white"
            : "bg-white text-[#656565]"
        }`}
              onClick={() =>
                setFormData({ ...formData, kindOfCar: "Brand New" })
              }
            >
              BRAND NEW
            </button>

            {/* Used Car */}
            <button
              className={`font-[Montserrat] font-bold border w-[113px] h-[28px] flex justify-center items-center rounded-md 
        ${
          formData.kindOfCar === "USED CAR"
            ? "bg-[#AB373A] text-white"
            : "bg-white text-[#656565]"
        }`}
              onClick={() =>
                setFormData({ ...formData, kindOfCar: "USED CAR" })
              }
            >
              USED CAR
            </button>
          </div>
        </div>

        {/* Kilometers Driven */}
        <div className="mt-6">
          <label className="block text-gray-600 mb-1 text-[13px] font-[Montserrat] font-bold">
            Approximate kilometers Driven?
          </label>
          <input
            type="text"
            value={formData.approxKMdriven}
            onChange={handleInputChange}
            name="approxKMdriven"
            className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
          />
        </div>

        {/* Mileage Details */}
        <div className="grid grid-cols-2 gap-6 mt-6 text-[13px] font-[Montserrat] font-bold">
          <div>
            <label className="block text-gray-600 mb-1">
              {formData.fuelType === "electric"
                ? "City Range (Approx.)"
                : "Mileage on city (Approx.)?"}
            </label>
            <input
              type="text"
              name="milageinCity"
              value={formData.milageinCity}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b-2 border-[#6B6B6B]"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">
              {formData.fuelType === "electric"
                ? "Highway Range (Approx.)"
                : "Mileage on highway (Approx.)?"}
            </label>

            <input
              type="text"
              value={formData.milageInHighway}
              onChange={handleInputChange}
              name="milageInHighway"
              className="w-full bg-transparent border-b-2 border-[#6B6B6B]"
            />
          </div>
        </div>
      </div>

      {/*HOW DID YOU FINALISE T */}
      <div className="">
        <div className="mt-4">
          <div className="flex items-center ">
            <h2 className="text-4xl font-semibold text-[#81818]">
              HOW DID YOU <span className="text-[#B10819]">FINALISE?</span>
            </h2>
          </div>

          <div className="flex justify-center items-center flex-col text-[13px] font-[Montserrat] font-bold mt-4">
            <div className="form-group w-100">
              <label>Overall Range (Applicable only to EVs)</label>
              <input
                type="text"
                name="featuresLearntAfterPurchaseing"
                className=" mt-3 border-b-2 border-[#606060] w-full bg-transparent"
              />
            </div>

            <div className="form-group w-100">
              <span className="lex items-center gap-1">
                {" "}
                <label>What do you like about this car?</label>{" "}
                <Tooltip
                  id="exShowroomPrice"
                  content="The Ex-Showroom price is the initial cost set by the dealer, inclusive of GST paid to the government and the procurement fee from the manufacture."
                >
                  <Info size={14} className="cursor-pointer" />{" "}
                </Tooltip>
              </span>
              <input
                type="text"
                name="whyThisCar" // Bind to state key
                value={formData.whyThisCar} // Set value from state
                onChange={handleInputChange} // Handle changes
                className="border-b-2 border-[#606060] w-full bg-transparent mt-3"
              />
            </div>

            <div className="form-group w-100">
              <label>
                One or more features that you learnt after Purchasing this Car?
              </label>
              <input
                type="text"
                name="featuresLearntAfterPurchaseing"
                className="border-b-2 border-[#606060] w-full bg-transparent  mt-3"
                value={formData.featuresLearntAfterPurchaseing}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="text-[13px] font-[Montserrat] font-bold ">
          <div className="d-flex gap-3 mt-1">
            <div className="form-group w-100 mb-1">
              <label>Things Lack in this Car?</label>
            </div>
          </div>
          <div className="flex gap-8 mt-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4 w-1/2">
              {[
                "Features",
                "Ride Quality on Bad Road",
                "Design",
                "Luxury",
                "Service",
                "Mileage",
              ].map((value) => (
                <label className="flex items-center gap-2" key={value}>
                  <input
                    type="checkbox"
                    value={value}
                    id={value}
                    checked={formData.thingsLackinThisCar
                      .split(", ")
                      .includes(value)}
                    onChange={handleLackInThisCarChange}
                    className="accent-[#B1081A]"
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 w-1/2">
              {[
                "Built Quality",
                "Music System",
                "Comfort",
                "Handling",
                "Performance",
                "Resale",
                "Others",
              ].map((value) => (
                <label className="flex items-center gap-2" key={value}>
                  <input
                    type="checkbox"
                    value={value}
                    id={value}
                    checked={formData.thingsLackinThisCar
                      .split(", ")
                      .includes(value)}
                    onChange={handleLackInThisCarChange}
                    className="accent-[#B1081A]"
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="d-flex gap-3 mt-3">
            <div className="form-group w-100 mb-1">
              <label>Issues with the Car?</label>
            </div>
          </div>

          <div className="flex gap-8 mt-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4 w-1/2">
              {["Service Center", "Electronic", "Mechanicals"].map(
                (issue, index) => (
                  <label className="flex items-center gap-2" key={index}>
                    <input
                      type="checkbox"
                      value={issue}
                      id={`issue-${index}`}
                      onChange={handleIssueChange}
                      checked={formData.issueWithCar
                        .split(",")
                        .map((item) => item.trim())
                        .includes(issue)}
                      className="accent-[#B1081A]"
                    />
                    <span>{issue}</span>
                  </label>
                )
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 w-1/2">
              {["Defects", "Malfunctions", "None"].map((issue, index) => (
                <label className="flex items-center gap-2" key={index + 3}>
                  <input
                    type="checkbox"
                    value={issue}
                    id={`issue-${index + 3}`}
                    onChange={handleIssueChange}
                    checked={formData.issueWithCar
                      .split(",")
                      .map((item) => item.trim())
                      .includes(issue)}
                    className="accent-[#B1081A]"
                  />
                  <span>{issue}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="w-100   text-[13px] font-[Montserrat] font-bold">
            {/* Emotion Range */}
            <div className="flex w-100 mt-4 flex-col text-[13px] font-[Montserrat] font-bold">
              <label>What's your emotion with the car?</label>
              <input
                type="range"
                className="form-range w-100 bg-[#AE3E41] accent-[#AE3E41]"
                min="0"
                max="2"
                step="1"
                value={
                  ["Unhappy", "Satisfied", "Very Happy"].indexOf(
                    formData.whatsYourEmotion
                  ) || 0
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsYourEmotion: ["Unhappy", "Satisfied", "Very Happy"][
                      e.target.value
                    ],
                  })
                }
              />
              <div className="d-flex  justify-content-between text-[10px] font-[Montserrat] font-bold">
                {["Unhappy", "Satisfied", "Very Happy"].map((label) => (
                  <span
                    className="text-[10px] font-[Montserrat] font-bold"
                    key={label}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*DEALEARSHIP EXP. */}
      <div className="mt-4">
        <div className="flex items-center ">
          <h2 className="text-4xl font-semibold text-[#81818]">
            DEALERSHIP
            <span className="text-[#B10819]"> EXPERIENCE</span>
          </h2>
        </div>

        <div className="flex w-full flex-col text-[13px] font-[Montserrat] font-bold mt-4">
          <div className="form-group ">
            <label>Name of the Dealership?</label>
            <input
              type="text"
              name="nameOfDelership"
              value={formData.nameOfDelership}
              onChange={handleInputChange}
              className=" w-full border-b-2  border-[#606060] bg-transparent"
              placeholder=""
            />
          </div>

          <div className="form-group ">
            <label>City & Area?</label>
            <input
              type="text"
              name="cityAndArea"
              value={formData.cityAndArea}
              onChange={handleInputChange}
              className="w-full border-b-2 border-[#606060] bg-transparent"
            />
          </div>
        </div>

        <div className="w-100 selectbard text-[13px] font-[Montserrat] font-bold">
          <div className="flex w-100 mt-4 flex-col ">
            <label className="text-[13px] font-[Montserrat] font-bold mb-4">
              Purchase experience
            </label>
            <input
              type="range"
              className="form-range w-100 bg-[#AE3E41] accent-[#AE3E41] text-[10px] font-[Montserrat] font-bold "
              min="0"
              max="4"
              step="1"
              value={
                [
                  "Very Poor",
                  "Poor",
                  "Very Average",
                  "Good",
                  "Excellent",
                ].indexOf(formData.raingOfDelershipExperience) || 0
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  raingOfDelershipExperience: [
                    "Very Poor",
                    "Poor",
                    "Very Average",
                    "Good",
                    "Excellent",
                  ][e.target.value],
                })
              }
            />
            <div className="flex justify-between gap-4 text-[13px] font-[Montserrat] font-bold ">
              {["Very Poor", "Poor", "Very Average", "Good", "Excellent"].map(
                (label) => (
                  <span
                    className="text-[10px] font-[Montserrat] font-bold "
                    key={label}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4 text-[13px] font-[Montserrat] font-bold ">
          <div className="form-group w-100 mb-1">
            <label>Why did you choose this Dealership?</label>
          </div>
        </div>

        <div className="d-flex gap-3 mt-2 text-[13px] font-[Montserrat] font-bold ">
          <div className="form-group w-100 d-flex flex-column gap-1">
            {[
              "Near me",
              "Better Deal",
              "Better by Experience",
              "Recommended By Someone",
            ].map((option, index) => (
              <div className="form-check d-flex align-items-center" key={index}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={option}
                  id={`dealership-option-${index}`}
                  onChange={handleWhyThisDealershipChange}
                  checked={formData.whyThisDelership
                    ?.split(",")
                    .map((item) => item.trim())
                    .includes(option)}
                  style={{ accentColor: "#B1081A" }}
                />
                <label
                  className="form-check-label ml-4"
                  htmlFor={`dealership-option-${index}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex gap-3 mt-2">
          <div className="form-group w-100 mb-1 text-[13px] font-[Montserrat] font-bold ">
            <label>Did the Dealership force sell you anything?</label>
          </div>
        </div>

        <div className="d-flex gap-3 mt">
          <div className="form-group w-100 d-flex flex-column gap-1 text-[13px] font-[Montserrat] font-bold ">
            {[
              "Insurance",
              "Accessories",
              "Extended Warranty",
              "Everything",
              "No Nothing the Dealership was good",
            ].map((option, index) => (
              <div
                className="form-check d-flex align-items-center"
                key={index + 4}
              >
                <input
                  className="form-check-input "
                  type="checkbox"
                  value={option}
                  id={`forced-sale-option-${index}`}
                  onChange={handleForcedCheckboxChange}
                  checked={formData.didDelershipForcedtoSellanything
                    ?.split(",")
                    .map((item) => item.trim())
                    .includes(option)}
                  style={{ accentColor: "#B1081A" }}
                />
                <label
                  className="form-check-label ml-4"
                  htmlFor={`forced-sale-option-${index}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex-grow">
            <label className="block text-[13px] font-[Montserrat] font-bold">
              Would you recommend this dealer for Car buyers?
            </label>
          </div>

          <div className="flex justify-start gap-4 items-start">
            {/* Yes Checkbox */}
            <label className="flex items-center text-[13px] font-[Montserrat] font-bold  gap-1 cursor-pointer">
              <input
                style={{ accentColor: "#B1081A" }}
                type="checkbox"
                checked={formData.recommendationOfDelership === "Yes"}
                onChange={() =>
                  setFormData({
                    ...formData,
                    recommendationOfDelership:
                      formData.recommendationOfDelership === "Yes" ? "" : "Yes",
                  })
                }
                className="form-checkbox  text-red-500"
              />
              <span>Yes</span>
            </label>

            {/* No Checkbox */}
            <label className="flex items-center text-[13px] font-[Montserrat] font-bold  gap-1 cursor-pointer">
              <input
                style={{ accentColor: "#B1081A" }}
                type="checkbox"
                checked={formData.recommendationOfDelership === "No"}
                onChange={() =>
                  setFormData({
                    ...formData,
                    recommendationOfDelership:
                      formData.recommendationOfDelership === "No" ? "" : "No",
                  })
                }
                className="form-checkbox  text-red-500"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center ">
          <h2 className="text-4xl font-semibold text-[#81818]">
            SERVICE <span className="text-[#B10819]">EXPERIENCE</span>
          </h2>
        </div>

        <div className="text-[13px] font-[Montserrat] font-bold mt-4">
          <div className="text-xl">
            Did you get your car serviced at the same Dealership or another? If
            Another, Why?
          </div>
        </div>
        <div className="mt-4">
          <input
            type="text"
            name="dealerName"
            className="w-full bg-transparent  border-b-2 border-[#6B6B6B]"
            value={formData.dealerName}
            onChange={handleDealerNameChange}
          />
        </div>

        <div className="flex flex-col mt-4">
          <div className="">
            <div className="text-xl">Have you Serviced your Car yet?</div>
          </div>

          <div className="form-group d-flex gap-3">
            {/* Yes Checkbox */}
            <label className="flex items-center text-[13px] font-[Montserrat] font-bold   gap-1 cursor-pointer">
              <input
                style={{ accentColor: "#B1081A" }}
                type="checkbox"
                className="form-checkbox  text-red-500"
                checked={formData.haveYouServiced === "Yes"}
                onChange={() =>
                  handleHaveYouServicedChange({
                    target: {
                      value: formData.haveYouServiced === "Yes" ? "" : "Yes",
                    },
                  })
                }
              />
              <span>Yes</span>
            </label>

            {/* No Checkbox */}
            <label className="flex items-center gap-1 text-[13px] font-[Montserrat] font-bold  cursor-pointer">
              <input
                style={{ accentColor: "#B1081A" }}
                type="checkbox"
                className="form-checkbox  text-red-500"
                checked={formData.haveYouServiced === "No"}
                onChange={() =>
                  handleHaveYouServicedChange({
                    target: {
                      value: formData.haveYouServiced === "No" ? "" : "No",
                    },
                  })
                }
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="d-flex flex-column mt-4 text-[13px] font-[Montserrat] font-bold ">
          <div className="form-group">
            <label>Any tips for the people who are servicing this Car?</label>
            <input
              type="text"
              name="tipForpeopleForService"
              className="border-b-2 border-[#606060] w-full bg-transparent"
              placeholder=""
              value={formData.tipForpeopleForService}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>
              Anything you want to share about your Dealership service
              Experience
            </label>
            <input
              type="text"
              name="serviceExperience"
              className="border-b-2 border-[#606060] w-full bg-transparent"
              placeholder=""
              value={formData.serviceExperience}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col  text-[13px] font-[Montserrat] font-bold ">
          <label className="mb-4 ">
            Rate the Overall Service Experience (service cost, service timeline,
            transparency, service Advisor)
          </label>
          <input
            type="range"
            className="bg-[#AB373A] accent-[#AB373A]"
            min="0"
            max="4"
            step="1"
            value={
              ["Very Poor", "Poor", "Average", "Good", "Excellent"].indexOf(
                formData.serviceOfcarOnDelership
              ) || 0
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceOfcarOnDelership: [
                  "Very Poor",
                  "Poor",
                  "Average",
                  "Good",
                  "Excellent",
                ][e.target.value],
              })
            }
            style={{ accentColor: "#B1081A" }}
          />
          <div className="d-flex justify-content-between text-[10px] font-[Montserrat] font-bold">
            {["Very Poor", "Poor", "Average", "Good", "Excellent"].map(
              (label) => (
                <span
                  className="text-[10px] font-[Montserrat] font-bold"
                  key={label}
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        <div className="d-flex flex-column mt-4 text-[13px] font-[Montserrat] font-bold">
          <div className="form-group">
            <label>
              Approx. Service cost - Our team will connect later asking for
              invoices to Verify
            </label>
            <input
              name="approxServiceCost"
              className="border-b-2 border-[#606060] w-full bg-transparent"
              placeholder=""
              value={formData.approxServiceCost}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Your Story</label>
            <input
              name="yourStory"
              className="border-b-2 border-[#606060] w-full bg-transparent"
              placeholder=""
              value={formData.yourStory}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <button className="next-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <div className="image-container" style={{ textAlign: "center" }}></div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ">
          <div className="bg-white p-6 rounded-xl max-w-md w-full ">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                OWNER'S REVIEW <span className="text-[#B10819]">FORM</span>
              </h2>
              <p className="mb-4 font-[Montserrat]">
                Thank you! Your rating and review has been saved, the review
                will be moderated by our team. We will inform you once the
                review is published. Thank you for your patience. If you do not
                get any updates within 48 hours please contact us on
              </p>
              <p className="font-bold mb-4 font-[Montserrat]">
                talktous@motoroctane.com
              </p>

              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setIsOpen(false);
                  window.location.reload();
                }}
                className="bg-[#B1081A] text-white px-4 py-2 rounded font-[Montserrat] font-bold"
              >
                Yayy....!
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Sharereviews;
