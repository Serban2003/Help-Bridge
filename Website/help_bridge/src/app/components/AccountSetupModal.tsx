"use client";

import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Company } from "@/app/models/Company";
import { User as UserModel } from "@/app/models/User";
import { Helper as HelperModel } from "@/app/models/Helper";
import {
  User,
  Phone,
  Building,
  FileText,
  Briefcase,
  Layers3,
} from "lucide-react";
import { useAuth } from "@/app/models/AuthContext";
import "./LoginRegisterModal.css";
import "./../globals.css";

interface AccountSetupModalProps {
  show: boolean;
  handleClose: () => void;
  onSetupComplete: () => void;
  registerRole: string;
  registerEmail: string;
  registerPassword: string;
}

interface Category {
  HC_id: number;
  Name: string;
}

const AccountSetupModal = ({
  show,
  handleClose,
  onSetupComplete,
  registerRole,
  registerEmail,
  registerPassword,
}: AccountSetupModalProps) => {
  const { login } = useAuth();
  const [validated, setValidated] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [customCompanyDescription, setCustomCompanyDescription] = useState("");
  const [customCompanyAddress, setCustomCompanyAddress] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const phoneRegex =
    /^(\+?[1-9]{1,3}\s?)?(\(?\d{3}\)?)?[\s-]?\d{3}[\s-]?\d{4}$/;

  useEffect(() => {
    if (show && registerRole === "helper") {
      fetch("http://localhost:5000/api/companies")
        .then((res) => res.json())
        .then((data) => setCompanies(data))
        .catch((err) => console.error("Failed to load companies:", err));

      fetch("http://localhost:5000/api/helper_categories")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Failed to load categories:", err));
    }
  }, [show, registerRole]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Phone format validation
    if (!phoneRegex.test(phone)) {
      setPhoneError("Invalid phone number format.");
      setValidated(true);
      return;
    } else {
      setPhoneError(""); // Clear any previous errors
    }

    let registerSuccess = false;
    let profileImageId: number | null = null;
    let companyLogoId: number | null = null;
    let finalCompanyId = null;

    try {
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", profileImage);

        const imageResponse = await fetch("http://localhost:5000/api/images", {
          method: "POST",
          body: imageFormData,
        });

        if (!imageResponse.ok) throw new Error("Image upload failed.");
        const imageData = await imageResponse.json();
        profileImageId = imageData.I_id;
        console.log("Image ID:", profileImageId);
      }

      if (registerRole === "user") {
        const user = new UserModel(
          0,
          firstname,
          lastname,
          registerEmail,
          registerPassword,
          phone,
          profileImageId,
          new Date()
        );

        const userRes = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: user.Firstname,
            lastname: user.Fastname,
            email: user.Email,
            password: user.Password,
            phone: user.Phone,
            I_id: user.I_id,
          }),
        });

        if (!userRes.ok) throw new Error("User registration failed.");
        registerSuccess = true;
      } else {
        finalCompanyId =
          selectedCompany === "other" ? 0 : parseInt(selectedCompany);

        if (selectedCompany === "other") {
          if (companyLogo) {
            const imageFormData = new FormData();
            imageFormData.append("image", companyLogo);

            const imageResponse = await fetch(
              "http://localhost:5000/api/images",
              {
                method: "POST",
                body: imageFormData,
              }
            );

            if (!imageResponse.ok) throw new Error("Image upload failed.");
            const imageData = await imageResponse.json();
            companyLogoId = imageData.I_id;
            console.log("Image ID:", companyLogoId);
          }

          const companyResponse = await fetch(
            "http://localhost:5000/api/companies",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: customCompanyName,
                description: customCompanyDescription,
                address: customCompanyAddress,
                I_id: companyLogoId,
              }),
            }
          );

          if (!companyResponse.ok) throw new Error("Company creation failed.");
          const newCompany = await companyResponse.json();
          finalCompanyId = newCompany.C_id;
        }

        const helper = new HelperModel(
          0,
          parseInt(selectedCategory),
          finalCompanyId,
          firstname,
          lastname,
          description,
          parseInt(experience),
          registerEmail,
          registerPassword,
          phone,
          profileImageId,
          new Date()
        );

        const helperRes = await fetch("http://localhost:5000/api/helpers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: helper.Firstname,
            lastname: helper.Lastname,
            email: helper.Email,
            password: helper.Password,
            phone: helper.Phone,
            description: helper.Description,
            experience: helper.Experience,
            HC_id: helper.HC_id,
            C_id: helper.C_id,
            I_id: helper.I_id,
          }),
        });

        if (!helperRes.ok) throw new Error("Helper registration failed.");
        registerSuccess = true;
      }

      // Only attempt login if registration succeeded
      if (registerSuccess) {
        const loginRes = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
          }),
        });

        if (!loginRes.ok) {
          throw new Error("Auto-login failed after registration.");
        }

        const { role, data } = await loginRes.json();
        login({ role, data });

        onSetupComplete();
        resetForm();
      }
    } catch (err) {
      // Attempt to delete the uploaded image if registration fails
      if (profileImageId) {
        try {
          await fetch(`http://localhost:5000/api/images?id=${profileImageId}`, {
            method: "DELETE",
          });
        } catch (deleteErr) {
          console.error("Failed to delete uploaded profile image:", deleteErr);
        }
      }

      // Attempt to delete the uploaded company logo if registration fails
      if (companyLogoId) {
        try {
          await fetch(`http://localhost:5000/api/images?id=${companyLogoId}`, {
            method: "DELETE",
          });
        } catch (deleteErr) {
          console.error("Failed to delete uploaded company logo:", deleteErr);
        }
      }

      // Attempt to delete the newly created company if registration fails
      if (finalCompanyId) {
        try {
          await fetch(
            `http://localhost:5000/api/companies?id=${finalCompanyId}`,
            {
              method: "DELETE",
            }
          );
        } catch (deleteErr) {
          console.error("Failed to delete created company:", deleteErr);
        }
      }

      let errorMsg = "Registration failed. Please try again.";
      if (err instanceof Error) {
        if (err.message.includes("Image upload failed")) {
          errorMsg = "Profile image upload failed. Please try again.";
        } else if (err.message.includes("User registration failed")) {
          errorMsg = "User registration failed. Please verify your details.";
        } else if (err.message.includes("Helper registration failed")) {
          errorMsg =
            "Helper registration failed. Please check the form and try again.";
        } else if (err.message.includes("Company creation failed")) {
          errorMsg = "Company registration failed. Please check your inputs.";
        }
      } else {
        errorMsg = "An unexpected error occurred. Please try again.";
      }

      setErrorMessage(errorMsg);
      console.error(err);
    }
  };

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setPhone("");
    setPhoneError("");
    setDescription("");
    setExperience("");
    setSelectedCompany("");
    setSelectedCategory("");
    setCustomCompanyName("");
    setCustomCompanyDescription("");
    setCustomCompanyAddress("");
    setProfileImage(null);
    setCompanyLogo(null);
    setErrorMessage(null); // Clear error message
    setValidated(false);
  };
  
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>
          {registerRole === "helper"
            ? "Helper Account Setup"
            : "User Account Setup"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFirstname">
            <Form.Label>
              <User size={16} className="me-2" /> Firstname
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastname">
            <Form.Label>
              <User size={16} className="me-2" /> Lastname
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>
              <Phone size={16} className="me-2" /> Phone Number
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={!!phoneError}
            />
            <Form.Control.Feedback type="invalid">
              {phoneError || "Please enter your phone number."}
            </Form.Control.Feedback>
          </Form.Group>

          {registerRole === "helper" && (
            <>
              <Form.Group className="mb-3" controlId="formCategory">
                <Form.Label>
                  <Layers3 size={16} className="me-2" /> Category
                </Form.Label>
                <Form.Select
                  required
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.HC_id} value={cat.HC_id}>
                      {cat.Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>
                  <FileText size={16} className="me-2" /> Description
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExperience">
                <Form.Label>
                  <Briefcase size={16} className="me-2" /> Experience (months)
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCompany">
                <Form.Label>
                  <Building size={16} className="me-2" /> Company
                </Form.Label>
                <Form.Select
                  required
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="">Select your company</option>
                  {companies.map((c) => (
                    <option key={c.C_id} value={c.C_id}>
                      {c.Name}
                    </option>
                  ))}
                  <option value="other">My company is not listed</option>
                </Form.Select>
              </Form.Group>

              {selectedCompany === "other" && (
                <div className="border p-3 bg-light rounded mb-3">
                  <Form.Group
                    className="mb-3"
                    controlId="formCustomCompanyName"
                  >
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="formCustomCompanyDescription"
                  >
                    <Form.Label>Company Description</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      rows={3}
                      value={customCompanyDescription}
                      onChange={(e) =>
                        setCustomCompanyDescription(e.target.value)
                      }
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="formCustomCompanyAddress"
                  >
                    <Form.Label>Company Address</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={customCompanyAddress}
                      onChange={(e) => setCustomCompanyAddress(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formCompanyLogo">
                    <Form.Label>Upload Company Logo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setCompanyLogo(
                          (e.target as HTMLInputElement).files?.[0] || null
                        )
                      }
                    />
                  </Form.Group>
                </div>
              )}
            </>
          )}
          <Form.Group className="mb-3" controlId="formProfileImage">
            <Form.Label>Upload Profile Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfileImage(
                  (e.target as HTMLInputElement).files?.[0] || null
                )
              }
            />
          </Form.Group>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button
              variant="danger"
              type="button"
              className="w-50"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="w-50 custom-button"
            >
              Submit
            </Button>
          </div>
          {errorMessage && (
             <p className="text-danger text-center mt-2 pb-0">
             {errorMessage}
           </p>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AccountSetupModal;
