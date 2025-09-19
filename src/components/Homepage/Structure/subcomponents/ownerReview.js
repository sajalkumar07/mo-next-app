import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ReviewModal = ({ isOpen, onClose, carId, carBrand }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
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
  const [imageOfCar, setImageOfCar] = useState(null);
  const [selectedyesTypeone, setSelectedyesTypeone] = useState("");
  const params = useParams();

  const [formData, setFormData] = useState({
    customerName: "",
    email_id: "",
    whatsAppNumber: "",
    mobileNumber: "",
    pinCode: "",
    profession: "",
    refferedBy: "",
    brand: carBrand || "",
    product_id: carId || "",
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

  const handleImageUploadone = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (["gif", "png", "jpg", "jpeg"].indexOf(ext) === -1) {
        setErrorMessage("Not an Image...");
      } else {
        setErrorMessage("");
        setImageOfCar(file);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (skipValidation = false) => {
    if (!skipValidation && (!formData.brand || !formData.product_id)) {
      toast.error("Brand and Product ID are required!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }

    setCurrentPage(999);

    const formDataToSend = new FormData();
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
          toast.success(
            "The review is submitted! We will notify you when it gets approved.",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );

          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2000);
        } else if (response.ok) {
          toast.success("The review is submitted successfully!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });

          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          toast.error(`Error: ${responseData.message}`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      // console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  const closePopup = () => {
    onClose();
    setCurrentPage(1);
    handleSubmit(true);
  };

  const nextPage = () => {
    if (currentPage < 8) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/api/brands`)
      // .then((response) => response.json())
      .then((data) => setBrands(data))
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  const fetchModels = (brandId) => {
    const url = `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${brandId}`;
    fetch(url)
      // .then((response) => response.json())
      .then((data) => {
        setModels(data);
      })
      .catch((error) => console.error("Error fetching models:", error));
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setFormData((prev) => ({ ...prev, brand: brandId }));
    fetchModels(brandId);
  };

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

  const handleCalendarToggle = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  const handleCarTypeSelect = (carType) => {
    setSelectedCarType(carType);
  };

  const handleyesTypeSelect = (carType) => {
    setSelectedtesType(carType);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

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

  const handleWillingToRecommendSubmit = () => {
    setFormData((prevData) => ({
      ...prevData,
      willingToRecommende: labels2[value3],
    }));
  };

  const handleEmotionSubmit = () => {
    setFormData((prevData) => ({
      ...prevData,
      whatsYourEmotion: labels3[value4],
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
      recommendation: recommendationMap[value],
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
      emotionWithCar: emotionMap[value],
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
      modificationOfVehicle: type === "no" ? "no" : "",
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
        selectedReasons.push(value);
      } else {
        const index = selectedReasons.indexOf(value);
        if (index > -1) {
          selectedReasons.splice(index, 1);
        }
      }

      return {
        ...prevData,
        keyReasons: selectedReasons.join(", "),
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
        thingsLackinThisCar: updatedThingsLackinThisCar.join(", "),
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
        selectedIssues.push(value);
      } else {
        const index = selectedIssues.indexOf(value);
        if (index > -1) {
          selectedIssues.splice(index, 1);
        }
      }

      return {
        ...prevData,
        issueWithCar: selectedIssues.join(", "),
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
      serviceOfcarOnDelership: emotionMap[value],
    }));
  };

  const handleWhatsAppRadioChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      whatsAppNumber:
        value === "mobile" ? prevData.mobileNumber : prevData.whatsAppNumber,
    }));
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="p-4">
            <div className="text-2xl flex justify-center items-center font-bold text-black">
              <div>
                <span> OWNER'S</span>
                <span className="text-red-600"> REVIEW</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <div className="w-1/2">
                <label className="block text-black mb-1">
                  First Name <sup className="text-red-600">*</sup>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName.split(" ")[0] || ""}
                  onChange={(e) => {
                    const fullName =
                      `${e.target.value} ${formData.lastName}`.trim();
                    setFormData({
                      ...formData,
                      customerName: fullName,
                      customerNameFirstPart: e.target.value,
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="John"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-black mb-1">
                  Last Name <sup className="text-red-600">*</sup>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.customerName.split(" ")[1] || ""}
                  onChange={(e) => {
                    const fullName =
                      `${formData.customerNameFirstPart} ${e.target.value}`.trim();
                    setFormData({
                      ...formData,
                      customerName: fullName,
                      lastName: e.target.value,
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <div className="w-1/2">
                <label className="block text-black mb-1">
                  Mobile Number <sup className="text-red-600">*</sup>
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="+91 88888 88888"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-black mb-1">
                  Email <sup className="text-red-600">*</sup>
                </label>
                <input
                  type="text"
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="John.doe.1969@gmail.com"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <div className="w-1/2">
                <label className="block text-black mb-1">Whatsapp Number</label>
                <div className="flex items-center mb-1">
                  <input
                    type="radio"
                    id="sameAsMobile"
                    name="whatsAppNumberRadio"
                    checked={formData.whatsAppNumber === formData.mobileNumber}
                    onChange={() => handleWhatsAppRadioChange("mobile")}
                    className="mr-2"
                  />
                  <span className="text-black">Same as above</span>
                </div>
                <input
                  type="text"
                  name="whatsAppNumber"
                  value={formData.whatsAppNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="+91 88888 88888"
                  disabled={formData.whatsAppNumber === formData.mobileNumber}
                />
              </div>

              <div className="w-1/2">
                <label className="block text-black mb-1">Pincode</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="w-1/2">
                <label className="block text-black mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder=""
                />
              </div>
              <div className="w-1/2">
                <label className="block text-black mb-1">Referred By</label>
                <input
                  type="text"
                  name="refferedBy"
                  value={formData.refferedBy}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4">
            <div className="text-2xl font-bold text-black">
              OWNER'S <span className="text-red-600">REVIEW</span>
            </div>
            <div className="text-xl font-bold text-black mt-3">
              YOUR CAR DETAILS
            </div>
            <div className="flex gap-3 mt-4">
              <div className="w-1/2">
                <div className="font-bold text-black">Brand & Model</div>
              </div>
              <div className="flex w-1/2">
                <div className="w-1/2 mr-2">
                  <select
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    name="brand"
                    value={formData.brand}
                    onChange={handleBrandChange}
                  >
                    <option value="">Select</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/2">
                  <select
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleModelChange}
                    disabled={!models.length}
                  >
                    <option value="">Select</option>
                    {models.map((model) => (
                      <option key={model._id} value={model._id}>
                        {model.carname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <div className="w-1/2">
                <label htmlFor="year" className="block text-black mb-1">
                  Year
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    id="year"
                    placeholder="2024"
                    value={selectedYear ? selectedYear.getFullYear() : ""}
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                    readOnly
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                  >
                    {/* Calendar icon SVG path */}
                  </svg>
                </div>
                {isCalendarOpen && (
                  <div className="absolute z-10 mt-1">
                    <DatePicker
                      selected={selectedYear}
                      onChange={handleYearChange}
                      showYearPicker
                      dateFormat="yyyy"
                      placeholderText="Select Year"
                      onClickOutside={() => setIsCalendarOpen(false)}
                      inline
                    />
                  </div>
                )}
              </div>

              <div className="w-1/2">
                <label htmlFor="carNumber" className="block text-black mb-1">
                  Car Number
                </label>
                <input
                  type="text"
                  name="carNumber"
                  id="carNumber"
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  placeholder="Enter car number"
                  value={formData.carNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-bold text-black">What Kind Of Car?</div>
            </div>
            <div className="flex gap-3 mt-3 justify-around">
              <button
                className={`w-1/4 py-2 rounded border ${
                  formData.kindOfCar === "Brand New"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-black border-gray-300"
                }`}
                onClick={() =>
                  setFormData({ ...formData, kindOfCar: "Brand New" })
                }
              >
                BRAND NEW
              </button>

              <button
                className={`w-1/4 py-2 rounded border ${
                  formData.kindOfCar === "USED CAR"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-black border-gray-300"
                }`}
                onClick={() =>
                  setFormData({ ...formData, kindOfCar: "USED CAR" })
                }
              >
                USED CAR
              </button>
            </div>
            <div className="mt-3">
              <div className="font-bold text-black">
                Upload an Image of Yours with your Car
              </div>
            </div>
            <div className="flex mt-2">
              {imageOfCar && (
                <div className="relative mr-2">
                  <img
                    src={URL.createObjectURL(imageOfCar)}
                    alt="uploaded-img"
                    className="w-24 h-24 object-cover"
                  />
                  <button
                    onClick={() => setImageOfCar(null)}
                    className="absolute -top-2 -right-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}

              <label
                htmlFor="imageUpload"
                className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center w-24 h-24 cursor-pointer"
              >
                <span className="text-black text-center">Upload Image</span>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUploadone}
                  className="hidden"
                />
              </label>
            </div>
            <div className="mt-3">
              <div className="font-bold text-black">
                Approximate kilometers driven?
              </div>
            </div>
            <div className="mt-2">
              <input
                type="text"
                name="approxKMdriven"
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Enter approximate kilometers driven"
                value={formData.approxKMdriven}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>
            <div className="cars-details mt-3">YOUR CAR DETAILS</div>

            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-50">
                <div className="brand-model">
                  Any Modifications/aftermarket fitment done?
                </div>
              </div>
              <div className="form-group w-50">
                <div className="d-flex gap-3 justify-content-around">
                  <div
                    className={`form-group w-25 justify-content-center d-flex carbtuon text-black ${
                      selectedyesTypeone === "yes" ? "active" : ""
                    }`}
                    onClick={() => handleyesTypeSelectone("yes")}
                  >
                    YES
                  </div>
                  <div
                    className={`form-group w-25 justify-content-center d-flex carbtuon text-black ${
                      selectedyesTypeone === "no" ? "active" : ""
                    }`}
                    onClick={() => handleyesTypeSelectone("no")}
                  >
                    NO
                  </div>
                </div>
              </div>
            </div>

            {selectedyesTypeone === "yes" && (
              <div className="d-flex gap-3 mt-2 ">
                <input
                  type="text"
                  className="custom-input-atrangi owners-review text-black"
                  placeholder="Please Specify"
                  value={formData.modificationOfVehicle} // Bind to formData
                  onChange={handleInputChange} // Handle input change
                />
              </div>
            )}

            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-50">
                <div className="brand-model text-black">Majorly Driven on?</div>
              </div>
              <div className="form-group w-50 d-flex justify-content-end">
                <select
                  className="form-select text-black"
                  aria-label="Default select example"
                  value={formData.whatKindofRoadDrivenon} // Bind state value
                  onChange={handleRoadTypeChange} // Update state on change
                >
                  <option value="" disabled selected>
                    Select road type
                  </option>
                  <option value="Highway">Highway</option>
                  <option value="City Roads">City Roads</option>
                  <option value="Off-Road">Off-Road</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-50">
                <div className="brand-model">
                  How many People Drive the Car?
                </div>
              </div>
              <div className="form-group w-50 d-flex justify-content-end text-black">
                <select
                  className="form-select text-black"
                  aria-label="Default select example"
                  value={formData.howManypropleDrive} // Bind state value
                  onChange={handlePeopleDriveChange} // Update state on change
                >
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  <option value="Me">Me</option>
                  <option value="Me + 1 (Total 2)">Me + 1 (Total 2)</option>
                  <option value="Me + 2 (Total 3)">Me + 2 (Total 3)</option>
                  <option value="Me + 3 (Total 4)">Me + 3 (Total 4)</option>
                </select>
              </div>
            </div>

            {/* <div className='d-flex gap-3 mt-1'>
              <div className="form-group w-75">
                <div className="brand-model">Mostly what kind of Roads you Drive on?</div>

              </div>
              <div className="form-group w-50 d-flex justify-content-end">
                <select class="form-select" aria-label="Default select example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div> */}

            {/* <div className='d-flex gap-3 mt-1'>
              <div className="form-group w-50">
                <div className="brand-model">How many People Drive the Car?</div>

              </div>
              <div className="form-group w-50 d-flex justify-content-end">
                <select class="form-select" aria-label="Default select example">
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div> */}

            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-50">
                <label>Mileage in City (approx.)</label>
                <input
                  type="text"
                  name="milageinCity" // Bind to state
                  value={formData.milageinCity} // Set value from state
                  onChange={handleInputChange} // Handle changes
                  className="custom-input-atrangi owners-review mt-3"
                  placeholder="Number only"
                />
              </div>
              <div className="form-group w-50">
                <label>Mileage in Highways (approx.)</label>
                <input
                  type="text"
                  name="milageInHighway" // Bind to state
                  value={formData.milageInHighway} // Set value from state
                  onChange={handleInputChange} // Handle changes
                  className="custom-input-atrangi owners-review mt-3"
                  placeholder="Number only"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>

            <div className="cars-details mt-3">HOW DID YOU FINALIZE?</div>

            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-100 text-black">
                <label>Why this Car?</label>
                <input
                  type="text"
                  name="whyThisCar" // Bind to state key
                  value={formData.whyThisCar} // Set value from state
                  onChange={handleInputChange} // Handle changes
                  className="custom-input-atrangi owners-review mt-3 text-black"
                />
              </div>
            </div>

            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-100 text-black">
                <label>Key reasons to consider this v/s Competetion?</label>
              </div>
            </div>
            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-50 d-flex flex-column gap-1 text-black">
                {[
                  "Consulted by Us!",
                  "Safety",
                  "Performance",
                  "Features",
                  "Mileage",
                  "Space",
                ].map((reason, index) => (
                  <div
                    className="form-check d-flex align-items-center"
                    key={index}
                  >
                    <input
                      className="form-check-input colornf text-black"
                      type="checkbox"
                      value={reason}
                      id={`reason-${index}`}
                      onChange={handleKeyReasonsChange}
                      checked={formData.keyReasons
                        .split(",")
                        .map((item) => item.trim())
                        .includes(reason)} // Ensure checkbox reflects state
                      style={{ accentColor: "#B1081A" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`reason-${index}`}
                    >
                      {reason}
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-group w-50 d-flex flex-column gap-1 text-black">
                {[
                  "Boot Space",
                  "Resale",
                  "Technology",
                  "Design",
                  "Emotional Connect",
                  "Others",
                ].map((reason, index) => (
                  <div
                    className="form-check d-flex align-items-center text-black"
                    key={index + 6}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={reason}
                      id={`reason-${index + 6}`}
                      onChange={handleKeyReasonsChange}
                      checked={formData.keyReasons
                        .split(",")
                        .map((item) => item.trim())
                        .includes(reason)} // Ensure checkbox reflects state
                      style={{ accentColor: "#B1081A" }}
                    />
                    <label
                      className="form-check-label text-black"
                      htmlFor={`reason-${index + 6}`}
                    >
                      {reason}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <div className="owners-review-hed ">
              OWNER’S <span>REVIEW</span>
            </div>

            <div className="cars-details mt-3 text-black">MY EXPERIENCE</div>
            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-100 text-black">
                <label>
                  One or more features that you learnt after Purchasing this
                  Car?
                </label>
                <input
                  type="text text-black "
                  name="featuresLearntAfterPurchaseing"
                  className="custom-input-atrangi owners-review mt-3 text-black"
                  placeholder="Enter the features"
                  value={formData.featuresLearntAfterPurchaseing}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="d-flex gap-3 mt-1 text-black">
              <div className="form-group w-100 mb-1 text-black">
                <label>Things Lack in this Car?</label>
              </div>
            </div>
            <div className="d-flex gap-3 mt text-black">
              <div className="form-group w-50 d-flex flex-column gap-1 text-black">
                {[
                  "Space",
                  "Built Quality",
                  "Features",
                  "Music System",
                  "Comfort",
                  "Ride Quality on Bad Road",
                  "Design",
                ].map((value) => (
                  <div
                    className="form-check d-flex align-items-center text-black"
                    key={value}
                  >
                    <input
                      className="form-check-input text-black"
                      type="checkbox"
                      value={value}
                      id={value}
                      checked={formData.thingsLackinThisCar
                        .split(", ")
                        .includes(value)} // Ensure checkbox reflects state
                      onChange={handleLackInThisCarChange}
                      style={{ accentColor: "#B1081A" }}
                    />
                    <label
                      className="form-check-label text-black"
                      htmlFor={value}
                    >
                      {value}
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-group w-50 d-flex flex-column gap-1 text-black">
                {[
                  "Handling",
                  "Luxury",
                  "Performance",
                  "Service",
                  "Resale",
                  "Mileage",
                  "Others:No",
                ].map((value) => (
                  <div
                    className="form-check d-flex align-items-center text-black"
                    key={value}
                  >
                    <input
                      className="form-check-input text-black"
                      type="checkbox"
                      value={value}
                      id={value}
                      checked={formData.thingsLackinThisCar
                        .split(", ")
                        .includes(value)} // Ensure checkbox reflects state
                      onChange={handleLackInThisCarChange}
                      style={{ accentColor: "#B1081A" }}
                    />
                    <label
                      className="form-check-labe text-black "
                      htmlFor={value}
                    >
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <div className="owners-review-hed ">
              OWNER’S <span>REVIEW</span>
            </div>
            <div className="cars-details mt-3">MY EXPERIENCE</div>
            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-100 mb-1">
                <label>Issues with the Car?</label>
              </div>
            </div>
            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-50 d-flex flex-column gap-1 text-black">
                {["Service Center", "Electronic", "Mechanicals"].map(
                  (issue, index) => (
                    <div
                      className="form-check d-flex align-items-center text-black"
                      key={index}
                    >
                      <input
                        className="form-check-input text-black"
                        type="checkbox"
                        value={issue}
                        id={`issue-${index}`}
                        onChange={handleIssueChange}
                        checked={formData.issueWithCar
                          .split(",")
                          .map((item) => item.trim())
                          .includes(issue)}
                        style={{ accentColor: "#B1081A" }}
                      />
                      <label
                        className="form-check-label text-black"
                        htmlFor={`issue-${index}`}
                      >
                        {issue}
                      </label>
                    </div>
                  )
                )}
              </div>

              <div className="form-group w-50 d-flex flex-column gap-1 text-black">
                {["Defects", "Malfunctions", "None"].map((issue, index) => (
                  <div
                    className="form-check d-flex align-items-center"
                    key={index + 3}
                  >
                    <input
                      className="form-check-input text-black"
                      type="checkbox"
                      value={issue}
                      id={`issue-${index + 3}`}
                      onChange={handleIssueChange}
                      checked={formData.issueWithCar
                        .split(",")
                        .map((item) => item.trim())
                        .includes(issue)}
                      style={{ accentColor: "#B1081A" }}
                    />
                    <label
                      className="form-check-label text-black"
                      htmlFor={`issue-${index + 3}`}
                    >
                      {issue}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-100 selectbard text-black">
              {/* Recommendation Range */}
              <div className="flex w-100 text-black">
                <label>Would You recommend this Car to Others?</label>
                <input
                  type="range"
                  className="form-range w-100 text-black"
                  min="0"
                  max="2"
                  step="1"
                  value={[
                    "Not Recommended",
                    "Maybe Recommended",
                    "Definitely Recommended",
                  ].indexOf(formData.recommendation || "0")} // Set the slider value based on the state
                  onChange={handleChange3}
                  id="customRange1"
                />
                <div className="d-flex new-bar justify-content-between mt-2">
                  {[
                    "Not Recommended",
                    "Maybe Recommended",
                    "Definitely Recommended",
                  ].map((label, index) => (
                    <span
                      key={index}
                      className={
                        formData.recommendation === label ? "fw-bold" : ""
                      }
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emotion Range */}
              <div className="flex w-100 mt-4">
                <label>What’s your emotion with the car?</label>
                <input
                  type="range"
                  className="form-range w-100"
                  min="0"
                  max="4"
                  step="1"
                  value={[
                    "Very Bad",
                    "Bad",
                    "Neutral",
                    "Good",
                    "Very Good",
                  ].indexOf(formData.emotionWithCar || "0")} // Set the slider value based on the state
                  onChange={handleChange4}
                  id="customRange1"
                />
                <div className="d-flex new-bar justify-content-between">
                  {["Very Bad", "Bad", "Neutral", "Good", "Very Good"].map(
                    (label, index) => (
                      <span
                        key={index}
                        className={
                          formData.emotionWithCar === label ? "fw-bold" : ""
                        }
                      >
                        {label}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>

            <div className="cars-details mt-3">DEALERSHIP SALES EXPERIENCE</div>

            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-50 text-black">
                <label>Name of the Dealership?</label>
                <input
                  type="text "
                  name="nameOfDelership"
                  value={formData.nameOfDelership}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review text-black"
                  placeholder="Enter Dealership Name"
                />
              </div>

              <div className="form-group w-50 text-black">
                <label>City & Area?</label>
                <input
                  type="text"
                  name="cityAndArea"
                  value={formData.cityAndArea}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review text-black"
                  placeholder="Enter City & Area"
                />
              </div>
            </div>

            <div className="w-100 selectbard">
              <div className="flex w-100 mt-2 text-black">
                <label>What’s your emotion with the car?</label>

                <input
                  type="range"
                  className="form-range w-100 text-black"
                  min="0"
                  max="4"
                  step="1"
                  value={formData.whatsYourEmotion}
                  onChange={handleEmotionChange}
                  id="customRange1"
                />
                <div className="d-flex new-bar justify-content-between text-black">
                  {labels.map((label, index) => (
                    <span
                      key={index}
                      className={
                        formData.whatsYourEmotion == index ? "fw-bold" : ""
                      }
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-100 mb-1 text-black">
                <label>Why did you choose this Dealership?</label>
              </div>
            </div>

            <div className="d-flex gap-3 mt-2">
              <div className="form-group w-100 d-flex flex-column gap-1 text-black">
                {[
                  "Near me",
                  "Better Deal",
                  "Better by Experience",
                  "Recommended By Someone",
                ].map((option, index) => (
                  <div
                    className="form-check d-flex align-items-center text-black"
                    key={index}
                  >
                    <input
                      className="form-check-input text-black"
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
                      className="form-check-label text-black"
                      htmlFor={`dealership-option-${index}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex gap-3 mt-2">
              <div className="form-group w-100 mb-1 text-black">
                <label>Did the Dealership force sell you anything?</label>
              </div>
            </div>

            <div className="d-flex gap-3 mt">
              <div className="form-group w-100 d-flex flex-column gap-1 text-black">
                {[
                  "Space",
                  "Insurance",
                  "Accessories",
                  "Extended Warranty",
                  "Everything",
                  "No Nothing the Dealership was good",
                ].map((option, index) => (
                  <div
                    className="form-check d-flex align-items-center text-black"
                    key={index + 4}
                  >
                    <input
                      className="form-check-input text-black"
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
                      className="form-check-label text-black"
                      htmlFor={`forced-sale-option-${index}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex gap-3 mt-3 text-black">
              <div className="form-group w-100 text-black">
                <div className="brand-model text-black">
                  Would you recommend this dealer for Car buyers?
                </div>
              </div>

              <div className="form-group w-25 d-flex justify-content-end text-black">
                <select
                  className="form-select text-black"
                  aria-label="Default select example"
                  value={formData.recommendationOfDelership} // Bind value to the state
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recommendationOfDelership: e.target.value,
                    })
                  } // Update state on change
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div>
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>

            <div className="cars-details mt-3">SERVICE EXPERIENCE</div>

            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-100">
                <div className="brand-model text-black">
                  Have you Serviced your Car yet?
                </div>
              </div>
              <div className="form-group w-25 d-flex justify-content-end text-black">
                <select
                  className="form-select text-black"
                  aria-label="Default select example"
                  value={formData.haveYouServiced} // Bind to state
                  onChange={(e) => handleHaveYouServicedChange(e)}
                >
                  <option value="">Open this select menu</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="form-group w-100">
              <div className="brand-model text-black">
                Did you get your car serviced at the same Dealership or another?
                If Another, Why?
              </div>
            </div>

            <div className="d-flex gap-3 mt-4 text-black">
              <div className="form-check d-flex align-items-center text-black">
                <input
                  className="form-check-input text-black"
                  type="checkbox"
                  value="Same"
                  id="sameDealership"
                  onChange={handleServiceCheckboxChange}
                  checked={formData.serviceOfcarOnDelership === "Same"}
                  style={{ accentColor: "#B1081A" }}
                />
                <label
                  className="form-check-label text-black"
                  htmlFor="sameDealership"
                >
                  Same
                </label>
              </div>
              <div className="form-check d-flex align-items-center text-black">
                <input
                  className="form-check-input text-black"
                  type="checkbox"
                  value="Another"
                  id="anotherDealership"
                  onChange={handleServiceCheckboxChange}
                  checked={
                    formData.serviceOfcarOnDelership === "Another" ||
                    formData.serviceOfcarOnDelership === formData.dealerName
                  }
                  style={{ accentColor: "#B1081A" }}
                />
                <label
                  className="form-check-label text-black"
                  htmlFor="anotherDealership"
                >
                  Another
                </label>
              </div>
              {formData.serviceOfcarOnDelership === "Another" && (
                <input
                  type="text"
                  name="dealerName"
                  className="custom-input-atrangi owners-review text-black"
                  placeholder="Name of the Dealer"
                  value={formData.dealerName} // Bind the state for dealership name
                  onChange={handleDealerNameChange}
                />
              )}
            </div>

            <div className="d-flex flex-column mt-4 text-black">
              <div className="form-group text-black">
                <label>
                  Anything you want to share about your Dealership service
                  Experience
                </label>
                <input
                  type="text"
                  name="serviceExperience"
                  className="custom-input-atrangi owners-review text-black"
                  placeholder=""
                  value={formData.serviceExperience}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group text-black">
                <label>
                  Any tips for the people who are servicing this Car?
                </label>
                <input
                  type="text"
                  name="tipForpeopleForService"
                  className="custom-input-atrangi owners-review text-black"
                  placeholder=""
                  value={formData.tipForpeopleForService}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex w-100 mt-2 text-black">
              <label>
                Rate the Overall Service Experience (service cost, service
                timeline, transparency, service Advisor)
              </label>
              <input
                type="range"
                className="form-range w-100 text-black"
                min="0"
                max="4"
                step="1"
                value={[
                  "veryBad",
                  "sad",
                  "neutral",
                  "good",
                  "veryGood",
                ].indexOf(formData.serviceOfcarOnDelership)} // Set the value based on the emotion
                onChange={handleEmotionChangeone}
                id="emotionRange"
                style={{ accentColor: "#B1081A" }}
              />
              <div className="d-flex new-bar justify-content-between text-black">
                {["Very Bad", "Bad", "Neutral", "Good", "Very Good"].map(
                  (label, index) => (
                    <span
                      key={index}
                      className={
                        formData.serviceOfcarOnDelership ===
                        ["veryBad", "sad", "neutral", "good", "veryGood"][index]
                          ? "fw-bold"
                          : ""
                      } // Highlight the selected label
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="d-flex flex-column mt-4 ">
              <div className="form-group text-black">
                <label>
                  Approx. Service cost - Our team will connect later asking for
                  invoices to Verify
                </label>
                <textarea
                  name="approxServiceCost"
                  className="custom-input-atrangi owners-review text-black"
                  placeholder=""
                  value={formData.approxServiceCost}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Your Story</label>
                <textarea
                  name="yourStory"
                  className="custom-input-atrangi owners-review text-black"
                  placeholder=""
                  value={formData.yourStory}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* <div>
              <h5>Form Data:</h5>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div> */}
          </div>
        );
      case 999: // Special case when the form is invalid
        return (
          <div
            className="image-container"
            style={{ textAlign: "center" }}
          ></div>
        );
      default:
        return <div>Page {currentPage} Content</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div
        className="popup-content-2 d-flex flex-column"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="left"></div>
        <div class="right"></div>
        <div className="progress progee">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${(currentPage / 8) * 100}%` }}
            aria-valuenow={currentPage}
            aria-valuemin="1"
            aria-valuemax="8"
          ></div>
        </div>
        <button className="close-button" onClick={closePopup}>
          &times;
        </button>

        {renderPageContent()}

        <div
          className={`form-group d-flex mt-3 ${
            currentPage > 1 ? "justify-content-between" : "justify-content-end"
          }`}
        >
          {currentPage !== 999 && (
            <>
              {currentPage > 1 && (
                <button className="next-button" onClick={prevPage}>
                  Previous
                </button>
              )}
              {currentPage < 8 ? (
                <button className="next-button" onClick={nextPage}>
                  Next
                </button>
              ) : (
                <button className="next-button" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
