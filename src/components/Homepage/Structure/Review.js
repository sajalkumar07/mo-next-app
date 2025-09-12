import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import plane from "../../../Images/paper-plane.gif";
import { Link, useParams } from "react-router-dom";

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

  const [formData, setFormData] = useState({
    customerName: "",
    email_id: "",
    whatsAppNumber: "",
    mobileNumber: "",
    pinCode: "",
    profession: "",
    refferedBy: "",
    brand: "",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setFormData((prevState) => ({
          ...prevState,
          brand: data.brand ? data.brand._id : "", // Extract brand name
          product_id: data._id, // Extract product ID
        }));
      } catch (error) {}
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (skipValidation = false) => {
    // Skip validation if skipValidation flag is true
    if (!skipValidation && (!formData.brand || !formData.product_id)) {
      toast.error("Brand and Product ID are required!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
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
          toast.success(
            "The review is submitted! We will notify you when it gets approved.",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000, // Close the toast after 2 seconds
            }
          );

          setTimeout(() => {
            setIsOpen(false);
            window.location.reload(); // Refresh the page
          }, 2000);
        } else if (response.ok) {
          toast.success("The review is submitted successfully!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });

          setTimeout(() => {
            setIsOpen(false);
          }, 1000); // Close the popup after 1 second
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

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false);
    setCurrentPage(1);
    handleSubmit(true);
  };

  const nextPage = () => {
    if (currentPage < 8) setCurrentPage(currentPage + 1); // Move to the next page
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1); // Move to the previous page
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/brands`)
      .then((response) => response.json())
      .then((data) => setBrands(data))
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

  // Content for each page
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div>
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>

            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-50">
                <label>
                  First Name <sup>*</sup>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName.split(" ")[0] || ""} // Display first name part
                  onChange={(e) => {
                    const fullName =
                      `${e.target.value} ${formData.lastName}`.trim(); // Combine with last name
                    setFormData({
                      ...formData,
                      customerName: fullName,
                      customerNameFirstPart: e.target.value, // Track first part (first name)
                    });
                  }}
                  className="custom-input-atrangi owners-review"
                  placeholder="John"
                />
              </div>
              <div className="form-group w-50">
                <label>
                  Last Name <sup>*</sup>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.customerName.split(" ")[1] || ""} // Display last name part
                  onChange={(e) => {
                    const fullName =
                      `${formData.customerNameFirstPart} ${e.target.value}`.trim(); // Combine with first name
                    setFormData({
                      ...formData,
                      customerName: fullName,
                      lastName: e.target.value, // Update last name part
                    });
                  }}
                  className="custom-input-atrangi owners-review"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* <div className="form-group mt-3">
              <label>Email <sup>*</sup></label>
              <input
                type="text"
                name="email_id"
                value={formData.email_id}
                onChange={handleInputChange}
                className="custom-input-atrangi owners-review"
                placeholder="John.doe.1969@gmail.com"
              />
            </div> */}

            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-50">
                <label>
                  Mobile Number <sup>*</sup>
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review"
                  placeholder="+91 88888 88888"
                />
              </div>
              <div className="form-group w-50">
                <label>
                  Email <sup>*</sup>
                </label>
                <input
                  type="text"
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review"
                  placeholder="John.doe.1969@gmail.com"
                />
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-50">
                <label className="mb-122">Whatsapp Number</label>
                <br></br>
                <div className="d-flex">
                  <input
                    type="radio"
                    id="sameAsMobile"
                    name="whatsAppNumberRadio"
                    checked={formData.whatsAppNumber === formData.mobileNumber}
                    onChange={() => handleWhatsAppRadioChange("mobile")}
                  />
                  <span className="gfk">Same as above</span>{" "}
                </div>
                <input
                  type="text"
                  name="whatsAppNumber"
                  value={formData.whatsAppNumber}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review"
                  placeholder="+91 88888 88888"
                  disabled={formData.whatsAppNumber === formData.mobileNumber} // Disable input if WhatsApp is same as mobile
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
                  className="custom-input-atrangi owners-review"
                  placeholder=""
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
                  className="custom-input-atrangi owners-review"
                  placeholder=""
                />
              </div>
              <div className="form-group w-50">
                <label>Referred By</label>
                <input
                  type="text"
                  name="refferedBy"
                  value={formData.refferedBy}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>
            <div className="cars-details mt-3">YOUR CAR DETAILS</div>
            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-50">
                <div className="brand-model">Brand & Model</div>
              </div>
              <div className="form-group d-flex w-50">
                <div className="selectbtn w-50">
                  <select
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

                <div className="form-group d-flex justify-content-center w-50">
                  <select
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
            <div className="d-flex gap-3 mt-2">
              {/* Year Field */}
              <div className="form-group w-50">
                <label htmlFor="year">Year</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="custom-input-atrangi owners-review"
                    id="year"
                    placeholder="2024"
                    value={selectedYear ? selectedYear.getFullYear() : ""}
                    onClick={() => setIsCalendarOpen((prev) => !prev)} // Toggle calendar
                    readOnly // Prevent manual text editing
                    aria-expanded={isCalendarOpen} // Accessibility support
                    aria-label="Select Year"
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="input-icon"
                    onClick={() => setIsCalendarOpen((prev) => !prev)} // Toggle calendar on icon click
                  >
                    <path
                      d="M17 14C17.2652 14 17.5196 13.8946 17.7071 13.7071C17.8946 13.5196 18 13.2652 18 13C18 12.7348 17.8946 12.4804 17.7071 12.2929C17.5196 12.1054 17.2652 12 17 12C16.7348 12 16.4804 12.1054 16.2929 12.2929C16.1054 12.4804 16 12.7348 16 13C16 13.2652 16.1054 13.5196 16.2929 13.7071C16.4804 13.8946 16.7348 14 17 14ZM17 18C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17C18 16.7348 17.8946 16.4804 17.7071 16.2929C17.5196 16.1054 17.2652 16 17 16C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17C16 17.2652 16.1054 17.5196 16.2929 17.7071C16.4804 17.8946 16.7348 18 17 18ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM7 14C7.26522 14 7.51957 13.8946 7.70711 13.7071C7.89464 13.5196 8 13.2652 8 13C8 12.7348 7.89464 12.4804 7.70711 12.2929C7.51957 12.1054 7.26522 12 7 12C6.73478 12 6.48043 12.1054 6.29289 12.2929C6.10536 12.4804 6 12.7348 6 13C6 13.2652 6.10536 13.5196 6.29289 13.7071C6.48043 13.8946 6.73478 14 7 14ZM7 18C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17C8 16.7348 7.89464 16.4804 7.70711 16.2929C7.51957 16.1054 7.26522 16 7 16C6.73478 16 6.48043 16.1054 6.29289 16.2929C6.10536 16.4804 6 16.7348 6 17C6 17.2652 6.10536 17.5196 6.29289 17.7071C6.48043 17.8946 6.73478 18 7 18Z"
                      fill="#040404"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7 1.75C7.19891 1.75 7.38968 1.82902 7.53033 1.96967C7.67098 2.11032 7.75 2.30109 7.75 2.5V3.263C8.412 3.25 9.141 3.25 9.943 3.25H14.056C14.859 3.25 15.588 3.25 16.25 3.263V2.5C16.25 2.30109 16.329 2.11032 16.4697 1.96967C16.6103 1.82902 16.8011 1.75 17 1.75C17.1989 1.75 17.3897 1.82902 17.5303 1.96967C17.671 2.11032 17.75 2.30109 17.75 2.5V3.327C18.01 3.347 18.256 3.372 18.489 3.403C19.661 3.561 20.61 3.893 21.359 4.641C22.107 5.39 22.439 6.339 22.597 7.511C22.75 8.651 22.75 10.106 22.75 11.944V14.056C22.75 15.894 22.75 17.35 22.597 18.489C22.439 19.661 22.107 20.61 21.359 21.359C20.61 22.107 19.661 22.439 18.489 22.597C17.349 22.75 15.894 22.75 14.056 22.75H9.944C8.106 22.75 6.65 22.75 5.511 22.597C4.339 22.439 3.39 22.107 2.641 21.359C1.893 20.61 1.561 19.661 1.403 18.489C1.25 17.349 1.25 15.894 1.25 14.056V11.944C1.25 10.106 1.25 8.65 1.403 7.511C1.561 6.339 1.893 5.39 2.641 4.641C3.39 3.893 4.339 3.561 5.511 3.403C5.744 3.372 5.991 3.347 6.25 3.327V2.5C6.25 2.30109 6.32902 2.11032 6.46967 1.96967C6.61032 1.82902 6.80109 1.75 7 1.75ZM5.71 4.89C4.705 5.025 4.125 5.279 3.702 5.702C3.279 6.125 3.025 6.705 2.89 7.711C2.867 7.881 2.848 8.061 2.832 8.25H21.168C21.152 8.06 21.133 7.881 21.11 7.71C20.975 6.705 20.721 6.125 20.298 5.702C19.875 5.279 19.295 5.025 18.289 4.89C17.262 4.752 15.907 4.75 14 4.75H10C8.093 4.75 6.739 4.752 5.71 4.89ZM2.75 12C2.75 11.146 2.75 10.403 2.763 9.75H21.237C21.25 10.403 21.25 11.146 21.25 12V14C21.25 15.907 21.248 17.262 21.11 18.29C20.975 19.295 20.721 19.875 20.298 20.298C19.875 20.721 19.295 20.975 18.289 21.11C17.262 21.248 15.907 21.25 14 21.25H10C8.093 21.25 6.739 21.248 5.71 21.11C4.705 20.975 4.125 20.721 3.702 20.298C3.279 19.875 3.025 19.295 2.89 18.289C2.752 17.262 2.75 15.907 2.75 14V12Z"
                      fill="#040404"
                    />{" "}
                  </svg>
                </div>
                {isCalendarOpen && (
                  <DatePicker
                    selected={selectedYear}
                    onChange={handleYearChange}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Select Year"
                    onClickOutside={() => setIsCalendarOpen(false)} // Close on outside click
                    inline
                  />
                )}
              </div>

              {/* Car Number Field */}
              <div className="form-group w-50">
                <label htmlFor="carNumber">Car Number</label>
                <input
                  type="text"
                  name="carNumber"
                  id="carNumber"
                  className="custom-input-atrangi owners-review"
                  placeholder="Enter car number"
                  value={formData.carNumber || ""}
                  onChange={handleInputChange} // Sync with form data
                />
              </div>
            </div>
            <div className="d-flex gap-3 mt-2">
              <div className="brand-model">What Kind Of Car?</div>
            </div>
            <div className="d-flex gap-3 mt-3 justify-content-around">
              {/* Brand New */}
              <div
                className={`form-group w-25 justify-content-center d-flex carbtuon ${
                  formData.kindOfCar === "Brand New" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, kindOfCar: "Brand New" })
                }
              >
                BRAND NEW
              </div>

              {/* Used Car */}
              <div
                className={`form-group w-25 justify-content-center d-flex carbtuon ${
                  formData.kindOfCar === "USED CAR" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData({ ...formData, kindOfCar: "USED CAR" })
                }
              >
                USED CAR
              </div>
            </div>
            <div className="d-flex gap-3 mt-2">
              <div className="brand-model">
                Upload an Image of Yours with your Car
              </div>
            </div>
            <div className="d-flex mt-2">
              <div className="uploaded-images">
                {imageOfCar && (
                  <div className="image-preview">
                    <img
                      src={URL.createObjectURL(imageOfCar)} // Preview the selected image
                      alt="uploaded-img"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => setImageOfCar(null)} // Reset the image when the remove button is clicked
                      className="remove-btn"
                    >
                      x
                    </button>
                  </div>
                )}
              </div>

              <div className="uploard-area d-flex align-items-center justify-content-center">
                <label htmlFor="imageUpload" className="upload-label">
                  <span>Upload Images here</span>
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUploadone}
                  style={{ display: "none" }} // Hide the default file input
                />
              </div>
            </div>
            <div className="d-flex gap-3 mt-2">
              <div className="brand-model">Approximate kilometers driven?</div>
            </div>
            <div className="d-flex gap-3 mt-2">
              <input
                type="text"
                name="approxKMdriven"
                className="custom-input-atrangi owners-review"
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
                    className={`form-group w-25 justify-content-center d-flex carbtuon ${
                      selectedyesTypeone === "yes" ? "active" : ""
                    }`}
                    onClick={() => handleyesTypeSelectone("yes")}
                  >
                    YES
                  </div>
                  <div
                    className={`form-group w-25 justify-content-center d-flex carbtuon ${
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
              <div className="d-flex gap-3 mt-2">
                <input
                  type="text"
                  className="custom-input-atrangi owners-review"
                  placeholder="Please Specify"
                  value={formData.modificationOfVehicle} // Bind to formData
                  onChange={handleInputChange} // Handle input change
                />
              </div>
            )}

            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-50">
                <div className="brand-model">Majorly Driven on?</div>
              </div>
              <div className="form-group w-50 d-flex justify-content-end">
                <select
                  className="form-select"
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
              <div className="form-group w-50 d-flex justify-content-end">
                <select
                  className="form-select"
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
              <div className="form-group w-100">
                <label>Why this Car?</label>
                <input
                  type="text"
                  name="whyThisCar" // Bind to state key
                  value={formData.whyThisCar} // Set value from state
                  onChange={handleInputChange} // Handle changes
                  className="custom-input-atrangi owners-review mt-3"
                />
              </div>
            </div>

            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-100">
                <label>Key reasons to consider this v/s Competetion?</label>
              </div>
            </div>
            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-50 d-flex flex-column gap-1">
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
                      className="form-check-input colornf"
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

              <div className="form-group w-50 d-flex flex-column gap-1">
                {[
                  "Boot Space",
                  "Resale",
                  "Technology",
                  "Design",
                  "Emotional Connect",
                  "Others",
                ].map((reason, index) => (
                  <div
                    className="form-check d-flex align-items-center"
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
                      className="form-check-label"
                      htmlFor={`reason-${index + 6}`}
                    >
                      {reason}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className='d-flex gap-3 mt-4'>
              <div className="form-group w-100">
                <label>Three Vehicles shortlisted before purchasing this.</label>
              </div>
            </div>
            <section className="d-flex w-100 gap-3">
              <div className="w-40">
                <input
                  type="text"
                  name="fname"
                  className="custom-input-atrangi owners-review"
                  placeholder="Select Car"
                />
                <input
                  type="text"
                  name="fname"
                  className="custom-input-atrangi owners-review mt-2"
                  placeholder="Select Car"
                />
                <input
                  type="text"
                  name="fname"
                  className="custom-input-atrangi owners-review mt-2"
                  placeholder="Select Car"
                />
              </div>
              <div className="w-60 selectbard">
                <div className="flex w-100">
                  <input
                    type="range"
                    className="form-range w-100"
                    min="0"
                    max="4"
                    step="1"
                    value={value}
                    onChange={handleChange}
                    id="customRange1"
                  />
                  <div className="d-flex justify-content-between">
                    {labels.map((label, index) => (
                      <span key={index} className={value === index ? 'fw-bold' : ''}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex mt-2 w-100">
                  <input
                    type="range"
                    className="form-range w-100"
                    min="0"
                    max="4"
                    step="1"
                    value={value1}
                    onChange={handleChange1}
                    id="customRange1"
                  />
                  <div className="d-flex justify-content-between">
                    {labels.map((label, index) => (
                      <span key={index} className={value1 === index ? 'fw-bold' : ''}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex mt-2 w-100">
                  <input
                    type="range"
                    className="form-range w-100"
                    min="0"
                    max="4"
                    step="1"
                    value={value2}
                    onChange={handleChange2}
                    id="customRange1"
                  />
                  <div className="d-flex justify-content-between">
                    {labels.map((label, index) => (
                      <span key={index} className={value2 === index ? 'fw-bold' : ''}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </section> */}
          </div>
        );
      case 5:
        return (
          <div>
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>

            <div className="cars-details mt-3">MY EXPERIENCE</div>
            <div className="d-flex gap-3 mt-4">
              <div className="form-group w-100">
                <label>
                  One or more features that you learnt after Purchasing this
                  Car?
                </label>
                <input
                  type="text"
                  name="featuresLearntAfterPurchaseing"
                  className="custom-input-atrangi owners-review mt-3"
                  placeholder="Enter the features"
                  value={formData.featuresLearntAfterPurchaseing}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-100 mb-1">
                <label>Things Lack in this Car?</label>
              </div>
            </div>
            <div className="d-flex gap-3 mt">
              <div className="form-group w-50 d-flex flex-column gap-1">
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
                    className="form-check d-flex align-items-center"
                    key={value}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={value}
                      id={value}
                      checked={formData.thingsLackinThisCar
                        .split(", ")
                        .includes(value)} // Ensure checkbox reflects state
                      onChange={handleLackInThisCarChange}
                      style={{ accentColor: "#B1081A" }}
                    />
                    <label className="form-check-label" htmlFor={value}>
                      {value}
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-group w-50 d-flex flex-column gap-1">
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
                    className="form-check d-flex align-items-center"
                    key={value}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={value}
                      id={value}
                      checked={formData.thingsLackinThisCar
                        .split(", ")
                        .includes(value)} // Ensure checkbox reflects state
                      onChange={handleLackInThisCarChange}
                      style={{ accentColor: "#B1081A" }}
                    />
                    <label className="form-check-label" htmlFor={value}>
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
            <div className="owners-review-hed">
              OWNER’S <span>REVIEW</span>
            </div>
            <div className="cars-details mt-3">MY EXPERIENCE</div>
            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-100 mb-1">
                <label>Issues with the Car?</label>
              </div>
            </div>
            <div className="d-flex gap-3 mt-1">
              <div className="form-group w-50 d-flex flex-column gap-1">
                {["Service Center", "Electronic", "Mechanicals"].map(
                  (issue, index) => (
                    <div
                      className="form-check d-flex align-items-center"
                      key={index}
                    >
                      <input
                        className="form-check-input"
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
                        className="form-check-label"
                        htmlFor={`issue-${index}`}
                      >
                        {issue}
                      </label>
                    </div>
                  )
                )}
              </div>

              <div className="form-group w-50 d-flex flex-column gap-1">
                {["Defects", "Malfunctions", "None"].map((issue, index) => (
                  <div
                    className="form-check d-flex align-items-center"
                    key={index + 3}
                  >
                    <input
                      className="form-check-input"
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
                      className="form-check-label"
                      htmlFor={`issue-${index + 3}`}
                    >
                      {issue}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-100 selectbard">
              {/* Recommendation Range */}
              <div className="flex w-100">
                <label>Would You recommend this Car to Others?</label>
                <input
                  type="range"
                  className="form-range w-100"
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
              <div className="form-group w-50">
                <label>Name of the Dealership?</label>
                <input
                  type="text"
                  name="nameOfDelership"
                  value={formData.nameOfDelership}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review"
                  placeholder="Enter Dealership Name"
                />
              </div>

              <div className="form-group w-50">
                <label>City & Area?</label>
                <input
                  type="text"
                  name="cityAndArea"
                  value={formData.cityAndArea}
                  onChange={handleInputChange}
                  className="custom-input-atrangi owners-review"
                  placeholder="Enter City & Area"
                />
              </div>
            </div>

            <div className="w-100 selectbard">
              <div className="flex w-100 mt-2">
                <label>What’s your emotion with the car?</label>

                <input
                  type="range"
                  className="form-range w-100"
                  min="0"
                  max="4"
                  step="1"
                  value={formData.whatsYourEmotion}
                  onChange={handleEmotionChange}
                  id="customRange1"
                />
                <div className="d-flex new-bar justify-content-between">
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
              <div className="form-group w-100 mb-1">
                <label>Why did you choose this Dealership?</label>
              </div>
            </div>

            <div className="d-flex gap-3 mt-2">
              <div className="form-group w-100 d-flex flex-column gap-1">
                {[
                  "Near me",
                  "Better Deal",
                  "Better by Experience",
                  "Recommended By Someone",
                ].map((option, index) => (
                  <div
                    className="form-check d-flex align-items-center"
                    key={index}
                  >
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
                      className="form-check-label"
                      htmlFor={`dealership-option-${index}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex gap-3 mt-2">
              <div className="form-group w-100 mb-1">
                <label>Did the Dealership force sell you anything?</label>
              </div>
            </div>

            <div className="d-flex gap-3 mt">
              <div className="form-group w-100 d-flex flex-column gap-1">
                {[
                  "Space",
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
                      className="form-check-input"
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
                      className="form-check-label"
                      htmlFor={`forced-sale-option-${index}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <div className="form-group w-100">
                <div className="brand-model">
                  Would you recommend this dealer for Car buyers?
                </div>
              </div>

              <div className="form-group w-25 d-flex justify-content-end">
                <select
                  className="form-select"
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
                <div className="brand-model">
                  Have you Serviced your Car yet?
                </div>
              </div>
              <div className="form-group w-25 d-flex justify-content-end">
                <select
                  className="form-select"
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
              <div className="brand-model">
                Did you get your car serviced at the same Dealership or another?
                If Another, Why?
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <div className="form-check d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Same"
                  id="sameDealership"
                  onChange={handleServiceCheckboxChange}
                  checked={formData.serviceOfcarOnDelership === "Same"}
                  style={{ accentColor: "#B1081A" }}
                />
                <label className="form-check-label" htmlFor="sameDealership">
                  Same
                </label>
              </div>
              <div className="form-check d-flex align-items-center">
                <input
                  className="form-check-input"
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
                <label className="form-check-label" htmlFor="anotherDealership">
                  Another
                </label>
              </div>
              {formData.serviceOfcarOnDelership === "Another" && (
                <input
                  type="text"
                  name="dealerName"
                  className="custom-input-atrangi owners-review"
                  placeholder="Name of the Dealer"
                  value={formData.dealerName} // Bind the state for dealership name
                  onChange={handleDealerNameChange}
                />
              )}
            </div>

            <div className="d-flex flex-column mt-4">
              <div className="form-group">
                <label>
                  Anything you want to share about your Dealership service
                  Experience
                </label>
                <input
                  type="text"
                  name="serviceExperience"
                  className="custom-input-atrangi owners-review"
                  placeholder=""
                  value={formData.serviceExperience}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>
                  Any tips for the people who are servicing this Car?
                </label>
                <input
                  type="text"
                  name="tipForpeopleForService"
                  className="custom-input-atrangi owners-review"
                  placeholder=""
                  value={formData.tipForpeopleForService}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex w-100 mt-2">
              <label>
                Rate the Overall Service Experience (service cost, service
                timeline, transparency, service Advisor)
              </label>
              <input
                type="range"
                className="form-range w-100"
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
              <div className="d-flex new-bar justify-content-between">
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

            <div className="d-flex flex-column mt-4">
              <div className="form-group">
                <label>
                  Approx. Service cost - Our team will connect later asking for
                  invoices to Verify
                </label>
                <textarea
                  name="approxServiceCost"
                  className="custom-input-atrangi owners-review"
                  placeholder=""
                  value={formData.approxServiceCost}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Your Story</label>
                <textarea
                  name="yourStory"
                  className="custom-input-atrangi owners-review"
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
          <div className="image-container" style={{ textAlign: "center" }}>
            <img
              src={plane}
              alt="Image"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        );
      default:
        return <div>Page {currentPage} Content</div>;
    }
  };

  const renderPageContentMob = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <div>
              <div className="owners-review-hed">
                <svg
                  width="346"
                  height="65"
                  viewBox="0 0 346 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M47.2516 15H37.7116C36.9782 15 36.3449 14.74 35.8116 14.22C35.2916 13.6867 35.0316 13.0533 35.0316 12.32V3.68C35.0316 2.94667 35.2916 2.32 35.8116 1.8C36.3449 1.26667 36.9782 0.999999 37.7116 0.999999H47.2516C47.9849 0.999999 48.6116 1.26667 49.1316 1.8C49.6649 2.32 49.9316 2.94667 49.9316 3.68V12.32C49.9316 13.0533 49.6649 13.6867 49.1316 14.22C48.6116 14.74 47.9849 15 47.2516 15ZM45.6116 11.88C45.7716 11.88 45.9116 11.82 46.0316 11.7C46.1516 11.58 46.2116 11.44 46.2116 11.28V4.72C46.2116 4.56 46.1516 4.42 46.0316 4.3C45.9116 4.18 45.7716 4.12 45.6116 4.12H39.3516C39.1916 4.12 39.0516 4.18 38.9316 4.3C38.8116 4.42 38.7516 4.56 38.7516 4.72V11.28C38.7516 11.44 38.8116 11.58 38.9316 11.7C39.0516 11.82 39.1916 11.88 39.3516 11.88H45.6116ZM69.7525 15H65.5725L62.7525 6.76L59.9125 15H55.7525L50.8325 0.999999H54.7725L57.8125 9.64L60.7725 0.999999H64.7125L67.6925 9.64L70.7125 0.999999H74.6525L69.7525 15ZM90.5898 15H86.8698L79.4098 6.3V15H75.6898V0.999999H79.4098L86.8698 9.7V0.999999H90.5898V15ZM105.185 15H95.3451C94.6118 15 93.9785 14.74 93.4451 14.22C92.9251 13.6867 92.6651 13.0533 92.6651 12.32V3.68C92.6651 2.94667 92.9251 2.32 93.4451 1.8C93.9785 1.26667 94.6118 0.999999 95.3451 0.999999H105.185V4.12H96.9851C96.8251 4.12 96.6851 4.18 96.5651 4.3C96.4451 4.42 96.3851 4.56 96.3851 4.72V6.44H103.985V9.56H96.3851V11.28C96.3851 11.44 96.4451 11.58 96.5651 11.7C96.6851 11.82 96.8251 11.88 96.9851 11.88H105.185V15ZM121.87 15H117.39L112.63 10.02H110.69V15H106.97V0.999999H118.59C119.324 0.999999 119.95 1.26667 120.47 1.8C121.004 2.32 121.27 2.94667 121.27 3.68V7.32C121.27 8.06667 121.004 8.70667 120.47 9.24C119.95 9.76 119.324 10.02 118.59 10.02H117.09L121.87 15ZM116.95 6.88C117.11 6.88 117.25 6.82667 117.37 6.72C117.49 6.6 117.55 6.45333 117.55 6.28V4.72C117.55 4.56 117.49 4.42 117.37 4.3C117.25 4.18 117.11 4.12 116.95 4.12H110.69V6.88H116.95ZM125.143 6.52H122.763L124.083 3.98H122.763V0.999999H126.643V3.38L125.143 6.52ZM138.671 15H128.091V11.88H137.031C137.205 11.88 137.345 11.82 137.451 11.7C137.571 11.58 137.631 11.44 137.631 11.28V10.16C137.631 10 137.571 9.86 137.451 9.74C137.345 9.62 137.205 9.56 137.031 9.56H130.631C129.898 9.56 129.265 9.3 128.731 8.78C128.211 8.26 127.951 7.62667 127.951 6.88V3.68C127.951 2.94667 128.211 2.32 128.731 1.8C129.265 1.26667 129.898 0.999999 130.631 0.999999H141.051V4.12H132.271C132.111 4.12 131.971 4.18 131.851 4.3C131.731 4.42 131.671 4.56 131.671 4.72V5.84C131.671 6 131.731 6.14 131.851 6.26C131.971 6.38 132.111 6.44 132.271 6.44H138.671C139.418 6.44 140.051 6.7 140.571 7.22C141.091 7.74 141.351 8.37333 141.351 9.12V12.32C141.351 13.0533 141.091 13.6867 140.571 14.22C140.051 14.74 139.418 15 138.671 15ZM164.841 15H160.361L155.601 10.02H153.661V15H149.941V0.999999H161.561C162.295 0.999999 162.921 1.26667 163.441 1.8C163.975 2.32 164.241 2.94667 164.241 3.68V7.32C164.241 8.06667 163.975 8.70667 163.441 9.24C162.921 9.76 162.295 10.02 161.561 10.02H160.061L164.841 15ZM159.921 6.88C160.081 6.88 160.221 6.82667 160.341 6.72C160.461 6.6 160.521 6.45333 160.521 6.28V4.72C160.521 4.56 160.461 4.42 160.341 4.3C160.221 4.18 160.081 4.12 159.921 4.12H153.661V6.88H159.921ZM178.714 15H168.874C168.141 15 167.507 14.74 166.974 14.22C166.454 13.6867 166.194 13.0533 166.194 12.32V3.68C166.194 2.94667 166.454 2.32 166.974 1.8C167.507 1.26667 168.141 0.999999 168.874 0.999999H178.714V4.12H170.514C170.354 4.12 170.214 4.18 170.094 4.3C169.974 4.42 169.914 4.56 169.914 4.72V6.44H177.514V9.56H169.914V11.28C169.914 11.44 169.974 11.58 170.094 11.7C170.214 11.82 170.354 11.88 170.514 11.88H178.714V15ZM189.819 15H185.339L179.239 0.999999H183.259L187.579 10.9L191.899 0.999999H195.919L189.819 15ZM200.592 15H196.872V0.999999H200.592V15ZM215.215 15H205.375C204.642 15 204.008 14.74 203.475 14.22C202.955 13.6867 202.695 13.0533 202.695 12.32V3.68C202.695 2.94667 202.955 2.32 203.475 1.8C204.008 1.26667 204.642 0.999999 205.375 0.999999H215.215V4.12H207.015C206.855 4.12 206.715 4.18 206.595 4.3C206.475 4.42 206.415 4.56 206.415 4.72V6.44H214.015V9.56H206.415V11.28C206.415 11.44 206.475 11.58 206.595 11.7C206.715 11.82 206.855 11.88 207.015 11.88H215.215V15ZM234.74 15H230.56L227.74 6.76L224.9 15H220.74L215.82 0.999999H219.76L222.8 9.64L225.76 0.999999H229.7L232.68 9.64L235.7 0.999999H239.64L234.74 15Z"
                    fill="#828282"
                  />
                  <path
                    d="M251.063 15H247.343V0.999999H259.863V4.12H251.063V6.44H258.663V9.56H251.063V15ZM273.316 15H263.776C263.042 15 262.409 14.74 261.876 14.22C261.356 13.6867 261.096 13.0533 261.096 12.32V3.68C261.096 2.94667 261.356 2.32 261.876 1.8C262.409 1.26667 263.042 0.999999 263.776 0.999999H273.316C274.049 0.999999 274.676 1.26667 275.196 1.8C275.729 2.32 275.996 2.94667 275.996 3.68V12.32C275.996 13.0533 275.729 13.6867 275.196 14.22C274.676 14.74 274.049 15 273.316 15ZM271.676 11.88C271.836 11.88 271.976 11.82 272.096 11.7C272.216 11.58 272.276 11.44 272.276 11.28V4.72C272.276 4.56 272.216 4.42 272.096 4.3C271.976 4.18 271.836 4.12 271.676 4.12H265.416C265.256 4.12 265.116 4.18 264.996 4.3C264.876 4.42 264.816 4.56 264.816 4.72V11.28C264.816 11.44 264.876 11.58 264.996 11.7C265.116 11.82 265.256 11.88 265.416 11.88H271.676ZM292.977 15H288.497L283.737 10.02H281.797V15H278.077V0.999999H289.697C290.43 0.999999 291.057 1.26667 291.577 1.8C292.11 2.32 292.377 2.94667 292.377 3.68V7.32C292.377 8.06667 292.11 8.70667 291.577 9.24C291.057 9.76 290.43 10.02 289.697 10.02H288.197L292.977 15ZM288.057 6.88C288.217 6.88 288.357 6.82667 288.477 6.72C288.597 6.6 288.657 6.45333 288.657 6.28V4.72C288.657 4.56 288.597 4.42 288.477 4.3C288.357 4.18 288.217 4.12 288.057 4.12H281.797V6.88H288.057ZM310.829 15H307.109V6.42L303.989 10.98H301.309L298.169 6.42V15H294.449V0.999999H298.329L302.649 7.28L306.969 0.999999H310.829V15Z"
                    fill="#AB373A"
                  />
                  <path
                    d="M32.0745 47V39.644H29.1945V38.6H36.1425V39.644H33.2625V47H32.0745ZM40.6775 40.58C41.1975 40.58 41.6535 40.68 42.0455 40.88C42.4455 41.08 42.7575 41.384 42.9815 41.792C43.2055 42.2 43.3175 42.716 43.3175 43.34V47H42.1655V43.472C42.1655 42.856 42.0135 42.392 41.7095 42.08C41.4135 41.768 40.9935 41.612 40.4495 41.612C40.0415 41.612 39.6855 41.692 39.3815 41.852C39.0775 42.012 38.8415 42.248 38.6735 42.56C38.5135 42.872 38.4335 43.26 38.4335 43.724V47H37.2815V38.096H38.4335V42.356L38.2055 41.9C38.4135 41.484 38.7335 41.16 39.1655 40.928C39.5975 40.696 40.1015 40.58 40.6775 40.58ZM45.4494 47V40.64H46.6014V47H45.4494ZM46.0254 39.416C45.8014 39.416 45.6134 39.344 45.4614 39.2C45.3174 39.056 45.2454 38.88 45.2454 38.672C45.2454 38.456 45.3174 38.276 45.4614 38.132C45.6134 37.988 45.8014 37.916 46.0254 37.916C46.2494 37.916 46.4334 37.988 46.5774 38.132C46.7294 38.268 46.8054 38.44 46.8054 38.648C46.8054 38.864 46.7334 39.048 46.5894 39.2C46.4454 39.344 46.2574 39.416 46.0254 39.416ZM50.625 47.072C50.097 47.072 49.593 47 49.113 46.856C48.641 46.712 48.269 46.536 47.997 46.328L48.477 45.416C48.749 45.6 49.085 45.756 49.485 45.884C49.885 46.012 50.293 46.076 50.709 46.076C51.245 46.076 51.629 46 51.861 45.848C52.101 45.696 52.221 45.484 52.221 45.212C52.221 45.012 52.149 44.856 52.005 44.744C51.861 44.632 51.669 44.548 51.429 44.492C51.197 44.436 50.937 44.388 50.649 44.348C50.361 44.3 50.073 44.244 49.785 44.18C49.497 44.108 49.233 44.012 48.993 43.892C48.753 43.764 48.561 43.592 48.417 43.376C48.273 43.152 48.201 42.856 48.201 42.488C48.201 42.104 48.309 41.768 48.525 41.48C48.741 41.192 49.045 40.972 49.437 40.82C49.837 40.66 50.309 40.58 50.853 40.58C51.269 40.58 51.689 40.632 52.113 40.736C52.545 40.832 52.897 40.972 53.169 41.156L52.677 42.068C52.389 41.876 52.089 41.744 51.777 41.672C51.465 41.6 51.153 41.564 50.841 41.564C50.337 41.564 49.961 41.648 49.713 41.816C49.465 41.976 49.341 42.184 49.341 42.44C49.341 42.656 49.413 42.824 49.557 42.944C49.709 43.056 49.901 43.144 50.133 43.208C50.373 43.272 50.637 43.328 50.925 43.376C51.213 43.416 51.501 43.472 51.789 43.544C52.077 43.608 52.337 43.7 52.569 43.82C52.809 43.94 53.001 44.108 53.145 44.324C53.297 44.54 53.373 44.828 53.373 45.188C53.373 45.572 53.261 45.904 53.037 46.184C52.813 46.464 52.497 46.684 52.089 46.844C51.681 46.996 51.193 47.072 50.625 47.072ZM58.2034 47V40.076C58.2034 39.452 58.3834 38.956 58.7434 38.588C59.1114 38.212 59.6314 38.024 60.3034 38.024C60.5514 38.024 60.7874 38.056 61.0114 38.12C61.2434 38.176 61.4394 38.268 61.5994 38.396L61.2514 39.272C61.1314 39.176 60.9954 39.104 60.8434 39.056C60.6914 39 60.5314 38.972 60.3634 38.972C60.0274 38.972 59.7714 39.068 59.5954 39.26C59.4194 39.444 59.3314 39.72 59.3314 40.088V40.94L59.3554 41.468V47H58.2034ZM57.1234 41.588V40.64H61.1794V41.588H57.1234ZM64.8961 47.072C64.2561 47.072 63.6881 46.932 63.1921 46.652C62.6961 46.372 62.3041 45.988 62.0161 45.5C61.7281 45.004 61.5841 44.444 61.5841 43.82C61.5841 43.188 61.7281 42.628 62.0161 42.14C62.3041 41.652 62.6961 41.272 63.1921 41C63.6881 40.72 64.2561 40.58 64.8961 40.58C65.5281 40.58 66.0921 40.72 66.5881 41C67.0921 41.272 67.4841 41.652 67.7641 42.14C68.0521 42.62 68.1961 43.18 68.1961 43.82C68.1961 44.452 68.0521 45.012 67.7641 45.5C67.4841 45.988 67.0921 46.372 66.5881 46.652C66.0921 46.932 65.5281 47.072 64.8961 47.072ZM64.8961 46.064C65.3041 46.064 65.6681 45.972 65.9881 45.788C66.3161 45.604 66.5721 45.344 66.7561 45.008C66.9401 44.664 67.0321 44.268 67.0321 43.82C67.0321 43.364 66.9401 42.972 66.7561 42.644C66.5721 42.308 66.3161 42.048 65.9881 41.864C65.6681 41.68 65.3041 41.588 64.8961 41.588C64.4881 41.588 64.1241 41.68 63.8041 41.864C63.4841 42.048 63.2281 42.308 63.0361 42.644C62.8441 42.972 62.7481 43.364 62.7481 43.82C62.7481 44.268 62.8441 44.664 63.0361 45.008C63.2281 45.344 63.4841 45.604 63.8041 45.788C64.1241 45.972 64.4881 46.064 64.8961 46.064ZM69.7893 47V40.64H70.8933V42.368L70.7853 41.936C70.9613 41.496 71.2573 41.16 71.6733 40.928C72.0893 40.696 72.6013 40.58 73.2093 40.58V41.696C73.1613 41.688 73.1133 41.684 73.0653 41.684C73.0253 41.684 72.9853 41.684 72.9453 41.684C72.3293 41.684 71.8413 41.868 71.4813 42.236C71.1213 42.604 70.9413 43.136 70.9413 43.832V47H69.7893ZM82.5851 40.58C83.0971 40.58 83.5491 40.68 83.9411 40.88C84.3331 41.08 84.6371 41.384 84.8531 41.792C85.0771 42.2 85.1891 42.716 85.1891 43.34V47H84.0371V43.472C84.0371 42.856 83.8931 42.392 83.6051 42.08C83.3171 41.768 82.9131 41.612 82.3931 41.612C82.0091 41.612 81.6731 41.692 81.3851 41.852C81.0971 42.012 80.8731 42.248 80.7131 42.56C80.5611 42.872 80.4851 43.26 80.4851 43.724V47H79.3331V43.472C79.3331 42.856 79.1891 42.392 78.9011 42.08C78.6211 41.768 78.2171 41.612 77.6891 41.612C77.3131 41.612 76.9811 41.692 76.6931 41.852C76.4051 42.012 76.1811 42.248 76.0211 42.56C75.8611 42.872 75.7811 43.26 75.7811 43.724V47H74.6291V40.64H75.7331V42.332L75.5531 41.9C75.7531 41.484 76.0611 41.16 76.4771 40.928C76.8931 40.696 77.3771 40.58 77.9291 40.58C78.5371 40.58 79.0611 40.732 79.5011 41.036C79.9411 41.332 80.2291 41.784 80.3651 42.392L79.8971 42.2C80.0891 41.712 80.4251 41.32 80.9051 41.024C81.3851 40.728 81.9451 40.58 82.5851 40.58ZM91.8755 47L89.5115 40.64H90.6035L92.7035 46.4H92.1875L94.3715 40.64H95.3435L97.4795 46.4H96.9755L99.1235 40.64H100.155L97.7795 47H96.6755L94.6715 41.744H95.0075L92.9795 47H91.8755ZM101.324 47V40.64H102.476V47H101.324ZM101.9 39.416C101.676 39.416 101.488 39.344 101.336 39.2C101.192 39.056 101.12 38.88 101.12 38.672C101.12 38.456 101.192 38.276 101.336 38.132C101.488 37.988 101.676 37.916 101.9 37.916C102.124 37.916 102.308 37.988 102.452 38.132C102.604 38.268 102.68 38.44 102.68 38.648C102.68 38.864 102.608 39.048 102.464 39.2C102.32 39.344 102.132 39.416 101.9 39.416ZM104.676 47V38.096H105.828V47H104.676ZM108.028 47V38.096H109.18V47H108.028ZM122.558 40.58C123.07 40.58 123.522 40.68 123.914 40.88C124.306 41.08 124.61 41.384 124.826 41.792C125.05 42.2 125.162 42.716 125.162 43.34V47H124.01V43.472C124.01 42.856 123.866 42.392 123.578 42.08C123.29 41.768 122.886 41.612 122.366 41.612C121.982 41.612 121.646 41.692 121.358 41.852C121.07 42.012 120.846 42.248 120.686 42.56C120.534 42.872 120.458 43.26 120.458 43.724V47H119.306V43.472C119.306 42.856 119.162 42.392 118.874 42.08C118.594 41.768 118.19 41.612 117.662 41.612C117.286 41.612 116.954 41.692 116.666 41.852C116.378 42.012 116.154 42.248 115.994 42.56C115.834 42.872 115.754 43.26 115.754 43.724V47H114.602V40.64H115.706V42.332L115.526 41.9C115.726 41.484 116.034 41.16 116.45 40.928C116.866 40.696 117.35 40.58 117.902 40.58C118.51 40.58 119.034 40.732 119.474 41.036C119.914 41.332 120.202 41.784 120.338 42.392L119.87 42.2C120.062 41.712 120.398 41.32 120.878 41.024C121.358 40.728 121.918 40.58 122.558 40.58ZM131.229 47V45.656L131.169 45.404V43.112C131.169 42.624 131.025 42.248 130.737 41.984C130.457 41.712 130.033 41.576 129.465 41.576C129.089 41.576 128.721 41.64 128.361 41.768C128.001 41.888 127.697 42.052 127.449 42.26L126.969 41.396C127.297 41.132 127.689 40.932 128.145 40.796C128.609 40.652 129.093 40.58 129.597 40.58C130.469 40.58 131.141 40.792 131.613 41.216C132.085 41.64 132.321 42.288 132.321 43.16V47H131.229ZM129.141 47.072C128.669 47.072 128.253 46.992 127.893 46.832C127.541 46.672 127.269 46.452 127.077 46.172C126.885 45.884 126.789 45.56 126.789 45.2C126.789 44.856 126.869 44.544 127.029 44.264C127.197 43.984 127.465 43.76 127.833 43.592C128.209 43.424 128.713 43.34 129.345 43.34H131.361V44.168H129.393C128.817 44.168 128.429 44.264 128.229 44.456C128.029 44.648 127.929 44.88 127.929 45.152C127.929 45.464 128.053 45.716 128.301 45.908C128.549 46.092 128.893 46.184 129.333 46.184C129.765 46.184 130.141 46.088 130.461 45.896C130.789 45.704 131.025 45.424 131.169 45.056L131.397 45.848C131.245 46.224 130.977 46.524 130.593 46.748C130.209 46.964 129.725 47.072 129.141 47.072ZM135.389 45.464L135.413 43.988L139.073 40.64H140.465L137.657 43.4L137.033 43.928L135.389 45.464ZM134.453 47V38.096H135.605V47H134.453ZM139.313 47L136.817 43.904L137.561 42.98L140.729 47H139.313ZM144.422 47.072C143.742 47.072 143.142 46.932 142.622 46.652C142.11 46.372 141.71 45.988 141.422 45.5C141.142 45.012 141.002 44.452 141.002 43.82C141.002 43.188 141.138 42.628 141.41 42.14C141.69 41.652 142.07 41.272 142.55 41C143.038 40.72 143.586 40.58 144.194 40.58C144.81 40.58 145.354 40.716 145.826 40.988C146.298 41.26 146.666 41.644 146.93 42.14C147.202 42.628 147.338 43.2 147.338 43.856C147.338 43.904 147.334 43.96 147.326 44.024C147.326 44.088 147.322 44.148 147.314 44.204H141.902V43.376H146.714L146.246 43.664C146.254 43.256 146.17 42.892 145.994 42.572C145.818 42.252 145.574 42.004 145.262 41.828C144.958 41.644 144.602 41.552 144.194 41.552C143.794 41.552 143.438 41.644 143.126 41.828C142.814 42.004 142.57 42.256 142.394 42.584C142.218 42.904 142.13 43.272 142.13 43.688V43.88C142.13 44.304 142.226 44.684 142.418 45.02C142.618 45.348 142.894 45.604 143.246 45.788C143.598 45.972 144.002 46.064 144.458 46.064C144.834 46.064 145.174 46 145.478 45.872C145.79 45.744 146.062 45.552 146.294 45.296L146.93 46.04C146.642 46.376 146.282 46.632 145.85 46.808C145.426 46.984 144.95 47.072 144.422 47.072ZM152.16 47V40.64H153.312V47H152.16ZM152.736 39.416C152.512 39.416 152.324 39.344 152.172 39.2C152.028 39.056 151.956 38.88 151.956 38.672C151.956 38.456 152.028 38.276 152.172 38.132C152.324 37.988 152.512 37.916 152.736 37.916C152.96 37.916 153.144 37.988 153.288 38.132C153.44 38.268 153.516 38.44 153.516 38.648C153.516 38.864 153.444 39.048 153.3 39.2C153.156 39.344 152.968 39.416 152.736 39.416ZM157.696 47.072C157.056 47.072 156.56 46.9 156.208 46.556C155.856 46.212 155.68 45.72 155.68 45.08V39.248H156.832V45.032C156.832 45.376 156.916 45.64 157.084 45.824C157.26 46.008 157.508 46.1 157.828 46.1C158.188 46.1 158.488 46 158.728 45.8L159.088 46.628C158.912 46.78 158.7 46.892 158.452 46.964C158.212 47.036 157.96 47.072 157.696 47.072ZM154.6 41.588V40.64H158.656V41.588H154.6ZM166.535 47.072C165.855 47.072 165.255 46.932 164.735 46.652C164.223 46.372 163.823 45.988 163.535 45.5C163.255 45.012 163.115 44.452 163.115 43.82C163.115 43.188 163.251 42.628 163.523 42.14C163.803 41.652 164.183 41.272 164.663 41C165.151 40.72 165.699 40.58 166.307 40.58C166.923 40.58 167.467 40.716 167.939 40.988C168.411 41.26 168.779 41.644 169.043 42.14C169.315 42.628 169.451 43.2 169.451 43.856C169.451 43.904 169.447 43.96 169.439 44.024C169.439 44.088 169.435 44.148 169.427 44.204H164.015V43.376H168.827L168.359 43.664C168.367 43.256 168.283 42.892 168.107 42.572C167.931 42.252 167.687 42.004 167.375 41.828C167.071 41.644 166.715 41.552 166.307 41.552C165.907 41.552 165.551 41.644 165.239 41.828C164.927 42.004 164.683 42.256 164.507 42.584C164.331 42.904 164.243 43.272 164.243 43.688V43.88C164.243 44.304 164.339 44.684 164.531 45.02C164.731 45.348 165.007 45.604 165.359 45.788C165.711 45.972 166.115 46.064 166.571 46.064C166.947 46.064 167.287 46 167.591 45.872C167.903 45.744 168.175 45.552 168.407 45.296L169.043 46.04C168.755 46.376 168.395 46.632 167.963 46.808C167.539 46.984 167.063 47.072 166.535 47.072ZM174.823 47V45.656L174.763 45.404V43.112C174.763 42.624 174.619 42.248 174.331 41.984C174.051 41.712 173.627 41.576 173.059 41.576C172.683 41.576 172.315 41.64 171.955 41.768C171.595 41.888 171.291 42.052 171.043 42.26L170.563 41.396C170.891 41.132 171.283 40.932 171.739 40.796C172.203 40.652 172.687 40.58 173.191 40.58C174.063 40.58 174.735 40.792 175.207 41.216C175.679 41.64 175.915 42.288 175.915 43.16V47H174.823ZM172.735 47.072C172.263 47.072 171.847 46.992 171.487 46.832C171.135 46.672 170.863 46.452 170.671 46.172C170.479 45.884 170.383 45.56 170.383 45.2C170.383 44.856 170.463 44.544 170.623 44.264C170.791 43.984 171.059 43.76 171.427 43.592C171.803 43.424 172.307 43.34 172.939 43.34H174.955V44.168H172.987C172.411 44.168 172.023 44.264 171.823 44.456C171.623 44.648 171.523 44.88 171.523 45.152C171.523 45.464 171.647 45.716 171.895 45.908C172.143 46.092 172.487 46.184 172.927 46.184C173.359 46.184 173.735 46.088 174.055 45.896C174.383 45.704 174.619 45.424 174.763 45.056L174.991 45.848C174.839 46.224 174.571 46.524 174.187 46.748C173.803 46.964 173.319 47.072 172.735 47.072ZM179.871 47.072C179.343 47.072 178.839 47 178.359 46.856C177.887 46.712 177.515 46.536 177.243 46.328L177.723 45.416C177.995 45.6 178.331 45.756 178.731 45.884C179.131 46.012 179.539 46.076 179.955 46.076C180.491 46.076 180.875 46 181.107 45.848C181.347 45.696 181.467 45.484 181.467 45.212C181.467 45.012 181.395 44.856 181.251 44.744C181.107 44.632 180.915 44.548 180.675 44.492C180.443 44.436 180.183 44.388 179.895 44.348C179.607 44.3 179.319 44.244 179.031 44.18C178.743 44.108 178.479 44.012 178.239 43.892C177.999 43.764 177.807 43.592 177.663 43.376C177.519 43.152 177.447 42.856 177.447 42.488C177.447 42.104 177.555 41.768 177.771 41.48C177.987 41.192 178.291 40.972 178.683 40.82C179.083 40.66 179.555 40.58 180.099 40.58C180.515 40.58 180.935 40.632 181.359 40.736C181.791 40.832 182.143 40.972 182.415 41.156L181.923 42.068C181.635 41.876 181.335 41.744 181.023 41.672C180.711 41.6 180.399 41.564 180.087 41.564C179.583 41.564 179.207 41.648 178.959 41.816C178.711 41.976 178.587 42.184 178.587 42.44C178.587 42.656 178.659 42.824 178.803 42.944C178.955 43.056 179.147 43.144 179.379 43.208C179.619 43.272 179.883 43.328 180.171 43.376C180.459 43.416 180.747 43.472 181.035 43.544C181.323 43.608 181.583 43.7 181.815 43.82C182.055 43.94 182.247 44.108 182.391 44.324C182.543 44.54 182.619 44.828 182.619 45.188C182.619 45.572 182.507 45.904 182.283 46.184C182.059 46.464 181.743 46.684 181.335 46.844C180.927 46.996 180.439 47.072 179.871 47.072ZM184.218 49.4C183.914 49.4 183.618 49.348 183.33 49.244C183.042 49.148 182.794 49.004 182.586 48.812L183.078 47.948C183.238 48.1 183.414 48.216 183.606 48.296C183.798 48.376 184.002 48.416 184.218 48.416C184.498 48.416 184.73 48.344 184.914 48.2C185.098 48.056 185.27 47.8 185.43 47.432L185.826 46.556L185.946 46.412L188.442 40.64H189.57L186.486 47.636C186.302 48.084 186.094 48.436 185.862 48.692C185.638 48.948 185.39 49.128 185.118 49.232C184.846 49.344 184.546 49.4 184.218 49.4ZM185.73 47.204L182.826 40.64H184.026L186.498 46.304L185.73 47.204ZM194.035 47V40.076C194.035 39.452 194.215 38.956 194.575 38.588C194.943 38.212 195.463 38.024 196.135 38.024C196.383 38.024 196.619 38.056 196.843 38.12C197.075 38.176 197.271 38.268 197.431 38.396L197.083 39.272C196.963 39.176 196.827 39.104 196.675 39.056C196.523 39 196.363 38.972 196.195 38.972C195.859 38.972 195.603 39.068 195.427 39.26C195.251 39.444 195.163 39.72 195.163 40.088V40.94L195.187 41.468V47H194.035ZM192.955 41.588V40.64H197.011V41.588H192.955ZM200.728 47.072C200.088 47.072 199.52 46.932 199.024 46.652C198.528 46.372 198.136 45.988 197.848 45.5C197.56 45.004 197.416 44.444 197.416 43.82C197.416 43.188 197.56 42.628 197.848 42.14C198.136 41.652 198.528 41.272 199.024 41C199.52 40.72 200.088 40.58 200.728 40.58C201.36 40.58 201.924 40.72 202.42 41C202.924 41.272 203.316 41.652 203.596 42.14C203.884 42.62 204.028 43.18 204.028 43.82C204.028 44.452 203.884 45.012 203.596 45.5C203.316 45.988 202.924 46.372 202.42 46.652C201.924 46.932 201.36 47.072 200.728 47.072ZM200.728 46.064C201.136 46.064 201.5 45.972 201.82 45.788C202.148 45.604 202.404 45.344 202.588 45.008C202.772 44.664 202.864 44.268 202.864 43.82C202.864 43.364 202.772 42.972 202.588 42.644C202.404 42.308 202.148 42.048 201.82 41.864C201.5 41.68 201.136 41.588 200.728 41.588C200.32 41.588 199.956 41.68 199.636 41.864C199.316 42.048 199.06 42.308 198.868 42.644C198.676 42.972 198.58 43.364 198.58 43.82C198.58 44.268 198.676 44.664 198.868 45.008C199.06 45.344 199.316 45.604 199.636 45.788C199.956 45.972 200.32 46.064 200.728 46.064ZM205.621 47V40.64H206.725V42.368L206.617 41.936C206.793 41.496 207.089 41.16 207.505 40.928C207.921 40.696 208.433 40.58 209.041 40.58V41.696C208.993 41.688 208.945 41.684 208.897 41.684C208.857 41.684 208.817 41.684 208.777 41.684C208.161 41.684 207.673 41.868 207.313 42.236C206.953 42.604 206.773 43.136 206.773 43.832V47H205.621ZM216.442 47.072C215.898 47.072 215.418 46.972 215.002 46.772C214.594 46.572 214.274 46.268 214.042 45.86C213.818 45.444 213.706 44.924 213.706 44.3V40.64H214.858V44.168C214.858 44.792 215.006 45.26 215.302 45.572C215.606 45.884 216.03 46.04 216.574 46.04C216.974 46.04 217.322 45.96 217.618 45.8C217.914 45.632 218.142 45.392 218.302 45.08C218.462 44.76 218.542 44.376 218.542 43.928V40.64H219.694V47H218.602V45.284L218.782 45.74C218.574 46.164 218.262 46.492 217.846 46.724C217.43 46.956 216.962 47.072 216.442 47.072ZM223.711 47.072C223.183 47.072 222.679 47 222.199 46.856C221.727 46.712 221.355 46.536 221.083 46.328L221.563 45.416C221.835 45.6 222.171 45.756 222.571 45.884C222.971 46.012 223.379 46.076 223.795 46.076C224.331 46.076 224.715 46 224.947 45.848C225.187 45.696 225.307 45.484 225.307 45.212C225.307 45.012 225.235 44.856 225.091 44.744C224.947 44.632 224.755 44.548 224.515 44.492C224.283 44.436 224.023 44.388 223.735 44.348C223.447 44.3 223.159 44.244 222.871 44.18C222.583 44.108 222.319 44.012 222.079 43.892C221.839 43.764 221.647 43.592 221.503 43.376C221.359 43.152 221.287 42.856 221.287 42.488C221.287 42.104 221.395 41.768 221.611 41.48C221.827 41.192 222.131 40.972 222.523 40.82C222.923 40.66 223.395 40.58 223.939 40.58C224.355 40.58 224.775 40.632 225.199 40.736C225.631 40.832 225.983 40.972 226.255 41.156L225.763 42.068C225.475 41.876 225.175 41.744 224.863 41.672C224.551 41.6 224.239 41.564 223.927 41.564C223.423 41.564 223.047 41.648 222.799 41.816C222.551 41.976 222.427 42.184 222.427 42.44C222.427 42.656 222.499 42.824 222.643 42.944C222.795 43.056 222.987 43.144 223.219 43.208C223.459 43.272 223.723 43.328 224.011 43.376C224.299 43.416 224.587 43.472 224.875 43.544C225.163 43.608 225.423 43.7 225.655 43.82C225.895 43.94 226.087 44.108 226.231 44.324C226.383 44.54 226.459 44.828 226.459 45.188C226.459 45.572 226.347 45.904 226.123 46.184C225.899 46.464 225.583 46.684 225.175 46.844C224.767 46.996 224.279 47.072 223.711 47.072ZM233.305 47.072C232.665 47.072 232.169 46.9 231.817 46.556C231.465 46.212 231.289 45.72 231.289 45.08V39.248H232.441V45.032C232.441 45.376 232.525 45.64 232.693 45.824C232.869 46.008 233.117 46.1 233.437 46.1C233.797 46.1 234.097 46 234.337 45.8L234.697 46.628C234.521 46.78 234.309 46.892 234.061 46.964C233.821 47.036 233.569 47.072 233.305 47.072ZM230.209 41.588V40.64H234.265V41.588H230.209ZM238.603 47.072C237.963 47.072 237.395 46.932 236.899 46.652C236.403 46.372 236.011 45.988 235.723 45.5C235.435 45.004 235.291 44.444 235.291 43.82C235.291 43.188 235.435 42.628 235.723 42.14C236.011 41.652 236.403 41.272 236.899 41C237.395 40.72 237.963 40.58 238.603 40.58C239.235 40.58 239.799 40.72 240.295 41C240.799 41.272 241.191 41.652 241.471 42.14C241.759 42.62 241.903 43.18 241.903 43.82C241.903 44.452 241.759 45.012 241.471 45.5C241.191 45.988 240.799 46.372 240.295 46.652C239.799 46.932 239.235 47.072 238.603 47.072ZM238.603 46.064C239.011 46.064 239.375 45.972 239.695 45.788C240.023 45.604 240.279 45.344 240.463 45.008C240.647 44.664 240.739 44.268 240.739 43.82C240.739 43.364 240.647 42.972 240.463 42.644C240.279 42.308 240.023 42.048 239.695 41.864C239.375 41.68 239.011 41.588 238.603 41.588C238.195 41.588 237.831 41.68 237.511 41.864C237.191 42.048 236.935 42.308 236.743 42.644C236.551 42.972 236.455 43.364 236.455 43.82C236.455 44.268 236.551 44.664 236.743 45.008C236.935 45.344 237.191 45.604 237.511 45.788C237.831 45.972 238.195 46.064 238.603 46.064ZM249.395 47.072C248.851 47.072 248.371 46.972 247.955 46.772C247.547 46.572 247.227 46.268 246.995 45.86C246.771 45.444 246.659 44.924 246.659 44.3V40.64H247.811V44.168C247.811 44.792 247.959 45.26 248.255 45.572C248.559 45.884 248.983 46.04 249.527 46.04C249.927 46.04 250.275 45.96 250.571 45.8C250.867 45.632 251.095 45.392 251.255 45.08C251.415 44.76 251.495 44.376 251.495 43.928V40.64H252.647V47H251.555V45.284L251.735 45.74C251.527 46.164 251.215 46.492 250.799 46.724C250.383 46.956 249.915 47.072 249.395 47.072ZM258.236 40.58C258.756 40.58 259.212 40.68 259.604 40.88C260.004 41.08 260.316 41.384 260.54 41.792C260.764 42.2 260.876 42.716 260.876 43.34V47H259.724V43.472C259.724 42.856 259.572 42.392 259.268 42.08C258.972 41.768 258.552 41.612 258.008 41.612C257.6 41.612 257.244 41.692 256.94 41.852C256.636 42.012 256.4 42.248 256.232 42.56C256.072 42.872 255.992 43.26 255.992 43.724V47H254.84V40.64H255.944V42.356L255.764 41.9C255.972 41.484 256.292 41.16 256.724 40.928C257.156 40.696 257.66 40.58 258.236 40.58ZM265.636 47.072C265.02 47.072 264.468 46.936 263.98 46.664C263.5 46.392 263.12 46.012 262.84 45.524C262.56 45.036 262.42 44.468 262.42 43.82C262.42 43.172 262.56 42.608 262.84 42.128C263.12 41.64 263.5 41.26 263.98 40.988C264.468 40.716 265.02 40.58 265.636 40.58C266.172 40.58 266.656 40.7 267.088 40.94C267.52 41.18 267.864 41.54 268.12 42.02C268.384 42.5 268.516 43.1 268.516 43.82C268.516 44.54 268.388 45.14 268.132 45.62C267.884 46.1 267.544 46.464 267.112 46.712C266.68 46.952 266.188 47.072 265.636 47.072ZM265.732 46.064C266.132 46.064 266.492 45.972 266.812 45.788C267.14 45.604 267.396 45.344 267.58 45.008C267.772 44.664 267.868 44.268 267.868 43.82C267.868 43.364 267.772 42.972 267.58 42.644C267.396 42.308 267.14 42.048 266.812 41.864C266.492 41.68 266.132 41.588 265.732 41.588C265.324 41.588 264.96 41.68 264.64 41.864C264.32 42.048 264.064 42.308 263.872 42.644C263.68 42.972 263.584 43.364 263.584 43.82C263.584 44.268 263.68 44.664 263.872 45.008C264.064 45.344 264.32 45.604 264.64 45.788C264.96 45.972 265.324 46.064 265.732 46.064ZM267.904 47V45.284L267.976 43.808L267.856 42.332V38.096H269.008V47H267.904ZM274.02 47.072C273.34 47.072 272.74 46.932 272.22 46.652C271.708 46.372 271.308 45.988 271.02 45.5C270.74 45.012 270.6 44.452 270.6 43.82C270.6 43.188 270.736 42.628 271.008 42.14C271.288 41.652 271.668 41.272 272.148 41C272.636 40.72 273.184 40.58 273.792 40.58C274.408 40.58 274.952 40.716 275.424 40.988C275.896 41.26 276.264 41.644 276.528 42.14C276.8 42.628 276.936 43.2 276.936 43.856C276.936 43.904 276.932 43.96 276.924 44.024C276.924 44.088 276.92 44.148 276.912 44.204H271.5V43.376H276.312L275.844 43.664C275.852 43.256 275.768 42.892 275.592 42.572C275.416 42.252 275.172 42.004 274.86 41.828C274.556 41.644 274.2 41.552 273.792 41.552C273.392 41.552 273.036 41.644 272.724 41.828C272.412 42.004 272.168 42.256 271.992 42.584C271.816 42.904 271.728 43.272 271.728 43.688V43.88C271.728 44.304 271.824 44.684 272.016 45.02C272.216 45.348 272.492 45.604 272.844 45.788C273.196 45.972 273.6 46.064 274.056 46.064C274.432 46.064 274.772 46 275.076 45.872C275.388 45.744 275.66 45.552 275.892 45.296L276.528 46.04C276.24 46.376 275.88 46.632 275.448 46.808C275.024 46.984 274.548 47.072 274.02 47.072ZM278.535 47V40.64H279.639V42.368L279.531 41.936C279.707 41.496 280.003 41.16 280.419 40.928C280.835 40.696 281.347 40.58 281.955 40.58V41.696C281.907 41.688 281.859 41.684 281.811 41.684C281.771 41.684 281.731 41.684 281.691 41.684C281.075 41.684 280.587 41.868 280.227 42.236C279.867 42.604 279.687 43.136 279.687 43.832V47H278.535ZM285.27 47.072C284.742 47.072 284.238 47 283.758 46.856C283.286 46.712 282.914 46.536 282.642 46.328L283.122 45.416C283.394 45.6 283.73 45.756 284.13 45.884C284.53 46.012 284.938 46.076 285.354 46.076C285.89 46.076 286.274 46 286.506 45.848C286.746 45.696 286.866 45.484 286.866 45.212C286.866 45.012 286.794 44.856 286.65 44.744C286.506 44.632 286.314 44.548 286.074 44.492C285.842 44.436 285.582 44.388 285.294 44.348C285.006 44.3 284.718 44.244 284.43 44.18C284.142 44.108 283.878 44.012 283.638 43.892C283.398 43.764 283.206 43.592 283.062 43.376C282.918 43.152 282.846 42.856 282.846 42.488C282.846 42.104 282.954 41.768 283.17 41.48C283.386 41.192 283.69 40.972 284.082 40.82C284.482 40.66 284.954 40.58 285.498 40.58C285.914 40.58 286.334 40.632 286.758 40.736C287.19 40.832 287.542 40.972 287.814 41.156L287.322 42.068C287.034 41.876 286.734 41.744 286.422 41.672C286.11 41.6 285.798 41.564 285.486 41.564C284.982 41.564 284.606 41.648 284.358 41.816C284.11 41.976 283.986 42.184 283.986 42.44C283.986 42.656 284.058 42.824 284.202 42.944C284.354 43.056 284.546 43.144 284.778 43.208C285.018 43.272 285.282 43.328 285.57 43.376C285.858 43.416 286.146 43.472 286.434 43.544C286.722 43.608 286.982 43.7 287.214 43.82C287.454 43.94 287.646 44.108 287.79 44.324C287.942 44.54 288.018 44.828 288.018 45.188C288.018 45.572 287.906 45.904 287.682 46.184C287.458 46.464 287.142 46.684 286.734 46.844C286.326 46.996 285.838 47.072 285.27 47.072ZM291.641 47.072C291.001 47.072 290.505 46.9 290.153 46.556C289.801 46.212 289.625 45.72 289.625 45.08V39.248H290.777V45.032C290.777 45.376 290.861 45.64 291.029 45.824C291.205 46.008 291.453 46.1 291.773 46.1C292.133 46.1 292.433 46 292.673 45.8L293.033 46.628C292.857 46.78 292.645 46.892 292.397 46.964C292.157 47.036 291.905 47.072 291.641 47.072ZM288.545 41.588V40.64H292.601V41.588H288.545ZM298.374 47V45.656L298.314 45.404V43.112C298.314 42.624 298.17 42.248 297.882 41.984C297.602 41.712 297.178 41.576 296.61 41.576C296.234 41.576 295.866 41.64 295.506 41.768C295.146 41.888 294.842 42.052 294.594 42.26L294.114 41.396C294.442 41.132 294.834 40.932 295.29 40.796C295.754 40.652 296.238 40.58 296.742 40.58C297.614 40.58 298.286 40.792 298.758 41.216C299.23 41.64 299.466 42.288 299.466 43.16V47H298.374ZM296.286 47.072C295.814 47.072 295.398 46.992 295.038 46.832C294.686 46.672 294.414 46.452 294.222 46.172C294.03 45.884 293.934 45.56 293.934 45.2C293.934 44.856 294.014 44.544 294.174 44.264C294.342 43.984 294.61 43.76 294.978 43.592C295.354 43.424 295.858 43.34 296.49 43.34H298.506V44.168H296.538C295.962 44.168 295.574 44.264 295.374 44.456C295.174 44.648 295.074 44.88 295.074 45.152C295.074 45.464 295.198 45.716 295.446 45.908C295.694 46.092 296.038 46.184 296.478 46.184C296.91 46.184 297.286 46.088 297.606 45.896C297.934 45.704 298.17 45.424 298.314 45.056L298.542 45.848C298.39 46.224 298.122 46.524 297.738 46.748C297.354 46.964 296.87 47.072 296.286 47.072ZM304.994 40.58C305.514 40.58 305.97 40.68 306.362 40.88C306.762 41.08 307.074 41.384 307.298 41.792C307.522 42.2 307.634 42.716 307.634 43.34V47H306.482V43.472C306.482 42.856 306.33 42.392 306.026 42.08C305.73 41.768 305.31 41.612 304.766 41.612C304.358 41.612 304.002 41.692 303.698 41.852C303.394 42.012 303.158 42.248 302.99 42.56C302.83 42.872 302.75 43.26 302.75 43.724V47H301.598V40.64H302.702V42.356L302.522 41.9C302.73 41.484 303.05 41.16 303.482 40.928C303.914 40.696 304.418 40.58 304.994 40.58ZM312.394 47.072C311.778 47.072 311.226 46.936 310.738 46.664C310.258 46.392 309.878 46.012 309.598 45.524C309.318 45.036 309.178 44.468 309.178 43.82C309.178 43.172 309.318 42.608 309.598 42.128C309.878 41.64 310.258 41.26 310.738 40.988C311.226 40.716 311.778 40.58 312.394 40.58C312.93 40.58 313.414 40.7 313.846 40.94C314.278 41.18 314.622 41.54 314.878 42.02C315.142 42.5 315.274 43.1 315.274 43.82C315.274 44.54 315.146 45.14 314.89 45.62C314.642 46.1 314.302 46.464 313.87 46.712C313.438 46.952 312.946 47.072 312.394 47.072ZM312.49 46.064C312.89 46.064 313.25 45.972 313.57 45.788C313.898 45.604 314.154 45.344 314.338 45.008C314.53 44.664 314.626 44.268 314.626 43.82C314.626 43.364 314.53 42.972 314.338 42.644C314.154 42.308 313.898 42.048 313.57 41.864C313.25 41.68 312.89 41.588 312.49 41.588C312.082 41.588 311.718 41.68 311.398 41.864C311.078 42.048 310.822 42.308 310.63 42.644C310.438 42.972 310.342 43.364 310.342 43.82C310.342 44.268 310.438 44.664 310.63 45.008C310.822 45.344 311.078 45.604 311.398 45.788C311.718 45.972 312.082 46.064 312.49 46.064ZM314.662 47V45.284L314.734 43.808L314.614 42.332V38.096H315.766V47H314.662ZM80.3849 62.072C79.7049 62.072 79.1049 61.932 78.5849 61.652C78.0729 61.372 77.6729 60.988 77.3849 60.5C77.1049 60.012 76.9649 59.452 76.9649 58.82C76.9649 58.188 77.1009 57.628 77.3729 57.14C77.6529 56.652 78.0329 56.272 78.5129 56C79.0009 55.72 79.5489 55.58 80.1569 55.58C80.7729 55.58 81.3169 55.716 81.7889 55.988C82.2609 56.26 82.6289 56.644 82.8929 57.14C83.1649 57.628 83.3009 58.2 83.3009 58.856C83.3009 58.904 83.2969 58.96 83.2889 59.024C83.2889 59.088 83.2849 59.148 83.2769 59.204H77.8649V58.376H82.6769L82.2089 58.664C82.2169 58.256 82.1329 57.892 81.9569 57.572C81.7809 57.252 81.5369 57.004 81.2249 56.828C80.9209 56.644 80.5649 56.552 80.1569 56.552C79.7569 56.552 79.4009 56.644 79.0889 56.828C78.7769 57.004 78.5329 57.256 78.3569 57.584C78.1809 57.904 78.0929 58.272 78.0929 58.688V58.88C78.0929 59.304 78.1889 59.684 78.3809 60.02C78.5809 60.348 78.8569 60.604 79.2089 60.788C79.5609 60.972 79.9649 61.064 80.4209 61.064C80.7969 61.064 81.1369 61 81.4409 60.872C81.7529 60.744 82.0249 60.552 82.2569 60.296L82.8929 61.04C82.6049 61.376 82.2449 61.632 81.8129 61.808C81.3889 61.984 80.9129 62.072 80.3849 62.072ZM86.4514 62L83.6674 55.64H84.8674L87.3394 61.4H86.7634L89.2834 55.64H90.4114L87.6274 62H86.4514ZM94.1428 62.072C93.4628 62.072 92.8628 61.932 92.3428 61.652C91.8308 61.372 91.4308 60.988 91.1428 60.5C90.8628 60.012 90.7228 59.452 90.7228 58.82C90.7228 58.188 90.8588 57.628 91.1308 57.14C91.4108 56.652 91.7908 56.272 92.2708 56C92.7588 55.72 93.3068 55.58 93.9148 55.58C94.5308 55.58 95.0748 55.716 95.5468 55.988C96.0188 56.26 96.3868 56.644 96.6508 57.14C96.9228 57.628 97.0588 58.2 97.0588 58.856C97.0588 58.904 97.0548 58.96 97.0468 59.024C97.0468 59.088 97.0428 59.148 97.0348 59.204H91.6228V58.376H96.4348L95.9668 58.664C95.9748 58.256 95.8908 57.892 95.7148 57.572C95.5388 57.252 95.2948 57.004 94.9828 56.828C94.6788 56.644 94.3228 56.552 93.9148 56.552C93.5148 56.552 93.1588 56.644 92.8468 56.828C92.5348 57.004 92.2908 57.256 92.1148 57.584C91.9388 57.904 91.8508 58.272 91.8508 58.688V58.88C91.8508 59.304 91.9468 59.684 92.1388 60.02C92.3388 60.348 92.6148 60.604 92.9668 60.788C93.3188 60.972 93.7228 61.064 94.1788 61.064C94.5548 61.064 94.8948 61 95.1988 60.872C95.5108 60.744 95.7828 60.552 96.0148 60.296L96.6508 61.04C96.3628 61.376 96.0028 61.632 95.5708 61.808C95.1468 61.984 94.6708 62.072 94.1428 62.072ZM98.6584 62V55.64H99.7624V57.368L99.6544 56.936C99.8304 56.496 100.126 56.16 100.542 55.928C100.958 55.696 101.47 55.58 102.078 55.58V56.696C102.03 56.688 101.982 56.684 101.934 56.684C101.894 56.684 101.854 56.684 101.814 56.684C101.198 56.684 100.71 56.868 100.35 57.236C99.9904 57.604 99.8104 58.136 99.8104 58.832V62H98.6584ZM104.032 64.4C103.728 64.4 103.432 64.348 103.144 64.244C102.856 64.148 102.608 64.004 102.4 63.812L102.892 62.948C103.052 63.1 103.228 63.216 103.42 63.296C103.612 63.376 103.816 63.416 104.032 63.416C104.312 63.416 104.544 63.344 104.728 63.2C104.912 63.056 105.084 62.8 105.244 62.432L105.64 61.556L105.76 61.412L108.256 55.64H109.384L106.3 62.636C106.116 63.084 105.908 63.436 105.676 63.692C105.452 63.948 105.204 64.128 104.932 64.232C104.66 64.344 104.36 64.4 104.032 64.4ZM105.544 62.204L102.64 55.64H103.84L106.312 61.304L105.544 62.204ZM112.819 62.072C112.179 62.072 111.683 61.9 111.331 61.556C110.979 61.212 110.803 60.72 110.803 60.08V54.248H111.955V60.032C111.955 60.376 112.039 60.64 112.207 60.824C112.383 61.008 112.631 61.1 112.951 61.1C113.311 61.1 113.611 61 113.851 60.8L114.211 61.628C114.035 61.78 113.823 61.892 113.575 61.964C113.335 62.036 113.083 62.072 112.819 62.072ZM109.723 56.588V55.64H113.779V56.588H109.723ZM119 55.58C119.52 55.58 119.976 55.68 120.368 55.88C120.768 56.08 121.08 56.384 121.304 56.792C121.528 57.2 121.64 57.716 121.64 58.34V62H120.488V58.472C120.488 57.856 120.336 57.392 120.032 57.08C119.736 56.768 119.316 56.612 118.772 56.612C118.364 56.612 118.008 56.692 117.704 56.852C117.4 57.012 117.164 57.248 116.996 57.56C116.836 57.872 116.756 58.26 116.756 58.724V62H115.604V53.096H116.756V57.356L116.528 56.9C116.736 56.484 117.056 56.16 117.488 55.928C117.92 55.696 118.424 55.58 119 55.58ZM123.772 62V55.64H124.924V62H123.772ZM124.348 54.416C124.124 54.416 123.936 54.344 123.784 54.2C123.64 54.056 123.568 53.88 123.568 53.672C123.568 53.456 123.64 53.276 123.784 53.132C123.936 52.988 124.124 52.916 124.348 52.916C124.572 52.916 124.756 52.988 124.9 53.132C125.052 53.268 125.128 53.44 125.128 53.648C125.128 53.864 125.056 54.048 124.912 54.2C124.768 54.344 124.58 54.416 124.348 54.416ZM130.519 55.58C131.039 55.58 131.495 55.68 131.887 55.88C132.287 56.08 132.599 56.384 132.823 56.792C133.047 57.2 133.159 57.716 133.159 58.34V62H132.007V58.472C132.007 57.856 131.855 57.392 131.551 57.08C131.255 56.768 130.835 56.612 130.291 56.612C129.883 56.612 129.527 56.692 129.223 56.852C128.919 57.012 128.683 57.248 128.515 57.56C128.355 57.872 128.275 58.26 128.275 58.724V62H127.123V55.64H128.227V57.356L128.047 56.9C128.255 56.484 128.575 56.16 129.007 55.928C129.439 55.696 129.943 55.58 130.519 55.58ZM138.075 64.4C137.491 64.4 136.923 64.316 136.371 64.148C135.827 63.988 135.383 63.756 135.039 63.452L135.591 62.564C135.887 62.82 136.251 63.02 136.683 63.164C137.115 63.316 137.567 63.392 138.039 63.392C138.791 63.392 139.343 63.216 139.695 62.864C140.047 62.512 140.223 61.976 140.223 61.256V59.912L140.343 58.652L140.283 57.38V55.64H141.375V61.136C141.375 62.256 141.095 63.08 140.535 63.608C139.975 64.136 139.155 64.4 138.075 64.4ZM137.931 61.736C137.315 61.736 136.763 61.608 136.275 61.352C135.795 61.088 135.411 60.724 135.123 60.26C134.843 59.796 134.703 59.26 134.703 58.652C134.703 58.036 134.843 57.5 135.123 57.044C135.411 56.58 135.795 56.22 136.275 55.964C136.763 55.708 137.315 55.58 137.931 55.58C138.475 55.58 138.971 55.692 139.419 55.916C139.867 56.132 140.223 56.468 140.487 56.924C140.759 57.38 140.895 57.956 140.895 58.652C140.895 59.34 140.759 59.912 140.487 60.368C140.223 60.824 139.867 61.168 139.419 61.4C138.971 61.624 138.475 61.736 137.931 61.736ZM138.063 60.728C138.487 60.728 138.863 60.64 139.191 60.464C139.519 60.288 139.775 60.044 139.959 59.732C140.151 59.42 140.247 59.06 140.247 58.652C140.247 58.244 140.151 57.884 139.959 57.572C139.775 57.26 139.519 57.02 139.191 56.852C138.863 56.676 138.487 56.588 138.063 56.588C137.639 56.588 137.259 56.676 136.923 56.852C136.595 57.02 136.335 57.26 136.143 57.572C135.959 57.884 135.867 58.244 135.867 58.652C135.867 59.06 135.959 59.42 136.143 59.732C136.335 60.044 136.595 60.288 136.923 60.464C137.259 60.64 137.639 60.728 138.063 60.728ZM150.747 62V60.656L150.687 60.404V58.112C150.687 57.624 150.543 57.248 150.255 56.984C149.975 56.712 149.551 56.576 148.983 56.576C148.607 56.576 148.239 56.64 147.879 56.768C147.519 56.888 147.215 57.052 146.967 57.26L146.487 56.396C146.815 56.132 147.207 55.932 147.663 55.796C148.127 55.652 148.611 55.58 149.115 55.58C149.987 55.58 150.659 55.792 151.131 56.216C151.603 56.64 151.839 57.288 151.839 58.16V62H150.747ZM148.659 62.072C148.187 62.072 147.771 61.992 147.411 61.832C147.059 61.672 146.787 61.452 146.595 61.172C146.403 60.884 146.307 60.56 146.307 60.2C146.307 59.856 146.387 59.544 146.547 59.264C146.715 58.984 146.983 58.76 147.351 58.592C147.727 58.424 148.231 58.34 148.863 58.34H150.879V59.168H148.911C148.335 59.168 147.947 59.264 147.747 59.456C147.547 59.648 147.447 59.88 147.447 60.152C147.447 60.464 147.571 60.716 147.819 60.908C148.067 61.092 148.411 61.184 148.851 61.184C149.283 61.184 149.659 61.088 149.979 60.896C150.307 60.704 150.543 60.424 150.687 60.056L150.915 60.848C150.763 61.224 150.495 61.524 150.111 61.748C149.727 61.964 149.243 62.072 148.659 62.072ZM157.343 62.072C156.799 62.072 156.307 61.952 155.867 61.712C155.435 61.464 155.091 61.1 154.835 60.62C154.587 60.14 154.463 59.54 154.463 58.82C154.463 58.1 154.591 57.5 154.847 57.02C155.111 56.54 155.459 56.18 155.891 55.94C156.331 55.7 156.815 55.58 157.343 55.58C157.967 55.58 158.519 55.716 158.999 55.988C159.479 56.26 159.859 56.64 160.139 57.128C160.419 57.608 160.559 58.172 160.559 58.82C160.559 59.468 160.419 60.036 160.139 60.524C159.859 61.012 159.479 61.392 158.999 61.664C158.519 61.936 157.967 62.072 157.343 62.072ZM153.971 62V53.096H155.123V57.332L155.003 58.808L155.075 60.284V62H153.971ZM157.247 61.064C157.655 61.064 158.019 60.972 158.339 60.788C158.667 60.604 158.923 60.344 159.107 60.008C159.299 59.664 159.395 59.268 159.395 58.82C159.395 58.364 159.299 57.972 159.107 57.644C158.923 57.308 158.667 57.048 158.339 56.864C158.019 56.68 157.655 56.588 157.247 56.588C156.847 56.588 156.483 56.68 156.155 56.864C155.835 57.048 155.579 57.308 155.387 57.644C155.203 57.972 155.111 58.364 155.111 58.82C155.111 59.268 155.203 59.664 155.387 60.008C155.579 60.344 155.835 60.604 156.155 60.788C156.483 60.972 156.847 61.064 157.247 61.064ZM164.875 62.072C164.235 62.072 163.667 61.932 163.171 61.652C162.675 61.372 162.283 60.988 161.995 60.5C161.707 60.004 161.563 59.444 161.563 58.82C161.563 58.188 161.707 57.628 161.995 57.14C162.283 56.652 162.675 56.272 163.171 56C163.667 55.72 164.235 55.58 164.875 55.58C165.507 55.58 166.071 55.72 166.567 56C167.071 56.272 167.463 56.652 167.743 57.14C168.031 57.62 168.175 58.18 168.175 58.82C168.175 59.452 168.031 60.012 167.743 60.5C167.463 60.988 167.071 61.372 166.567 61.652C166.071 61.932 165.507 62.072 164.875 62.072ZM164.875 61.064C165.283 61.064 165.647 60.972 165.967 60.788C166.295 60.604 166.551 60.344 166.735 60.008C166.919 59.664 167.011 59.268 167.011 58.82C167.011 58.364 166.919 57.972 166.735 57.644C166.551 57.308 166.295 57.048 165.967 56.864C165.647 56.68 165.283 56.588 164.875 56.588C164.467 56.588 164.103 56.68 163.783 56.864C163.463 57.048 163.207 57.308 163.015 57.644C162.823 57.972 162.727 58.364 162.727 58.82C162.727 59.268 162.823 59.664 163.015 60.008C163.207 60.344 163.463 60.604 163.783 60.788C164.103 60.972 164.467 61.064 164.875 61.064ZM172.444 62.072C171.9 62.072 171.42 61.972 171.004 61.772C170.596 61.572 170.276 61.268 170.044 60.86C169.82 60.444 169.708 59.924 169.708 59.3V55.64H170.86V59.168C170.86 59.792 171.008 60.26 171.304 60.572C171.608 60.884 172.032 61.04 172.576 61.04C172.976 61.04 173.324 60.96 173.62 60.8C173.916 60.632 174.144 60.392 174.304 60.08C174.464 59.76 174.544 59.376 174.544 58.928V55.64H175.696V62H174.604V60.284L174.784 60.74C174.576 61.164 174.264 61.492 173.848 61.724C173.432 61.956 172.964 62.072 172.444 62.072ZM180.073 62.072C179.433 62.072 178.937 61.9 178.585 61.556C178.233 61.212 178.057 60.72 178.057 60.08V54.248H179.209V60.032C179.209 60.376 179.293 60.64 179.461 60.824C179.637 61.008 179.885 61.1 180.205 61.1C180.565 61.1 180.865 61 181.105 60.8L181.465 61.628C181.289 61.78 181.077 61.892 180.829 61.964C180.589 62.036 180.337 62.072 180.073 62.072ZM176.977 56.588V55.64H181.033V56.588H176.977ZM188.264 62.072C187.624 62.072 187.128 61.9 186.776 61.556C186.424 61.212 186.248 60.72 186.248 60.08V54.248H187.4V60.032C187.4 60.376 187.484 60.64 187.652 60.824C187.828 61.008 188.076 61.1 188.396 61.1C188.756 61.1 189.056 61 189.296 60.8L189.656 61.628C189.48 61.78 189.268 61.892 189.02 61.964C188.78 62.036 188.528 62.072 188.264 62.072ZM185.168 56.588V55.64H189.224V56.588H185.168ZM194.445 55.58C194.965 55.58 195.421 55.68 195.813 55.88C196.213 56.08 196.525 56.384 196.749 56.792C196.973 57.2 197.085 57.716 197.085 58.34V62H195.933V58.472C195.933 57.856 195.781 57.392 195.477 57.08C195.181 56.768 194.761 56.612 194.217 56.612C193.809 56.612 193.453 56.692 193.149 56.852C192.845 57.012 192.609 57.248 192.441 57.56C192.281 57.872 192.201 58.26 192.201 58.724V62H191.049V53.096H192.201V57.356L191.973 56.9C192.181 56.484 192.501 56.16 192.933 55.928C193.365 55.696 193.869 55.58 194.445 55.58ZM202.049 62.072C201.369 62.072 200.769 61.932 200.249 61.652C199.737 61.372 199.337 60.988 199.049 60.5C198.769 60.012 198.629 59.452 198.629 58.82C198.629 58.188 198.765 57.628 199.037 57.14C199.317 56.652 199.697 56.272 200.177 56C200.665 55.72 201.213 55.58 201.821 55.58C202.437 55.58 202.981 55.716 203.453 55.988C203.925 56.26 204.293 56.644 204.557 57.14C204.829 57.628 204.965 58.2 204.965 58.856C204.965 58.904 204.961 58.96 204.953 59.024C204.953 59.088 204.949 59.148 204.941 59.204H199.529V58.376H204.341L203.873 58.664C203.881 58.256 203.797 57.892 203.621 57.572C203.445 57.252 203.201 57.004 202.889 56.828C202.585 56.644 202.229 56.552 201.821 56.552C201.421 56.552 201.065 56.644 200.753 56.828C200.441 57.004 200.197 57.256 200.021 57.584C199.845 57.904 199.757 58.272 199.757 58.688V58.88C199.757 59.304 199.853 59.684 200.045 60.02C200.245 60.348 200.521 60.604 200.873 60.788C201.225 60.972 201.629 61.064 202.085 61.064C202.461 61.064 202.801 61 203.105 60.872C203.417 60.744 203.689 60.552 203.921 60.296L204.557 61.04C204.269 61.376 203.909 61.632 203.477 61.808C203.053 61.984 202.577 62.072 202.049 62.072ZM212.559 62.072C211.911 62.072 211.331 61.932 210.819 61.652C210.315 61.372 209.919 60.988 209.631 60.5C209.343 60.012 209.199 59.452 209.199 58.82C209.199 58.188 209.343 57.628 209.631 57.14C209.919 56.652 210.315 56.272 210.819 56C211.331 55.72 211.911 55.58 212.559 55.58C213.135 55.58 213.647 55.696 214.095 55.928C214.551 56.152 214.903 56.488 215.151 56.936L214.275 57.5C214.067 57.188 213.811 56.96 213.507 56.816C213.211 56.664 212.891 56.588 212.547 56.588C212.131 56.588 211.759 56.68 211.431 56.864C211.103 57.048 210.843 57.308 210.651 57.644C210.459 57.972 210.363 58.364 210.363 58.82C210.363 59.276 210.459 59.672 210.651 60.008C210.843 60.344 211.103 60.604 211.431 60.788C211.759 60.972 212.131 61.064 212.547 61.064C212.891 61.064 213.211 60.992 213.507 60.848C213.811 60.696 214.067 60.464 214.275 60.152L215.151 60.704C214.903 61.144 214.551 61.484 214.095 61.724C213.647 61.956 213.135 62.072 212.559 62.072ZM220.591 62V60.656L220.531 60.404V58.112C220.531 57.624 220.387 57.248 220.099 56.984C219.819 56.712 219.395 56.576 218.827 56.576C218.451 56.576 218.083 56.64 217.723 56.768C217.363 56.888 217.059 57.052 216.811 57.26L216.331 56.396C216.659 56.132 217.051 55.932 217.507 55.796C217.971 55.652 218.455 55.58 218.959 55.58C219.831 55.58 220.503 55.792 220.975 56.216C221.447 56.64 221.683 57.288 221.683 58.16V62H220.591ZM218.503 62.072C218.031 62.072 217.615 61.992 217.255 61.832C216.903 61.672 216.631 61.452 216.439 61.172C216.247 60.884 216.151 60.56 216.151 60.2C216.151 59.856 216.231 59.544 216.391 59.264C216.559 58.984 216.827 58.76 217.195 58.592C217.571 58.424 218.075 58.34 218.707 58.34H220.723V59.168H218.755C218.179 59.168 217.791 59.264 217.591 59.456C217.391 59.648 217.291 59.88 217.291 60.152C217.291 60.464 217.415 60.716 217.663 60.908C217.911 61.092 218.255 61.184 218.695 61.184C219.127 61.184 219.503 61.088 219.823 60.896C220.151 60.704 220.387 60.424 220.531 60.056L220.759 60.848C220.607 61.224 220.339 61.524 219.955 61.748C219.571 61.964 219.087 62.072 218.503 62.072ZM223.815 62V55.64H224.919V57.368L224.811 56.936C224.987 56.496 225.283 56.16 225.699 55.928C226.115 55.696 226.627 55.58 227.235 55.58V56.696C227.187 56.688 227.139 56.684 227.091 56.684C227.051 56.684 227.011 56.684 226.971 56.684C226.355 56.684 225.867 56.868 225.507 57.236C225.147 57.604 224.967 58.136 224.967 58.832V62H223.815ZM234.683 62.072C234.043 62.072 233.475 61.932 232.979 61.652C232.483 61.372 232.091 60.988 231.803 60.5C231.515 60.004 231.371 59.444 231.371 58.82C231.371 58.188 231.515 57.628 231.803 57.14C232.091 56.652 232.483 56.272 232.979 56C233.475 55.72 234.043 55.58 234.683 55.58C235.315 55.58 235.879 55.72 236.375 56C236.879 56.272 237.271 56.652 237.551 57.14C237.839 57.62 237.983 58.18 237.983 58.82C237.983 59.452 237.839 60.012 237.551 60.5C237.271 60.988 236.879 61.372 236.375 61.652C235.879 61.932 235.315 62.072 234.683 62.072ZM234.683 61.064C235.091 61.064 235.455 60.972 235.775 60.788C236.103 60.604 236.359 60.344 236.543 60.008C236.727 59.664 236.819 59.268 236.819 58.82C236.819 58.364 236.727 57.972 236.543 57.644C236.359 57.308 236.103 57.048 235.775 56.864C235.455 56.68 235.091 56.588 234.683 56.588C234.275 56.588 233.911 56.68 233.591 56.864C233.271 57.048 233.015 57.308 232.823 57.644C232.631 57.972 232.535 58.364 232.535 58.82C232.535 59.268 232.631 59.664 232.823 60.008C233.015 60.344 233.271 60.604 233.591 60.788C233.911 60.972 234.275 61.064 234.683 61.064ZM240.745 62L238.381 55.64H239.473L241.573 61.4H241.057L243.241 55.64H244.213L246.349 61.4H245.845L247.993 55.64H249.025L246.649 62H245.545L243.541 56.744H243.877L241.849 62H240.745ZM253.59 55.58C254.11 55.58 254.566 55.68 254.958 55.88C255.358 56.08 255.67 56.384 255.894 56.792C256.118 57.2 256.23 57.716 256.23 58.34V62H255.078V58.472C255.078 57.856 254.926 57.392 254.622 57.08C254.326 56.768 253.906 56.612 253.362 56.612C252.954 56.612 252.598 56.692 252.294 56.852C251.99 57.012 251.754 57.248 251.586 57.56C251.426 57.872 251.346 58.26 251.346 58.724V62H250.194V55.64H251.298V57.356L251.118 56.9C251.326 56.484 251.646 56.16 252.078 55.928C252.51 55.696 253.014 55.58 253.59 55.58ZM261.194 62.072C260.514 62.072 259.914 61.932 259.394 61.652C258.882 61.372 258.482 60.988 258.194 60.5C257.914 60.012 257.774 59.452 257.774 58.82C257.774 58.188 257.91 57.628 258.182 57.14C258.462 56.652 258.842 56.272 259.322 56C259.81 55.72 260.358 55.58 260.966 55.58C261.582 55.58 262.126 55.716 262.598 55.988C263.07 56.26 263.438 56.644 263.702 57.14C263.974 57.628 264.11 58.2 264.11 58.856C264.11 58.904 264.106 58.96 264.098 59.024C264.098 59.088 264.094 59.148 264.086 59.204H258.674V58.376H263.486L263.018 58.664C263.026 58.256 262.942 57.892 262.766 57.572C262.59 57.252 262.346 57.004 262.034 56.828C261.73 56.644 261.374 56.552 260.966 56.552C260.566 56.552 260.21 56.644 259.898 56.828C259.586 57.004 259.342 57.256 259.166 57.584C258.99 57.904 258.902 58.272 258.902 58.688V58.88C258.902 59.304 258.998 59.684 259.19 60.02C259.39 60.348 259.666 60.604 260.018 60.788C260.37 60.972 260.774 61.064 261.23 61.064C261.606 61.064 261.946 61 262.25 60.872C262.562 60.744 262.834 60.552 263.066 60.296L263.702 61.04C263.414 61.376 263.054 61.632 262.622 61.808C262.198 61.984 261.722 62.072 261.194 62.072ZM265.709 62V55.64H266.813V57.368L266.705 56.936C266.881 56.496 267.177 56.16 267.593 55.928C268.009 55.696 268.521 55.58 269.129 55.58V56.696C269.081 56.688 269.033 56.684 268.985 56.684C268.945 56.684 268.905 56.684 268.865 56.684C268.249 56.684 267.761 56.868 267.401 57.236C267.041 57.604 266.861 58.136 266.861 58.832V62H265.709Z"
                    fill="#828282"
                  />
                </svg>
              </div>

              <div className="d-flex gap-3 mt-4">
                <div className="form-group w-50">
                  <label>
                    First Name <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName.split(" ")[0] || ""} // Display first name part
                    onChange={(e) => {
                      const fullName =
                        `${e.target.value} ${formData.lastName}`.trim(); // Combine with last name
                      setFormData({
                        ...formData,
                        customerName: fullName,
                        customerNameFirstPart: e.target.value, // Track first part (first name)
                      });
                    }}
                    className="custom-input-atrangi owners-review"
                    placeholder="John"
                  />
                </div>
                <div className="form-group w-50">
                  <label>
                    Last Name <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.customerName.split(" ")[1] || ""} // Display last name part
                    onChange={(e) => {
                      const fullName =
                        `${formData.customerNameFirstPart} ${e.target.value}`.trim(); // Combine with first name
                      setFormData({
                        ...formData,
                        customerName: fullName,
                        lastName: e.target.value, // Update last name part
                      });
                    }}
                    className="custom-input-atrangi owners-review"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* <div className="form-group mt-3">
              <label>Email <sup>*</sup></label>
              <input
                type="text"
                name="email_id"
                value={formData.email_id}
                onChange={handleInputChange}
                className="custom-input-atrangi owners-review"
                placeholder="John.doe.1969@gmail.com"
              />
            </div> */}

              <div className="d-flex gap-3 mt-3">
                <div className="form-group w-50">
                  <label>
                    Mobile Number <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="custom-input-atrangi owners-review"
                    placeholder="+91 88888 88888"
                  />
                </div>
                <div className="form-group w-50">
                  <label>
                    Email <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    name="email_id"
                    value={formData.email_id}
                    onChange={handleInputChange}
                    className="custom-input-atrangi owners-review"
                    placeholder="John.doe.1969@gmail.com"
                  />
                </div>
              </div>

              <div className="d-flex gap-3 mt-3">
                <div className="form-group w-50">
                  <label className="mb-122">Whatsapp Number</label>
                  <br></br>
                  <div className="d-flex">
                    <input
                      type="radio"
                      id="sameAsMobile"
                      name="whatsAppNumberRadio"
                      checked={
                        formData.whatsAppNumber === formData.mobileNumber
                      }
                      onChange={() => handleWhatsAppRadioChange("mobile")}
                    />
                    <span className="gfk">Same as above</span>{" "}
                  </div>
                  <input
                    type="text"
                    name="whatsAppNumber"
                    value={formData.whatsAppNumber}
                    onChange={handleInputChange}
                    className="custom-input-atrangi owners-review"
                    placeholder="+91 88888 88888"
                    disabled={formData.whatsAppNumber === formData.mobileNumber} // Disable input if WhatsApp is same as mobile
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
                    className="custom-input-atrangi owners-review"
                    placeholder=""
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
                    className="custom-input-atrangi owners-review"
                    placeholder=""
                  />
                </div>
                <div className="form-group w-50">
                  <label>Referred By</label>
                  <input
                    type="text"
                    name="refferedBy"
                    value={formData.refferedBy}
                    onChange={handleInputChange}
                    className="custom-input-atrangi owners-review"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="cars-details mt-3">
                <svg
                  width="346"
                  height="21"
                  viewBox="0 0 346 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.36 15H5.64V9.94L0.06 0.999999H4.08L7.5 6.48L10.94 0.999999H14.96L9.36 9.94V15ZM27.568 15H18.028C17.2946 15 16.6613 14.74 16.128 14.22C15.608 13.6867 15.348 13.0533 15.348 12.32V3.68C15.348 2.94667 15.608 2.32 16.128 1.8C16.6613 1.26667 17.2946 0.999999 18.028 0.999999H27.568C28.3013 0.999999 28.928 1.26667 29.448 1.8C29.9813 2.32 30.248 2.94667 30.248 3.68V12.32C30.248 13.0533 29.9813 13.6867 29.448 14.22C28.928 14.74 28.3013 15 27.568 15ZM25.928 11.88C26.088 11.88 26.228 11.82 26.348 11.7C26.468 11.58 26.528 11.44 26.528 11.28V4.72C26.528 4.56 26.468 4.42 26.348 4.3C26.228 4.18 26.088 4.12 25.928 4.12H19.668C19.508 4.12 19.368 4.18 19.248 4.3C19.128 4.42 19.068 4.56 19.068 4.72V11.28C19.068 11.44 19.128 11.58 19.248 11.7C19.368 11.82 19.508 11.88 19.668 11.88H25.928ZM44.4889 15H34.9489C34.2156 15 33.5822 14.74 33.0489 14.22C32.5289 13.6867 32.2689 13.0533 32.2689 12.32V0.999999H35.9889V11.28C35.9889 11.44 36.0489 11.58 36.1689 11.7C36.2889 11.82 36.4289 11.88 36.5889 11.88H42.8489C43.0089 11.88 43.1489 11.82 43.2689 11.7C43.3889 11.58 43.4489 11.44 43.4489 11.28V0.999999H47.1689V12.32C47.1689 13.0533 46.9022 13.6867 46.3689 14.22C45.8489 14.74 45.2222 15 44.4889 15ZM64.207 15H59.727L54.967 10.02H53.027V15H49.307V0.999999H60.927C61.6604 0.999999 62.287 1.26667 62.807 1.8C63.3404 2.32 63.607 2.94667 63.607 3.68V7.32C63.607 8.06667 63.3404 8.70667 62.807 9.24C62.287 9.76 61.6604 10.02 60.927 10.02H59.427L64.207 15ZM59.287 6.88C59.447 6.88 59.587 6.82667 59.707 6.72C59.827 6.6 59.887 6.45333 59.887 6.28V4.72C59.887 4.56 59.827 4.42 59.707 4.3C59.587 4.18 59.447 4.12 59.287 4.12H53.027V6.88H59.287ZM84.7453 15H74.9053C74.172 15 73.5386 14.74 73.0053 14.22C72.4853 13.6867 72.2253 13.0533 72.2253 12.32V3.68C72.2253 2.94667 72.4853 2.32 73.0053 1.8C73.5386 1.26667 74.172 0.999999 74.9053 0.999999H84.7453V4.12H76.5453C76.3853 4.12 76.2453 4.18 76.1253 4.3C76.0053 4.42 75.9453 4.56 75.9453 4.72V11.28C75.9453 11.44 76.0053 11.58 76.1253 11.7C76.2453 11.82 76.3853 11.88 76.5453 11.88H84.7453V15ZM101.815 15H98.0947L96.8547 12.18H90.0947L88.8547 15H85.1347L91.2347 0.999999H95.7147L101.815 15ZM95.4947 9.04L93.4747 4.42L91.4547 9.04H95.4947ZM117.705 15H113.225L108.465 10.02H106.525V15H102.805V0.999999H114.425C115.159 0.999999 115.785 1.26667 116.305 1.8C116.839 2.32 117.105 2.94667 117.105 3.68V7.32C117.105 8.06667 116.839 8.70667 116.305 9.24C115.785 9.76 115.159 10.02 114.425 10.02H112.925L117.705 15ZM112.785 6.88C112.945 6.88 113.085 6.82667 113.205 6.72C113.325 6.6 113.385 6.45333 113.385 6.28V4.72C113.385 4.56 113.325 4.42 113.205 4.3C113.085 4.18 112.945 4.12 112.785 4.12H106.525V6.88H112.785Z"
                    fill="#828282"
                  />
                  <path
                    d="M136.424 15H125.844V0.999999H136.424C137.57 0.999999 138.55 1.40667 139.364 2.22C140.177 3.03333 140.584 4.02 140.584 5.18V10.82C140.584 11.98 140.177 12.9667 139.364 13.78C138.55 14.5933 137.57 15 136.424 15ZM134.784 11.88C135.357 11.88 135.844 11.68 136.244 11.28C136.657 10.8667 136.864 10.3667 136.864 9.78V6.22C136.864 5.63333 136.657 5.14 136.244 4.74C135.844 4.32667 135.357 4.12 134.784 4.12H129.564V11.88H134.784ZM154.929 15H145.089C144.356 15 143.722 14.74 143.189 14.22C142.669 13.6867 142.409 13.0533 142.409 12.32V3.68C142.409 2.94667 142.669 2.32 143.189 1.8C143.722 1.26667 144.356 0.999999 145.089 0.999999H154.929V4.12H146.729C146.569 4.12 146.429 4.18 146.309 4.3C146.189 4.42 146.129 4.56 146.129 4.72V6.44H153.729V9.56H146.129V11.28C146.129 11.44 146.189 11.58 146.309 11.7C146.429 11.82 146.569 11.88 146.729 11.88H154.929V15ZM164.354 15H160.614V4.12H155.634V0.999999H169.334V4.12H164.354V15ZM183.957 15H180.237L178.997 12.18H172.237L170.997 15H167.277L173.377 0.999999H177.857L183.957 15ZM177.637 9.04L175.617 4.42L173.597 9.04H177.637ZM188.668 15H184.948V0.999999H188.668V15ZM202.511 15H190.891V0.999999H194.611V11.88H202.511V15ZM214.09 15H203.51V11.88H212.45C212.623 11.88 212.763 11.82 212.87 11.7C212.99 11.58 213.05 11.44 213.05 11.28V10.16C213.05 10 212.99 9.86 212.87 9.74C212.763 9.62 212.623 9.56 212.45 9.56H206.05C205.317 9.56 204.683 9.3 204.15 8.78C203.63 8.26 203.37 7.62667 203.37 6.88V3.68C203.37 2.94667 203.63 2.32 204.15 1.8C204.683 1.26667 205.317 0.999999 206.05 0.999999H216.47V4.12H207.69C207.53 4.12 207.39 4.18 207.27 4.3C207.15 4.42 207.09 4.56 207.09 4.72V5.84C207.09 6 207.15 6.14 207.27 6.26C207.39 6.38 207.53 6.44 207.69 6.44H214.09C214.837 6.44 215.47 6.7 215.99 7.22C216.51 7.74 216.77 8.37333 216.77 9.12V12.32C216.77 13.0533 216.51 13.6867 215.99 14.22C215.47 14.74 214.837 15 214.09 15Z"
                    fill="#AB373A"
                  />
                </svg>
              </div>

              <div className="d-flex  mt-4 flex-column justify-content-center align-items-center">
                <div className="form-group w-100">
                  <div className="brand-model">
                    Any Modifications/aftermarket fitment done?
                  </div>
                </div>
                <div className="form-group w-100">
                  <div className="d-flex gap-3 justify-content-around">
                    <div
                      className={`form-group w-25 justify-content-center d-flex carbtuon ${
                        selectedyesTypeone === "yes" ? "active" : ""
                      }`}
                      onClick={() => handleyesTypeSelectone("yes")}
                    >
                      YES
                    </div>
                    <div
                      className={`form-group w-25 justify-content-center d-flex carbtuon ${
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
                <div className="d-flex gap-3 m">
                  <input
                    type="text"
                    className="custom-input-atrangi owners-review"
                    placeholder="Please Specify"
                    value={formData.modificationOfVehicle} // Bind to formData
                    onChange={handleInputChange} // Handle input change
                  />
                </div>
              )}

              <div className="d-flex gap-3 mt-3">
                <div className="form-group w-50">
                  <div className="brand-model">Majorly Driven on?</div>
                </div>
                <div className="form-group w-50 d-flex justify-content-end">
                  <select
                    className="form-select"
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
                <div className="form-group w-50 d-flex justify-content-end">
                  <select
                    className="form-select"
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

            <div>
              <div className="cars-details mt-3">
                <svg
                  width="346"
                  height="21"
                  viewBox="0 0 346 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.14 15H12.42V9.56H5.12V15H1.4V0.999999H5.12V6.44H12.42V0.999999H16.14V15ZM30.4586 15H20.9186C20.1853 15 19.5519 14.74 19.0186 14.22C18.4986 13.6867 18.2386 13.0533 18.2386 12.32V3.68C18.2386 2.94667 18.4986 2.32 19.0186 1.8C19.5519 1.26667 20.1853 0.999999 20.9186 0.999999H30.4586C31.1919 0.999999 31.8186 1.26667 32.3386 1.8C32.8719 2.32 33.1386 2.94667 33.1386 3.68V12.32C33.1386 13.0533 32.8719 13.6867 32.3386 14.22C31.8186 14.74 31.1919 15 30.4586 15ZM28.8186 11.88C28.9786 11.88 29.1186 11.82 29.2386 11.7C29.3586 11.58 29.4186 11.44 29.4186 11.28V4.72C29.4186 4.56 29.3586 4.42 29.2386 4.3C29.1186 4.18 28.9786 4.12 28.8186 4.12H22.5586C22.3986 4.12 22.2586 4.18 22.1386 4.3C22.0186 4.42 21.9586 4.56 21.9586 4.72V11.28C21.9586 11.44 22.0186 11.58 22.1386 11.7C22.2586 11.82 22.3986 11.88 22.5586 11.88H28.8186ZM52.9595 15H48.7795L45.9595 6.76L43.1195 15H38.9595L34.0395 0.999999H37.9795L41.0195 9.64L43.9795 0.999999H47.9195L50.8995 9.64L53.9195 0.999999H57.8595L52.9595 15ZM76.1425 15H65.5625V0.999999H76.1425C77.2892 0.999999 78.2692 1.40667 79.0825 2.22C79.8958 3.03333 80.3025 4.02 80.3025 5.18V10.82C80.3025 11.98 79.8958 12.9667 79.0825 13.78C78.2692 14.5933 77.2892 15 76.1425 15ZM74.5025 11.88C75.0758 11.88 75.5625 11.68 75.9625 11.28C76.3758 10.8667 76.5825 10.3667 76.5825 9.78V6.22C76.5825 5.63333 76.3758 5.14 75.9625 4.74C75.5625 4.32667 75.0758 4.12 74.5025 4.12H69.2825V11.88H74.5025ZM85.9677 15H82.2477V0.999999H85.9677V15ZM98.7706 15H88.1906V0.999999H98.7706C99.9173 0.999999 100.897 1.40667 101.711 2.22C102.524 3.03333 102.931 4.02 102.931 5.18V10.82C102.931 11.98 102.524 12.9667 101.711 13.78C100.897 14.5933 99.9173 15 98.7706 15ZM97.1306 11.88C97.704 11.88 98.1906 11.68 98.5906 11.28C99.004 10.8667 99.2106 10.3667 99.2106 9.78V6.22C99.2106 5.63333 99.004 5.14 98.5906 4.74C98.1906 4.32667 97.704 4.12 97.1306 4.12H91.9106V11.88H97.1306ZM119.501 15H115.781V9.94L110.201 0.999999H114.221L117.641 6.48L121.081 0.999999H125.101L119.501 9.94V15ZM137.709 15H128.169C127.436 15 126.803 14.74 126.269 14.22C125.749 13.6867 125.489 13.0533 125.489 12.32V3.68C125.489 2.94667 125.749 2.32 126.269 1.8C126.803 1.26667 127.436 0.999999 128.169 0.999999H137.709C138.443 0.999999 139.069 1.26667 139.589 1.8C140.123 2.32 140.389 2.94667 140.389 3.68V12.32C140.389 13.0533 140.123 13.6867 139.589 14.22C139.069 14.74 138.443 15 137.709 15ZM136.069 11.88C136.229 11.88 136.369 11.82 136.489 11.7C136.609 11.58 136.669 11.44 136.669 11.28V4.72C136.669 4.56 136.609 4.42 136.489 4.3C136.369 4.18 136.229 4.12 136.069 4.12H129.809C129.649 4.12 129.509 4.18 129.389 4.3C129.269 4.42 129.209 4.56 129.209 4.72V11.28C129.209 11.44 129.269 11.58 129.389 11.7C129.509 11.82 129.649 11.88 129.809 11.88H136.069ZM154.63 15H145.09C144.357 15 143.724 14.74 143.19 14.22C142.67 13.6867 142.41 13.0533 142.41 12.32V0.999999H146.13V11.28C146.13 11.44 146.19 11.58 146.31 11.7C146.43 11.82 146.57 11.88 146.73 11.88H152.99C153.15 11.88 153.29 11.82 153.41 11.7C153.53 11.58 153.59 11.44 153.59 11.28V0.999999H157.31V12.32C157.31 13.0533 157.044 13.6867 156.51 14.22C155.99 14.74 155.364 15 154.63 15Z"
                    fill="#828282"
                  />
                  <path
                    d="M169.834 15H166.114V0.999999H178.634V4.12H169.834V6.44H177.434V9.56H169.834V15ZM183.707 15H179.987V0.999999H183.707V15ZM200.83 15H197.11L189.65 6.3V15H185.93V0.999999H189.65L197.11 9.7V0.999999H200.83V15ZM218.485 15H214.765L213.525 12.18H206.765L205.525 15H201.805L207.905 0.999999H212.385L218.485 15ZM212.165 9.04L210.145 4.42L208.125 9.04H212.165ZM231.096 15H219.476V0.999999H223.196V11.88H231.096V15ZM235.955 15H232.235V0.999999H235.955V15ZM248.618 15H238.038V11.88H246.978C247.151 11.88 247.291 11.82 247.398 11.7C247.518 11.58 247.578 11.44 247.578 11.28V10.16C247.578 10 247.518 9.86 247.398 9.74C247.291 9.62 247.151 9.56 246.978 9.56H240.578C239.845 9.56 239.211 9.3 238.678 8.78C238.158 8.26 237.898 7.62667 237.898 6.88V3.68C237.898 2.94667 238.158 2.32 238.678 1.8C239.211 1.26667 239.845 0.999999 240.578 0.999999H250.998V4.12H242.218C242.058 4.12 241.918 4.18 241.798 4.3C241.678 4.42 241.618 4.56 241.618 4.72V5.84C241.618 6 241.678 6.14 241.798 6.26C241.918 6.38 242.058 6.44 242.218 6.44H248.618C249.365 6.44 249.998 6.7 250.518 7.22C251.038 7.74 251.298 8.37333 251.298 9.12V12.32C251.298 13.0533 251.038 13.6867 250.518 14.22C249.998 14.74 249.365 15 248.618 15ZM265.623 15H255.783C255.049 15 254.416 14.74 253.883 14.22C253.363 13.6867 253.103 13.0533 253.103 12.32V3.68C253.103 2.94667 253.363 2.32 253.883 1.8C254.416 1.26667 255.049 0.999999 255.783 0.999999H265.623V4.12H257.423C257.263 4.12 257.123 4.18 257.003 4.3C256.883 4.42 256.823 4.56 256.823 4.72V6.44H264.423V9.56H256.823V11.28C256.823 11.44 256.883 11.58 257.003 11.7C257.123 11.82 257.263 11.88 257.423 11.88H265.623V15ZM274.628 15H270.908V12.18H274.628V15ZM274.628 10.68H270.908V8.08C270.908 7.66667 271.048 7.31333 271.328 7.02C271.621 6.72667 271.974 6.58 272.388 6.58H274.708C274.868 6.58 275.054 6.52667 275.268 6.42C275.481 6.3 275.588 6.16 275.588 6V4.72C275.588 4.56 275.528 4.42 275.408 4.3C275.301 4.18 275.168 4.12 275.008 4.12H271.128C270.968 4.12 270.828 4.18 270.708 4.3C270.588 4.42 270.528 4.56 270.528 4.72V5.76H266.808V3.68C266.808 2.94667 267.068 2.32 267.588 1.8C268.121 1.26667 268.754 0.999999 269.488 0.999999H276.628C277.374 0.999999 278.008 1.26667 278.528 1.8C279.061 2.32 279.328 2.94667 279.328 3.68V6.58C279.328 7.32667 279.061 7.96 278.528 8.48C278.008 9 277.374 9.26 276.628 9.26H274.928C274.848 9.26 274.774 9.29333 274.708 9.36C274.654 9.41333 274.628 9.48 274.628 9.56V10.68Z"
                    fill="#AB373A"
                  />
                </svg>
              </div>

              <div className="d-flex gap-3 mt-4">
                <div className="form-group w-100">
                  <label>Why this Car?</label>
                  <input
                    type="text"
                    name="whyThisCar" // Bind to state key
                    value={formData.whyThisCar} // Set value from state
                    onChange={handleInputChange} // Handle changes
                    className="custom-input-atrangi owners-review mt-3"
                  />
                </div>
              </div>

              <div className="d-flex gap-3 mt-1">
                <div className="form-group w-100">
                  <label>Key reasons to consider this v/s Competetion?</label>
                </div>
              </div>
              <div className="d-flex gap-3 mt-1">
                <div className="form-group w-50 d-flex flex-column gap-1">
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
                        className="form-check-input colornf"
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

                <div className="form-group w-50 d-flex flex-column gap-1">
                  {[
                    "Boot Space",
                    "Resale",
                    "Technology",
                    "Design",
                    "Emotional Connect",
                    "Others",
                  ].map((reason, index) => (
                    <div
                      className="form-check d-flex align-items-center"
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
                        className="form-check-label"
                        htmlFor={`reason-${index + 6}`}
                      >
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="cars-details mt-3">
                <svg
                  width="346"
                  height="22"
                  viewBox="0 0 346 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.98 15H1.4V0.999999H11.98C13.1267 0.999999 14.1067 1.40667 14.92 2.22C15.7333 3.03333 16.14 4.02 16.14 5.18V10.82C16.14 11.98 15.7333 12.9667 14.92 13.78C14.1067 14.5933 13.1267 15 11.98 15ZM10.34 11.88C10.9133 11.88 11.4 11.68 11.8 11.28C12.2133 10.8667 12.42 10.3667 12.42 9.78V6.22C12.42 5.63333 12.2133 5.14 11.8 4.74C11.4 4.32667 10.9133 4.12 10.34 4.12H5.12V11.88H10.34ZM30.4852 15H20.6452C19.9118 15 19.2785 14.74 18.7452 14.22C18.2252 13.6867 17.9652 13.0533 17.9652 12.32V3.68C17.9652 2.94667 18.2252 2.32 18.7452 1.8C19.2785 1.26667 19.9118 0.999999 20.6452 0.999999H30.4852V4.12H22.2852C22.1252 4.12 21.9852 4.18 21.8652 4.3C21.7452 4.42 21.6852 4.56 21.6852 4.72V6.44H29.2852V9.56H21.6852V11.28C21.6852 11.44 21.7452 11.58 21.8652 11.7C21.9852 11.82 22.1252 11.88 22.2852 11.88H30.4852V15ZM47.7303 15H44.0103L42.7703 12.18H36.0103L34.7703 15H31.0503L37.1503 0.999999H41.6303L47.7303 15ZM41.4103 9.04L39.3903 4.42L37.3703 9.04H41.4103ZM60.3411 15H48.7211V0.999999H52.4411V11.88H60.3411V15ZM73.8805 15H64.0405C63.3071 15 62.6738 14.74 62.1405 14.22C61.6205 13.6867 61.3605 13.0533 61.3605 12.32V3.68C61.3605 2.94667 61.6205 2.32 62.1405 1.8C62.6738 1.26667 63.3071 0.999999 64.0405 0.999999H73.8805V4.12H65.6805C65.5205 4.12 65.3805 4.18 65.2605 4.3C65.1405 4.42 65.0805 4.56 65.0805 4.72V6.44H72.6805V9.56H65.0805V11.28C65.0805 11.44 65.1405 11.58 65.2605 11.7C65.3805 11.82 65.5205 11.88 65.6805 11.88H73.8805V15ZM90.5656 15H86.0856L81.3256 10.02H79.3856V15H75.6656V0.999999H87.2856C88.019 0.999999 88.6456 1.26667 89.1656 1.8C89.699 2.32 89.9656 2.94667 89.9656 3.68V7.32C89.9656 8.06667 89.699 8.70667 89.1656 9.24C88.6456 9.76 88.019 10.02 87.2856 10.02H85.7856L90.5656 15ZM85.6456 6.88C85.8056 6.88 85.9456 6.82667 86.0656 6.72C86.1856 6.6 86.2456 6.45333 86.2456 6.28V4.72C86.2456 4.56 86.1856 4.42 86.0656 4.3C85.9456 4.18 85.8056 4.12 85.6456 4.12H79.3856V6.88H85.6456ZM102.478 15H91.8983V11.88H100.838C101.012 11.88 101.152 11.82 101.258 11.7C101.378 11.58 101.438 11.44 101.438 11.28V10.16C101.438 10 101.378 9.86 101.258 9.74C101.152 9.62 101.012 9.56 100.838 9.56H94.4383C93.7049 9.56 93.0716 9.3 92.5383 8.78C92.0183 8.26 91.7583 7.62667 91.7583 6.88V3.68C91.7583 2.94667 92.0183 2.32 92.5383 1.8C93.0716 1.26667 93.7049 0.999999 94.4383 0.999999H104.858V4.12H96.0783C95.9183 4.12 95.7783 4.18 95.6583 4.3C95.5383 4.42 95.4783 4.56 95.4783 4.72V5.84C95.4783 6 95.5383 6.14 95.6583 6.26C95.7783 6.38 95.9183 6.44 96.0783 6.44H102.478C103.225 6.44 103.858 6.7 104.378 7.22C104.898 7.74 105.158 8.37333 105.158 9.12V12.32C105.158 13.0533 104.898 13.6867 104.378 14.22C103.858 14.74 103.225 15 102.478 15ZM121.823 15H118.103V9.56H110.803V15H107.083V0.999999H110.803V6.44H118.103V0.999999H121.823V15ZM127.761 15H124.041V0.999999H127.761V15ZM133.704 15H129.984V0.999999H141.604C142.338 0.999999 142.964 1.26667 143.484 1.8C144.018 2.32 144.284 2.94667 144.284 3.68V7.32C144.284 8.06667 144.018 8.70667 143.484 9.24C142.964 9.76 142.338 10.02 141.604 10.02H133.704V15ZM139.964 6.88C140.124 6.88 140.264 6.82667 140.384 6.72C140.504 6.6 140.564 6.45333 140.564 6.28V4.72C140.564 4.56 140.504 4.42 140.384 4.3C140.264 4.18 140.124 4.12 139.964 4.12H133.704V6.88H139.964Z"
                    fill="#828282"
                  />
                  <path
                    d="M164.934 15H155.094C154.361 15 153.728 14.74 153.194 14.22C152.674 13.6867 152.414 13.0533 152.414 12.32V3.68C152.414 2.94667 152.674 2.32 153.194 1.8C153.728 1.26667 154.361 0.999999 155.094 0.999999H164.934V4.12H156.734C156.574 4.12 156.434 4.18 156.314 4.3C156.194 4.42 156.134 4.56 156.134 4.72V6.44H163.734V9.56H156.134V11.28C156.134 11.44 156.194 11.58 156.314 11.7C156.434 11.82 156.574 11.88 156.734 11.88H164.934V15ZM181.34 15H177.02L173.46 10.52L169.88 15H165.56L171.3 7.82L165.86 0.999999H170.18L173.46 5.1L176.74 0.999999H181.04L175.62 7.82L181.34 15ZM186.129 15H182.409V0.999999H194.029C194.762 0.999999 195.389 1.26667 195.909 1.8C196.442 2.32 196.709 2.94667 196.709 3.68V7.32C196.709 8.06667 196.442 8.70667 195.909 9.24C195.389 9.76 194.762 10.02 194.029 10.02H186.129V15ZM192.389 6.88C192.549 6.88 192.689 6.82667 192.809 6.72C192.929 6.6 192.989 6.45333 192.989 6.28V4.72C192.989 4.56 192.929 4.42 192.809 4.3C192.689 4.18 192.549 4.12 192.389 4.12H186.129V6.88H192.389ZM210.693 15H200.853C200.12 15 199.486 14.74 198.953 14.22C198.433 13.6867 198.173 13.0533 198.173 12.32V3.68C198.173 2.94667 198.433 2.32 198.953 1.8C199.486 1.26667 200.12 0.999999 200.853 0.999999H210.693V4.12H202.493C202.333 4.12 202.193 4.18 202.073 4.3C201.953 4.42 201.893 4.56 201.893 4.72V6.44H209.493V9.56H201.893V11.28C201.893 11.44 201.953 11.58 202.073 11.7C202.193 11.82 202.333 11.88 202.493 11.88H210.693V15ZM227.378 15H222.898L218.138 10.02H216.198V15H212.478V0.999999H224.098C224.831 0.999999 225.458 1.26667 225.978 1.8C226.511 2.32 226.778 2.94667 226.778 3.68V7.32C226.778 8.06667 226.511 8.70667 225.978 9.24C225.458 9.76 224.831 10.02 224.098 10.02H222.598L227.378 15ZM222.458 6.88C222.618 6.88 222.758 6.82667 222.878 6.72C222.998 6.6 223.058 6.45333 223.058 6.28V4.72C223.058 4.56 222.998 4.42 222.878 4.3C222.758 4.18 222.618 4.12 222.458 4.12H216.198V6.88H222.458ZM232.571 15H228.851V0.999999H232.571V15ZM247.194 15H237.354C236.62 15 235.987 14.74 235.454 14.22C234.934 13.6867 234.674 13.0533 234.674 12.32V3.68C234.674 2.94667 234.934 2.32 235.454 1.8C235.987 1.26667 236.62 0.999999 237.354 0.999999H247.194V4.12H238.994C238.834 4.12 238.694 4.18 238.574 4.3C238.454 4.42 238.394 4.56 238.394 4.72V6.44H245.994V9.56H238.394V11.28C238.394 11.44 238.454 11.58 238.574 11.7C238.694 11.82 238.834 11.88 238.994 11.88H247.194V15ZM263.879 15H260.159L252.699 6.3V15H248.979V0.999999H252.699L260.159 9.7V0.999999H263.879V15ZM278.474 15H268.634C267.901 15 267.268 14.74 266.734 14.22C266.214 13.6867 265.954 13.0533 265.954 12.32V3.68C265.954 2.94667 266.214 2.32 266.734 1.8C267.268 1.26667 267.901 0.999999 268.634 0.999999H278.474V4.12H270.274C270.114 4.12 269.974 4.18 269.854 4.3C269.734 4.42 269.674 4.56 269.674 4.72V11.28C269.674 11.44 269.734 11.58 269.854 11.7C269.974 11.82 270.114 11.88 270.274 11.88H278.474V15ZM292.484 15H282.644C281.91 15 281.277 14.74 280.744 14.22C280.224 13.6867 279.964 13.0533 279.964 12.32V3.68C279.964 2.94667 280.224 2.32 280.744 1.8C281.277 1.26667 281.91 0.999999 282.644 0.999999H292.484V4.12H284.284C284.124 4.12 283.984 4.18 283.864 4.3C283.744 4.42 283.684 4.56 283.684 4.72V6.44H291.284V9.56H283.684V11.28C283.684 11.44 283.744 11.58 283.864 11.7C283.984 11.82 284.124 11.88 284.284 11.88H292.484V15Z"
                    fill="#AB373A"
                  />
                </svg>
              </div>
              <div className="d-flex gap-3 mt-4">
                <div className="form-group w-100">
                  <label>
                    One or more features that you learnt after Purchasing this
                    Car?
                  </label>
                  <input
                    type="text"
                    name="featuresLearntAfterPurchaseing"
                    className="custom-input-atrangi owners-review mt-3"
                    placeholder="Enter the features"
                    value={formData.featuresLearntAfterPurchaseing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="d-flex gap-3 mt-1">
                <div className="form-group w-100 mb-1">
                  <label>Things Lack in this Car?</label>
                </div>
              </div>
              <div className="d-flex gap-3 mt">
                <div className="form-group w-50 d-flex flex-column gap-1">
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
                      className="form-check d-flex align-items-center"
                      key={value}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={value}
                        id={value}
                        checked={formData.thingsLackinThisCar
                          .split(", ")
                          .includes(value)} // Ensure checkbox reflects state
                        onChange={handleLackInThisCarChange}
                        style={{ accentColor: "#B1081A" }}
                      />
                      <label className="form-check-label" htmlFor={value}>
                        {value}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="form-group w-50 d-flex flex-column gap-1">
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
                      className="form-check d-flex align-items-center"
                      key={value}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={value}
                        id={value}
                        checked={formData.thingsLackinThisCar
                          .split(", ")
                          .includes(value)} // Ensure checkbox reflects state
                        onChange={handleLackInThisCarChange}
                        style={{ accentColor: "#B1081A" }}
                      />
                      <label className="form-check-label" htmlFor={value}>
                        {value}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="cars-details mt-3">
                <svg
                  width="346"
                  height="21"
                  viewBox="0 0 346 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.14 15H12.42V9.56H5.12V15H1.4V0.999999H5.12V6.44H12.42V0.999999H16.14V15ZM30.4586 15H20.9186C20.1853 15 19.5519 14.74 19.0186 14.22C18.4986 13.6867 18.2386 13.0533 18.2386 12.32V3.68C18.2386 2.94667 18.4986 2.32 19.0186 1.8C19.5519 1.26667 20.1853 0.999999 20.9186 0.999999H30.4586C31.1919 0.999999 31.8186 1.26667 32.3386 1.8C32.8719 2.32 33.1386 2.94667 33.1386 3.68V12.32C33.1386 13.0533 32.8719 13.6867 32.3386 14.22C31.8186 14.74 31.1919 15 30.4586 15ZM28.8186 11.88C28.9786 11.88 29.1186 11.82 29.2386 11.7C29.3586 11.58 29.4186 11.44 29.4186 11.28V4.72C29.4186 4.56 29.3586 4.42 29.2386 4.3C29.1186 4.18 28.9786 4.12 28.8186 4.12H22.5586C22.3986 4.12 22.2586 4.18 22.1386 4.3C22.0186 4.42 21.9586 4.56 21.9586 4.72V11.28C21.9586 11.44 22.0186 11.58 22.1386 11.7C22.2586 11.82 22.3986 11.88 22.5586 11.88H28.8186ZM52.9595 15H48.7795L45.9595 6.76L43.1195 15H38.9595L34.0395 0.999999H37.9795L41.0195 9.64L43.9795 0.999999H47.9195L50.8995 9.64L53.9195 0.999999H57.8595L52.9595 15ZM76.1425 15H65.5625V0.999999H76.1425C77.2892 0.999999 78.2692 1.40667 79.0825 2.22C79.8958 3.03333 80.3025 4.02 80.3025 5.18V10.82C80.3025 11.98 79.8958 12.9667 79.0825 13.78C78.2692 14.5933 77.2892 15 76.1425 15ZM74.5025 11.88C75.0758 11.88 75.5625 11.68 75.9625 11.28C76.3758 10.8667 76.5825 10.3667 76.5825 9.78V6.22C76.5825 5.63333 76.3758 5.14 75.9625 4.74C75.5625 4.32667 75.0758 4.12 74.5025 4.12H69.2825V11.88H74.5025ZM85.9677 15H82.2477V0.999999H85.9677V15ZM98.7706 15H88.1906V0.999999H98.7706C99.9173 0.999999 100.897 1.40667 101.711 2.22C102.524 3.03333 102.931 4.02 102.931 5.18V10.82C102.931 11.98 102.524 12.9667 101.711 13.78C100.897 14.5933 99.9173 15 98.7706 15ZM97.1306 11.88C97.704 11.88 98.1906 11.68 98.5906 11.28C99.004 10.8667 99.2106 10.3667 99.2106 9.78V6.22C99.2106 5.63333 99.004 5.14 98.5906 4.74C98.1906 4.32667 97.704 4.12 97.1306 4.12H91.9106V11.88H97.1306ZM119.501 15H115.781V9.94L110.201 0.999999H114.221L117.641 6.48L121.081 0.999999H125.101L119.501 9.94V15ZM137.709 15H128.169C127.436 15 126.803 14.74 126.269 14.22C125.749 13.6867 125.489 13.0533 125.489 12.32V3.68C125.489 2.94667 125.749 2.32 126.269 1.8C126.803 1.26667 127.436 0.999999 128.169 0.999999H137.709C138.443 0.999999 139.069 1.26667 139.589 1.8C140.123 2.32 140.389 2.94667 140.389 3.68V12.32C140.389 13.0533 140.123 13.6867 139.589 14.22C139.069 14.74 138.443 15 137.709 15ZM136.069 11.88C136.229 11.88 136.369 11.82 136.489 11.7C136.609 11.58 136.669 11.44 136.669 11.28V4.72C136.669 4.56 136.609 4.42 136.489 4.3C136.369 4.18 136.229 4.12 136.069 4.12H129.809C129.649 4.12 129.509 4.18 129.389 4.3C129.269 4.42 129.209 4.56 129.209 4.72V11.28C129.209 11.44 129.269 11.58 129.389 11.7C129.509 11.82 129.649 11.88 129.809 11.88H136.069ZM154.63 15H145.09C144.357 15 143.724 14.74 143.19 14.22C142.67 13.6867 142.41 13.0533 142.41 12.32V0.999999H146.13V11.28C146.13 11.44 146.19 11.58 146.31 11.7C146.43 11.82 146.57 11.88 146.73 11.88H152.99C153.15 11.88 153.29 11.82 153.41 11.7C153.53 11.58 153.59 11.44 153.59 11.28V0.999999H157.31V12.32C157.31 13.0533 157.044 13.6867 156.51 14.22C155.99 14.74 155.364 15 154.63 15Z"
                    fill="#828282"
                  />
                  <path
                    d="M169.834 15H166.114V0.999999H178.634V4.12H169.834V6.44H177.434V9.56H169.834V15ZM183.707 15H179.987V0.999999H183.707V15ZM200.83 15H197.11L189.65 6.3V15H185.93V0.999999H189.65L197.11 9.7V0.999999H200.83V15ZM218.485 15H214.765L213.525 12.18H206.765L205.525 15H201.805L207.905 0.999999H212.385L218.485 15ZM212.165 9.04L210.145 4.42L208.125 9.04H212.165ZM231.096 15H219.476V0.999999H223.196V11.88H231.096V15ZM235.955 15H232.235V0.999999H235.955V15ZM248.618 15H238.038V11.88H246.978C247.151 11.88 247.291 11.82 247.398 11.7C247.518 11.58 247.578 11.44 247.578 11.28V10.16C247.578 10 247.518 9.86 247.398 9.74C247.291 9.62 247.151 9.56 246.978 9.56H240.578C239.845 9.56 239.211 9.3 238.678 8.78C238.158 8.26 237.898 7.62667 237.898 6.88V3.68C237.898 2.94667 238.158 2.32 238.678 1.8C239.211 1.26667 239.845 0.999999 240.578 0.999999H250.998V4.12H242.218C242.058 4.12 241.918 4.18 241.798 4.3C241.678 4.42 241.618 4.56 241.618 4.72V5.84C241.618 6 241.678 6.14 241.798 6.26C241.918 6.38 242.058 6.44 242.218 6.44H248.618C249.365 6.44 249.998 6.7 250.518 7.22C251.038 7.74 251.298 8.37333 251.298 9.12V12.32C251.298 13.0533 251.038 13.6867 250.518 14.22C249.998 14.74 249.365 15 248.618 15ZM265.623 15H255.783C255.049 15 254.416 14.74 253.883 14.22C253.363 13.6867 253.103 13.0533 253.103 12.32V3.68C253.103 2.94667 253.363 2.32 253.883 1.8C254.416 1.26667 255.049 0.999999 255.783 0.999999H265.623V4.12H257.423C257.263 4.12 257.123 4.18 257.003 4.3C256.883 4.42 256.823 4.56 256.823 4.72V6.44H264.423V9.56H256.823V11.28C256.823 11.44 256.883 11.58 257.003 11.7C257.123 11.82 257.263 11.88 257.423 11.88H265.623V15ZM274.628 15H270.908V12.18H274.628V15ZM274.628 10.68H270.908V8.08C270.908 7.66667 271.048 7.31333 271.328 7.02C271.621 6.72667 271.974 6.58 272.388 6.58H274.708C274.868 6.58 275.054 6.52667 275.268 6.42C275.481 6.3 275.588 6.16 275.588 6V4.72C275.588 4.56 275.528 4.42 275.408 4.3C275.301 4.18 275.168 4.12 275.008 4.12H271.128C270.968 4.12 270.828 4.18 270.708 4.3C270.588 4.42 270.528 4.56 270.528 4.72V5.76H266.808V3.68C266.808 2.94667 267.068 2.32 267.588 1.8C268.121 1.26667 268.754 0.999999 269.488 0.999999H276.628C277.374 0.999999 278.008 1.26667 278.528 1.8C279.061 2.32 279.328 2.94667 279.328 3.68V6.58C279.328 7.32667 279.061 7.96 278.528 8.48C278.008 9 277.374 9.26 276.628 9.26H274.928C274.848 9.26 274.774 9.29333 274.708 9.36C274.654 9.41333 274.628 9.48 274.628 9.56V10.68Z"
                    fill="#AB373A"
                  />
                </svg>
              </div>
              <div className="d-flex gap-3 mt-3">
                <div className="form-group w-100 mb-1">
                  <label>Issues with the Car?</label>
                </div>
              </div>
              <div className="d-flex gap-3 mt-1">
                <div className="form-group w-50 d-flex flex-column gap-1">
                  {["Service Center", "Electronic", "Mechanicals"].map(
                    (issue, index) => (
                      <div
                        className="form-check d-flex align-items-center"
                        key={index}
                      >
                        <input
                          className="form-check-input"
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
                          className="form-check-label"
                          htmlFor={`issue-${index}`}
                        >
                          {issue}
                        </label>
                      </div>
                    )
                  )}
                </div>

                <div className="form-group w-50 d-flex flex-column gap-1">
                  {["Defects", "Malfunctions", "None"].map((issue, index) => (
                    <div
                      className="form-check d-flex align-items-center"
                      key={index + 3}
                    >
                      <input
                        className="form-check-input"
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
                        className="form-check-label"
                        htmlFor={`issue-${index + 3}`}
                      >
                        {issue}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-100 selectbard">
                {/* Recommendation Range */}
                <div className="flex w-100">
                  <label>Would You recommend this Car to Others?</label>
                  <input
                    type="range"
                    className="form-range w-100"
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

            <div>
              <div className="cars-details mt-3">
                <svg
                  width="346"
                  height="22"
                  viewBox="0 0 346 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.98 15H1.4V0.999999H11.98C13.1267 0.999999 14.1067 1.40667 14.92 2.22C15.7333 3.03333 16.14 4.02 16.14 5.18V10.82C16.14 11.98 15.7333 12.9667 14.92 13.78C14.1067 14.5933 13.1267 15 11.98 15ZM10.34 11.88C10.9133 11.88 11.4 11.68 11.8 11.28C12.2133 10.8667 12.42 10.3667 12.42 9.78V6.22C12.42 5.63333 12.2133 5.14 11.8 4.74C11.4 4.32667 10.9133 4.12 10.34 4.12H5.12V11.88H10.34ZM30.4852 15H20.6452C19.9118 15 19.2785 14.74 18.7452 14.22C18.2252 13.6867 17.9652 13.0533 17.9652 12.32V3.68C17.9652 2.94667 18.2252 2.32 18.7452 1.8C19.2785 1.26667 19.9118 0.999999 20.6452 0.999999H30.4852V4.12H22.2852C22.1252 4.12 21.9852 4.18 21.8652 4.3C21.7452 4.42 21.6852 4.56 21.6852 4.72V6.44H29.2852V9.56H21.6852V11.28C21.6852 11.44 21.7452 11.58 21.8652 11.7C21.9852 11.82 22.1252 11.88 22.2852 11.88H30.4852V15ZM47.7303 15H44.0103L42.7703 12.18H36.0103L34.7703 15H31.0503L37.1503 0.999999H41.6303L47.7303 15ZM41.4103 9.04L39.3903 4.42L37.3703 9.04H41.4103ZM60.3411 15H48.7211V0.999999H52.4411V11.88H60.3411V15ZM73.8805 15H64.0405C63.3071 15 62.6738 14.74 62.1405 14.22C61.6205 13.6867 61.3605 13.0533 61.3605 12.32V3.68C61.3605 2.94667 61.6205 2.32 62.1405 1.8C62.6738 1.26667 63.3071 0.999999 64.0405 0.999999H73.8805V4.12H65.6805C65.5205 4.12 65.3805 4.18 65.2605 4.3C65.1405 4.42 65.0805 4.56 65.0805 4.72V6.44H72.6805V9.56H65.0805V11.28C65.0805 11.44 65.1405 11.58 65.2605 11.7C65.3805 11.82 65.5205 11.88 65.6805 11.88H73.8805V15ZM90.5656 15H86.0856L81.3256 10.02H79.3856V15H75.6656V0.999999H87.2856C88.019 0.999999 88.6456 1.26667 89.1656 1.8C89.699 2.32 89.9656 2.94667 89.9656 3.68V7.32C89.9656 8.06667 89.699 8.70667 89.1656 9.24C88.6456 9.76 88.019 10.02 87.2856 10.02H85.7856L90.5656 15ZM85.6456 6.88C85.8056 6.88 85.9456 6.82667 86.0656 6.72C86.1856 6.6 86.2456 6.45333 86.2456 6.28V4.72C86.2456 4.56 86.1856 4.42 86.0656 4.3C85.9456 4.18 85.8056 4.12 85.6456 4.12H79.3856V6.88H85.6456ZM102.478 15H91.8983V11.88H100.838C101.012 11.88 101.152 11.82 101.258 11.7C101.378 11.58 101.438 11.44 101.438 11.28V10.16C101.438 10 101.378 9.86 101.258 9.74C101.152 9.62 101.012 9.56 100.838 9.56H94.4383C93.7049 9.56 93.0716 9.3 92.5383 8.78C92.0183 8.26 91.7583 7.62667 91.7583 6.88V3.68C91.7583 2.94667 92.0183 2.32 92.5383 1.8C93.0716 1.26667 93.7049 0.999999 94.4383 0.999999H104.858V4.12H96.0783C95.9183 4.12 95.7783 4.18 95.6583 4.3C95.5383 4.42 95.4783 4.56 95.4783 4.72V5.84C95.4783 6 95.5383 6.14 95.6583 6.26C95.7783 6.38 95.9183 6.44 96.0783 6.44H102.478C103.225 6.44 103.858 6.7 104.378 7.22C104.898 7.74 105.158 8.37333 105.158 9.12V12.32C105.158 13.0533 104.898 13.6867 104.378 14.22C103.858 14.74 103.225 15 102.478 15ZM121.823 15H118.103V9.56H110.803V15H107.083V0.999999H110.803V6.44H118.103V0.999999H121.823V15ZM127.761 15H124.041V0.999999H127.761V15ZM133.704 15H129.984V0.999999H141.604C142.338 0.999999 142.964 1.26667 143.484 1.8C144.018 2.32 144.284 2.94667 144.284 3.68V7.32C144.284 8.06667 144.018 8.70667 143.484 9.24C142.964 9.76 142.338 10.02 141.604 10.02H133.704V15ZM139.964 6.88C140.124 6.88 140.264 6.82667 140.384 6.72C140.504 6.6 140.564 6.45333 140.564 6.28V4.72C140.564 4.56 140.504 4.42 140.384 4.3C140.264 4.18 140.124 4.12 139.964 4.12H133.704V6.88H139.964Z"
                    fill="#828282"
                  />
                  <path
                    d="M164.934 15H155.094C154.361 15 153.728 14.74 153.194 14.22C152.674 13.6867 152.414 13.0533 152.414 12.32V3.68C152.414 2.94667 152.674 2.32 153.194 1.8C153.728 1.26667 154.361 0.999999 155.094 0.999999H164.934V4.12H156.734C156.574 4.12 156.434 4.18 156.314 4.3C156.194 4.42 156.134 4.56 156.134 4.72V6.44H163.734V9.56H156.134V11.28C156.134 11.44 156.194 11.58 156.314 11.7C156.434 11.82 156.574 11.88 156.734 11.88H164.934V15ZM181.34 15H177.02L173.46 10.52L169.88 15H165.56L171.3 7.82L165.86 0.999999H170.18L173.46 5.1L176.74 0.999999H181.04L175.62 7.82L181.34 15ZM186.129 15H182.409V0.999999H194.029C194.762 0.999999 195.389 1.26667 195.909 1.8C196.442 2.32 196.709 2.94667 196.709 3.68V7.32C196.709 8.06667 196.442 8.70667 195.909 9.24C195.389 9.76 194.762 10.02 194.029 10.02H186.129V15ZM192.389 6.88C192.549 6.88 192.689 6.82667 192.809 6.72C192.929 6.6 192.989 6.45333 192.989 6.28V4.72C192.989 4.56 192.929 4.42 192.809 4.3C192.689 4.18 192.549 4.12 192.389 4.12H186.129V6.88H192.389ZM210.693 15H200.853C200.12 15 199.486 14.74 198.953 14.22C198.433 13.6867 198.173 13.0533 198.173 12.32V3.68C198.173 2.94667 198.433 2.32 198.953 1.8C199.486 1.26667 200.12 0.999999 200.853 0.999999H210.693V4.12H202.493C202.333 4.12 202.193 4.18 202.073 4.3C201.953 4.42 201.893 4.56 201.893 4.72V6.44H209.493V9.56H201.893V11.28C201.893 11.44 201.953 11.58 202.073 11.7C202.193 11.82 202.333 11.88 202.493 11.88H210.693V15ZM227.378 15H222.898L218.138 10.02H216.198V15H212.478V0.999999H224.098C224.831 0.999999 225.458 1.26667 225.978 1.8C226.511 2.32 226.778 2.94667 226.778 3.68V7.32C226.778 8.06667 226.511 8.70667 225.978 9.24C225.458 9.76 224.831 10.02 224.098 10.02H222.598L227.378 15ZM222.458 6.88C222.618 6.88 222.758 6.82667 222.878 6.72C222.998 6.6 223.058 6.45333 223.058 6.28V4.72C223.058 4.56 222.998 4.42 222.878 4.3C222.758 4.18 222.618 4.12 222.458 4.12H216.198V6.88H222.458ZM232.571 15H228.851V0.999999H232.571V15ZM247.194 15H237.354C236.62 15 235.987 14.74 235.454 14.22C234.934 13.6867 234.674 13.0533 234.674 12.32V3.68C234.674 2.94667 234.934 2.32 235.454 1.8C235.987 1.26667 236.62 0.999999 237.354 0.999999H247.194V4.12H238.994C238.834 4.12 238.694 4.18 238.574 4.3C238.454 4.42 238.394 4.56 238.394 4.72V6.44H245.994V9.56H238.394V11.28C238.394 11.44 238.454 11.58 238.574 11.7C238.694 11.82 238.834 11.88 238.994 11.88H247.194V15ZM263.879 15H260.159L252.699 6.3V15H248.979V0.999999H252.699L260.159 9.7V0.999999H263.879V15ZM278.474 15H268.634C267.901 15 267.268 14.74 266.734 14.22C266.214 13.6867 265.954 13.0533 265.954 12.32V3.68C265.954 2.94667 266.214 2.32 266.734 1.8C267.268 1.26667 267.901 0.999999 268.634 0.999999H278.474V4.12H270.274C270.114 4.12 269.974 4.18 269.854 4.3C269.734 4.42 269.674 4.56 269.674 4.72V11.28C269.674 11.44 269.734 11.58 269.854 11.7C269.974 11.82 270.114 11.88 270.274 11.88H278.474V15ZM292.484 15H282.644C281.91 15 281.277 14.74 280.744 14.22C280.224 13.6867 279.964 13.0533 279.964 12.32V3.68C279.964 2.94667 280.224 2.32 280.744 1.8C281.277 1.26667 281.91 0.999999 282.644 0.999999H292.484V4.12H284.284C284.124 4.12 283.984 4.18 283.864 4.3C283.744 4.42 283.684 4.56 283.684 4.72V6.44H291.284V9.56H283.684V11.28C283.684 11.44 283.744 11.58 283.864 11.7C283.984 11.82 284.124 11.88 284.284 11.88H292.484V15Z"
                    fill="#AB373A"
                  />
                </svg>
              </div>

              <div className="d-flex gap-3 mt-4">
                <div className="form-group w-50">
                  <label>Name of the Dealership?</label>
                  <input
                    type="text"
                    name="nameOfDelership"
                    value={formData.nameOfDelership}
                    onChange={handleInputChange}
                    className="custom-input-atrangi owners-review"
                    placeholder="Enter Dealership Name"
                  />
                </div>

                <div className="form-group w-50">
                  <label>City & Area?</label>
                  <input
                    type="text"
                    name="cityAndArea"
                    value={formData.cityAndArea}
                    onChange={handleInputChange}
                    className="custom-input-atrangi owners-review"
                    placeholder="Enter City & Area"
                  />
                </div>
              </div>

              <div className="w-100 selectbard">
                <div className="flex w-100 mt-2">
                  <label>What’s your emotion with the car?</label>

                  <input
                    type="range"
                    className="form-range w-100"
                    min="0"
                    max="4"
                    step="1"
                    value={formData.whatsYourEmotion}
                    onChange={handleEmotionChange}
                    id="customRange1"
                  />
                  <div className="d-flex new-bar justify-content-between">
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
                <div className="form-group w-100 mb-1">
                  <label>Why did you choose this Dealership?</label>
                </div>
              </div>

              <div className="d-flex gap-3 mt-2">
                <div className="form-group w-100 d-flex flex-column gap-1">
                  {[
                    "Near me",
                    "Better Deal",
                    "Better by Experience",
                    "Recommended By Someone",
                  ].map((option, index) => (
                    <div
                      className="form-check d-flex align-items-center"
                      key={index}
                    >
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
                        className="form-check-label"
                        htmlFor={`dealership-option-${index}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex gap-3 mt-2">
                <div className="form-group w-100 mb-1">
                  <label>Did the Dealership force sell you anything?</label>
                </div>
              </div>

              <div className="d-flex gap-3 mt">
                <div className="form-group w-100 d-flex flex-column gap-1">
                  {[
                    "Space",
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
                        className="form-check-input"
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
                        className="form-check-label"
                        htmlFor={`forced-sale-option-${index}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex gap-3 mt-3">
                <div className="form-group w-100">
                  <div className="brand-model">
                    Would you recommend this dealer for Car buyers?
                  </div>
                </div>

                <div className="form-group w-25 d-flex justify-content-end">
                  <select
                    className="form-select"
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

            <div>
              <div className="cars-details mt-3">
                <svg
                  width="348"
                  height="22"
                  viewBox="0 0 348 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.9562 15.4492H0.376211V12.3292H9.31621C9.48954 12.3292 9.62954 12.2692 9.73621 12.1492C9.85621 12.0292 9.91621 11.8892 9.91621 11.7292V10.6092C9.91621 10.4492 9.85621 10.3092 9.73621 10.1892C9.62954 10.0692 9.48954 10.0092 9.31621 10.0092H2.91621C2.18288 10.0092 1.54954 9.74922 1.01621 9.22922C0.496211 8.70922 0.236211 8.07588 0.236211 7.32922V4.12922C0.236211 3.39588 0.496211 2.76922 1.01621 2.24922C1.54954 1.71588 2.18288 1.44922 2.91621 1.44922H13.3362V4.56922H4.55621C4.39621 4.56922 4.25621 4.62922 4.13621 4.74922C4.01621 4.86922 3.95621 5.00922 3.95621 5.16922V6.28922C3.95621 6.44922 4.01621 6.58922 4.13621 6.70922C4.25621 6.82922 4.39621 6.88922 4.55621 6.88922H10.9562C11.7029 6.88922 12.3362 7.14922 12.8562 7.66922C13.3762 8.18922 13.6362 8.82255 13.6362 9.56922V12.7692C13.6362 13.5026 13.3762 14.1359 12.8562 14.6692C12.3362 15.1892 11.7029 15.4492 10.9562 15.4492ZM27.9607 15.4492H18.1207C17.3874 15.4492 16.7541 15.1892 16.2207 14.6692C15.7007 14.1359 15.4407 13.5026 15.4407 12.7692V4.12922C15.4407 3.39588 15.7007 2.76922 16.2207 2.24922C16.7541 1.71588 17.3874 1.44922 18.1207 1.44922H27.9607V4.56922H19.7607C19.6007 4.56922 19.4607 4.62922 19.3407 4.74922C19.2207 4.86922 19.1607 5.00922 19.1607 5.16922V6.88922H26.7607V10.0092H19.1607V11.7292C19.1607 11.8892 19.2207 12.0292 19.3407 12.1492C19.4607 12.2692 19.6007 12.3292 19.7607 12.3292H27.9607V15.4492ZM44.6459 15.4492H40.1659L35.4059 10.4692H33.4659V15.4492H29.7459V1.44922H41.3659C42.0992 1.44922 42.7259 1.71588 43.2459 2.24922C43.7792 2.76922 44.0459 3.39588 44.0459 4.12922V7.76922C44.0459 8.51589 43.7792 9.15589 43.2459 9.68922C42.7259 10.2092 42.0992 10.4692 41.3659 10.4692H39.8659L44.6459 15.4492ZM39.7259 7.32922C39.8859 7.32922 40.0259 7.27588 40.1459 7.16922C40.2659 7.04922 40.3259 6.90255 40.3259 6.72922V5.16922C40.3259 5.00922 40.2659 4.86922 40.1459 4.74922C40.0259 4.62922 39.8859 4.56922 39.7259 4.56922H33.4659V7.32922H39.7259ZM55.2823 15.4492H50.8023L44.7023 1.44922H48.7223L53.0423 11.3492L57.3623 1.44922H61.3823L55.2823 15.4492ZM66.055 15.4492H62.335V1.44922H66.055V15.4492ZM80.6779 15.4492H70.8379C70.1046 15.4492 69.4713 15.1892 68.9379 14.6692C68.4179 14.1359 68.1579 13.5026 68.1579 12.7692V4.12922C68.1579 3.39588 68.4179 2.76922 68.9379 2.24922C69.4713 1.71588 70.1046 1.44922 70.8379 1.44922H80.6779V4.56922H72.4779C72.3179 4.56922 72.1779 4.62922 72.0579 4.74922C71.9379 4.86922 71.8779 5.00922 71.8779 5.16922V11.7292C71.8779 11.8892 71.9379 12.0292 72.0579 12.1492C72.1779 12.2692 72.3179 12.3292 72.4779 12.3292H80.6779V15.4492ZM94.6873 15.4492H84.8473C84.114 15.4492 83.4806 15.1892 82.9473 14.6692C82.4273 14.1359 82.1673 13.5026 82.1673 12.7692V4.12922C82.1673 3.39588 82.4273 2.76922 82.9473 2.24922C83.4806 1.71588 84.114 1.44922 84.8473 1.44922H94.6873V4.56922H86.4873C86.3273 4.56922 86.1873 4.62922 86.0673 4.74922C85.9473 4.86922 85.8873 5.00922 85.8873 5.16922V6.88922H93.4873V10.0092H85.8873V11.7292C85.8873 11.8892 85.9473 12.0292 86.0673 12.1492C86.1873 12.2692 86.3273 12.3292 86.4873 12.3292H94.6873V15.4492Z"
                    fill="#828282"
                  />
                  <path
                    d="M115.538 15.4492H105.698C104.965 15.4492 104.331 15.1892 103.798 14.6692C103.278 14.1359 103.018 13.5026 103.018 12.7692V4.12922C103.018 3.39588 103.278 2.76922 103.798 2.24922C104.331 1.71588 104.965 1.44922 105.698 1.44922H115.538V4.56922H107.338C107.178 4.56922 107.038 4.62922 106.918 4.74922C106.798 4.86922 106.738 5.00922 106.738 5.16922V6.88922H114.338V10.0092H106.738V11.7292C106.738 11.8892 106.798 12.0292 106.918 12.1492C107.038 12.2692 107.178 12.3292 107.338 12.3292H115.538V15.4492ZM131.943 15.4492H127.623L124.063 10.9692L120.483 15.4492H116.163L121.903 8.26922L116.463 1.44922H120.783L124.063 5.54922L127.343 1.44922H131.643L126.223 8.26922L131.943 15.4492ZM136.732 15.4492H133.012V1.44922H144.632C145.366 1.44922 145.992 1.71588 146.512 2.24922C147.046 2.76922 147.312 3.39588 147.312 4.12922V7.76922C147.312 8.51589 147.046 9.15589 146.512 9.68922C145.992 10.2092 145.366 10.4692 144.632 10.4692H136.732V15.4492ZM142.992 7.32922C143.152 7.32922 143.292 7.27588 143.412 7.16922C143.532 7.04922 143.592 6.90255 143.592 6.72922V5.16922C143.592 5.00922 143.532 4.86922 143.412 4.74922C143.292 4.62922 143.152 4.56922 142.992 4.56922H136.732V7.32922H142.992ZM161.297 15.4492H151.457C150.723 15.4492 150.09 15.1892 149.557 14.6692C149.037 14.1359 148.777 13.5026 148.777 12.7692V4.12922C148.777 3.39588 149.037 2.76922 149.557 2.24922C150.09 1.71588 150.723 1.44922 151.457 1.44922H161.297V4.56922H153.097C152.937 4.56922 152.797 4.62922 152.677 4.74922C152.557 4.86922 152.497 5.00922 152.497 5.16922V6.88922H160.097V10.0092H152.497V11.7292C152.497 11.8892 152.557 12.0292 152.677 12.1492C152.797 12.2692 152.937 12.3292 153.097 12.3292H161.297V15.4492ZM177.982 15.4492H173.502L168.742 10.4692H166.802V15.4492H163.082V1.44922H174.702C175.435 1.44922 176.062 1.71588 176.582 2.24922C177.115 2.76922 177.382 3.39588 177.382 4.12922V7.76922C177.382 8.51589 177.115 9.15589 176.582 9.68922C176.062 10.2092 175.435 10.4692 174.702 10.4692H173.202L177.982 15.4492ZM173.062 7.32922C173.222 7.32922 173.362 7.27588 173.482 7.16922C173.602 7.04922 173.662 6.90255 173.662 6.72922V5.16922C173.662 5.00922 173.602 4.86922 173.482 4.74922C173.362 4.62922 173.222 4.56922 173.062 4.56922H166.802V7.32922H173.062ZM183.174 15.4492H179.454V1.44922H183.174V15.4492ZM197.797 15.4492H187.957C187.224 15.4492 186.591 15.1892 186.057 14.6692C185.537 14.1359 185.277 13.5026 185.277 12.7692V4.12922C185.277 3.39588 185.537 2.76922 186.057 2.24922C186.591 1.71588 187.224 1.44922 187.957 1.44922H197.797V4.56922H189.597C189.437 4.56922 189.297 4.62922 189.177 4.74922C189.057 4.86922 188.997 5.00922 188.997 5.16922V6.88922H196.597V10.0092H188.997V11.7292C188.997 11.8892 189.057 12.0292 189.177 12.1492C189.297 12.2692 189.437 12.3292 189.597 12.3292H197.797V15.4492ZM214.483 15.4492H210.763L203.303 6.74922V15.4492H199.583V1.44922H203.303L210.763 10.1492V1.44922H214.483V15.4492ZM229.078 15.4492H219.238C218.505 15.4492 217.871 15.1892 217.338 14.6692C216.818 14.1359 216.558 13.5026 216.558 12.7692V4.12922C216.558 3.39588 216.818 2.76922 217.338 2.24922C217.871 1.71588 218.505 1.44922 219.238 1.44922H229.078V4.56922H220.878C220.718 4.56922 220.578 4.62922 220.458 4.74922C220.338 4.86922 220.278 5.00922 220.278 5.16922V11.7292C220.278 11.8892 220.338 12.0292 220.458 12.1492C220.578 12.2692 220.718 12.3292 220.878 12.3292H229.078V15.4492ZM243.087 15.4492H233.247C232.514 15.4492 231.881 15.1892 231.347 14.6692C230.827 14.1359 230.567 13.5026 230.567 12.7692V4.12922C230.567 3.39588 230.827 2.76922 231.347 2.24922C231.881 1.71588 232.514 1.44922 233.247 1.44922H243.087V4.56922H234.887C234.727 4.56922 234.587 4.62922 234.467 4.74922C234.347 4.86922 234.287 5.00922 234.287 5.16922V6.88922H241.887V10.0092H234.287V11.7292C234.287 11.8892 234.347 12.0292 234.467 12.1492C234.587 12.2692 234.727 12.3292 234.887 12.3292H243.087V15.4492Z"
                    fill="#AB373A"
                  />
                </svg>
              </div>

              <div className="d-flex gap-3 mt-3">
                <div className="form-group w-100">
                  <div className="brand-model">
                    Have you Serviced your Car yet?
                  </div>
                </div>
                <div className="form-group w-25 d-flex justify-content-end">
                  <select
                    className="form-select"
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
                <div className="brand-model">
                  Did you get your car serviced at the same Dealership or
                  another? If Another, Why?
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="Same"
                    id="sameDealership"
                    onChange={handleServiceCheckboxChange}
                    checked={formData.serviceOfcarOnDelership === "Same"}
                    style={{ accentColor: "#B1081A" }}
                  />
                  <label className="form-check-label" htmlFor="sameDealership">
                    Same
                  </label>
                </div>
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input"
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
                    className="form-check-label"
                    htmlFor="anotherDealership"
                  >
                    Another
                  </label>
                </div>
                {formData.serviceOfcarOnDelership === "Another" && (
                  <input
                    type="text"
                    name="dealerName"
                    className="custom-input-atrangi owners-review"
                    placeholder="Name of the Dealer"
                    value={formData.dealerName} // Bind the state for dealership name
                    onChange={handleDealerNameChange}
                  />
                )}
              </div>

              <div className="d-flex flex-column mt-4">
                <div className="form-group">
                  <label>
                    Anything you want to share about your Dealership service
                    Experience
                  </label>
                  <input
                    type="text"
                    name="serviceExperience"
                    className="custom-input-atrangi owners-review"
                    placeholder=""
                    value={formData.serviceExperience}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Any tips for the people who are servicing this Car?
                  </label>
                  <input
                    type="text"
                    name="tipForpeopleForService"
                    className="custom-input-atrangi owners-review"
                    placeholder=""
                    value={formData.tipForpeopleForService}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex w-100 mt-2">
                <label>
                  Rate the Overall Service Experience (service cost, service
                  timeline, transparency, service Advisor)
                </label>
                <input
                  type="range"
                  className="form-range w-100"
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
                <div className="d-flex new-bar justify-content-between">
                  {["Very Bad", "Bad", "Neutral", "Good", "Very Good"].map(
                    (label, index) => (
                      <span
                        key={index}
                        className={
                          formData.serviceOfcarOnDelership ===
                          ["veryBad", "sad", "neutral", "good", "veryGood"][
                            index
                          ]
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

              <div className="d-flex flex-column mt-4">
                <div className="form-group">
                  <label>
                    Approx. Service cost - Our team will connect later asking
                    for invoices to Verify
                  </label>
                  <textarea
                    name="approxServiceCost"
                    className="custom-input-atrangi owners-review"
                    placeholder=""
                    value={formData.approxServiceCost}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Your Story</label>
                  <textarea
                    name="yourStory"
                    className="custom-input-atrangi owners-review"
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
              <div className="d-flex justify-content-center align-items-center">
                <button className="next-button" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </>
        );
      case 999: // Special case when the form is invalid
        return (
          <div className="image-container" style={{ textAlign: "center" }}>
            <img
              src={plane}
              alt="Image"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        );
      default:
        return <div>Page {currentPage} Content</div>;
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen width is mobile (example: 768px or less)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check the initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="changecar-product-container">
      {/* Button to open the popup */}
      {/* <div className="changecar-product" onClick={openPopup}>
        SHARE A REVIEW
      </div> */}

      <Link onClick={openPopup}>Share Reviews </Link>

      {/* Popup */}
      {isOpen && (
        <div className="popup-overlay ">
          <div
            className="popup-content-2 tmesharebuton d-flex flex-column"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the popup from closing it
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

            <div>
              {isMobile ? (
                // Mobile view: render all pages at once without navigation buttons
                <div>
                  {renderPageContentMob()}
                  {/* Add content for other pages as needed */}
                </div>
              ) : (
                // Desktop view: navigation buttons
                <div>
                  {renderPageContent()}
                  <div className={`form-group d-flex mt-3`}>
                    {currentPage !== 999 && (
                      <>
                        {currentPage > 1 && (
                          <button
                            className="next-button"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            Previous
                          </button>
                        )}
                        {currentPage < 8 ? (
                          <button
                            className="next-button"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            className="next-button"
                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Sharereviews;
