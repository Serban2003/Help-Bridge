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
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [customCompanyDescription, setCustomCompanyDescription] = useState("");
  const [customCompanyAddress, setCustomCompanyAddress] = useState("");

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

    try {
      let registerSuccess = false;

      if (registerRole === "user") {
        const user = new UserModel(
          0,
          firstname,
          lastname,
          registerEmail,
          registerPassword,
          phone,
          null,
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
          }),
        });

        if (!userRes.ok) throw new Error("User registration failed.");
        registerSuccess = true;
      } else {
        let finalCompanyId =
          selectedCompany === "other" ? 0 : parseInt(selectedCompany);

        if (selectedCompany === "other") {
          const companyResponse = await fetch(
            "http://localhost:5000/api/companies",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: customCompanyName,
                description: customCompanyDescription,
                address: customCompanyAddress,
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
          null,
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
      alert("Registration failed. Please try again.");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setPhone("");
    setDescription("");
    setExperience("");
    setSelectedCompany("");
    setSelectedCategory("");
    setCustomCompanyName("");
    setCustomCompanyDescription("");
    setCustomCompanyAddress("");
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
            />
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
                <div className="border p-3 bg-light rounded">
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
                </div>
              )}
            </>
          )}

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
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AccountSetupModal;
