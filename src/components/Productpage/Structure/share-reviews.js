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

  return (
    <div className="changecar-product-container">
      {/* Button to open the popup */}
      {/* <div
        className="bg-[#AB373A] flex justify-center items-center text-white w-[232px] text-[14px] rounded-lg px-6 py-3 shadow-md hover:bg-[#8a2c2e] transition-colors"
        onClick={openPopup}
      >
        SHARE YOUR REVIEW
      </div>
       */}
      <Link to="/owner-review">
        {" "}
        <button className="bg-[#AB373A]  text-white font-bold w-[232px] h-[30px] text-[14px] rounded-lg transition font-[Montserrat] shadow-md shaodw-black/30">
          SHARE YOUR REVIEW
        </button>
      </Link>
      {/* Popup */}
      {isOpen && (
        <div className="popup-overlay ">
          <div
            className="popup-content-2 d-flex flex-column"
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

            {renderPageContent()}

            <div
              className={`form-group d-flex mt-3 ${
                currentPage > 1
                  ? "justify-content-between"
                  : "justify-content-end"
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
      )}
      <ToastContainer />
    </div>
  );
};

export default Sharereviews;
