"use client";

import { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../models/AuthContext";
import { useRouter } from "next/navigation";
import {
  createProfileImage,
  fetchProfileImageById,
  fetchUserById,
  fetchHelperById,
  updateUserById,
  updateHelperById,
  changeUserPassword,
  changeHelperPassword,
  deleteUser,
  deleteHelper,
} from "../utils";
import { ProfileImage } from "../models/ProfileImage";
import { User, UserUpdatePayload } from "../models/User";
import { Helper, HelperUpdatePayload } from "../models/Helper";

export default function SettingsPage() {
  const { auth, loading, profileImageUrl, setProfileImageUrl, logout } =
    useAuth();
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [showHelperEdit, setShowHelperEdit] = useState(false);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>();
  const [helper, setHelper] = useState<any>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userEditError, setUserEditError] = useState<string | null>(null);
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");

  const [companyImageUrl, setCompanyImageUrl] = useState<string>(
    "/images/default-company.png"
  );

  const [categoryId, setCategoryId] = useState<any>(null);
  const [categories, setCategories] = useState<
    { HC_id: number; Name: string }[]
  >([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(
    null
  );
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<
    string | null
  >(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!loading && !auth) {
        router.push("/");
        return;
      }
      if (!auth) return;
      const id = auth.id;
      if (auth.role === "user") {
        try {
          const new_user = await fetchUserById(id);
          if (!new_user) {
            console.error("Failed to fetch user");
            return;
          }
          setUser(new_user);
          fetchImage(new_user.I_id);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      } else {
        try {
          const new_helper = await fetchHelperById(id);
          if (!new_helper) {
            console.error("Failed to fetch helper");
            return;
          }
          setHelper(new_helper);
          setCategoryId(new_helper.HC_id);
          fetchImage(new_helper.I_id);

          fetch("http://localhost:5000/api/helper_categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Failed to load categories:", err));

          const companyRes = await fetch(
            `http://localhost:5000/api/companies?id=${new_helper.C_id}`
          );
          const companyData = await companyRes.json();
          if (!companyData) {
            console.error("Failed to fetch company data");
            return;
          }
          setCompany(companyData);

          if (companyData.I_id) {
            const imageData = await fetchProfileImageById(companyData.I_id);
            if (imageData) {
              setCompanyImageUrl(
                ProfileImage.fromByteArrayToImageUrl(imageData.Data.data)
              );
            } else {
              setCompanyImageUrl("/images/default-company.png"); // fallback if image not found
            }
          } else {
            setCompanyImageUrl("/images/default-company.png"); // fallback if no I_id
          }
        } catch (err) {
          console.error("Failed to fetch helper:", err);
        }
      }
    };

    init();
  }, [auth, loading]);

  const fetchImage = async (id: number | null) => {
    if (!id) return;
    try {
      const imageData = await fetchProfileImageById(id);
      if (imageData) {
        setProfileImageUrl(
          ProfileImage.fromByteArrayToImageUrl(imageData.Data.data)
        );
      }
    } catch {
      console.error("Failed to load profile image");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth) return;

    setIsUpdating(true);

    try {
      createProfileImage(file).then(async function (result) {
        const imageId = result;

        if (auth.role == "user") {
          const updatedUser: UserUpdatePayload = {
            I_id: imageId,
          };
          const new_user = await updateUserById(user.U_id, updatedUser);
          if (!new_user) {
            console.error("Failed to update user");
            return;
          }
          setUser(new_user);
          fetchImage(new_user.I_id);
        } else {
          const updatedHelper: HelperUpdatePayload = {
            I_id: imageId,
          };
          const new_helper = await updateHelperById(helper.H_id, updatedHelper);
          if (!new_helper) {
            console.error("Failed to update helper");
            return;
          }
          setHelper(new_helper);
          fetchImage(new_helper.I_id);
        }
      });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = async () => {
    if (!auth) return;
    setIsSavingUser(true);
    setUserEditError(null);

    try {
      if (auth.role === "user") {
        const updatedUser: UserUpdatePayload = {
          Firstname: firstname,
          Lastname: lastname,
          Phone: phone,
        };

        const updated = await updateUserById(user.U_id, updatedUser);
        if (!updated) throw new Error("User update failed");

        setUser(updated);
        setShowUserEdit(false);
      } else {
        const updatedHelper: HelperUpdatePayload = {
          Firstname: firstname,
          Lastname: lastname,
          Description: description,
          Experience: parseInt(experience.toString()),
          Phone: phone,
          HC_id: categoryId,
        };

        const updated = await updateHelperById(helper.H_id, updatedHelper);
        if (!updated) throw new Error("Helper update failed");

        setHelper(updated);
        setShowHelperEdit(false);
      }
    } catch (err) {
      console.error("Update failed:", err);
      setUserEditError("Something went wrong while saving. Please try again.");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleChangePassword = async () => {
    if (!auth) return;
    const id = auth.id;

    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);

    try {
      if (auth.role === "helper") {
        await changeHelperPassword(id, currentPassword, newPassword);
      } else {
        await changeUserPassword(id, currentPassword, newPassword);
      }

      setPasswordChangeSuccess("Password updated successfully.");

      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 2000);
    } catch (err: any) {
      setPasswordChangeError(err.message || "Something went wrong.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const success =
        auth.role === "user"
          ? await deleteUser(auth.id)
          : await deleteHelper(auth.id);

      if (!success) {
        throw new Error("Account deletion failed.");
      }

      setDeleteSuccess(true);

      setTimeout(() => {
        setShowDeleteModal(false);
        setDeleteSuccess(false);
        logout();
        router.push("/");
      }, 1000);
    } catch (err: any) {
      console.error("Deletion error:", err);
      setDeleteError(
        err.message || "Could not delete account. Please try again later."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="outline-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete account
        </Button>
      </div>

      {auth?.role === "user" && user && (
        <>
          <h2>User Settings</h2>
          <Row className="align-items-center mb-3">
            <Col md={4} className="text-center">
              <img
                src={profileImageUrl}
                alt="User avatar"
                className="rounded-circle"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
              <div className="mt-3">
                <Button
                  className="custom-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUpdating ? "Updating..." : "Change avatar"}
                </Button>
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
            </Col>
            <Col md={8}>
              <dl>
                <dt>Firstname</dt>
                <dd>{user.Firstname}</dd>
                <dt>Lastname</dt>
                <dd>{user.Lastname}</dd>
                <dt>Email</dt>
                <dd>{user.Email}</dd>
                <dt>Phone</dt>
                <dd>{user.Phone}</dd>
                <dd>
                  <span
                    style={{
                      color: "var(--accent-color)",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change password
                  </span>
                </dd>
              </dl>

              <Button
                className="custom-button"
                onClick={() => {
                  setFirstname(user.Firstname);
                  setLastname(user.Lastname);
                  setPhone(user.Phone);
                  setShowUserEdit(true);
                }}
              >
                Edit user info
              </Button>
            </Col>
          </Row>
        </>
      )}

      {auth?.role === "helper" && helper && (
        <>
          <h2>Helper Settings</h2>
          <Row className="align-items-center mb-5">
            <Col md={4} className="text-center">
              <img
                src={profileImageUrl}
                alt="Helper avatar"
                className="rounded-circle"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
              <div className="mt-3">
                <Button
                  className="custom-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUpdating ? "Updating..." : "Change avatar"}
                </Button>
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
            </Col>
            <Col md={8}>
              <dl>
                <dt>Firstname</dt>
                <dd>{helper.Firstname}</dd>
                <dt>Lastname</dt>
                <dd>{helper.Lastname}</dd>
                <dt>Description</dt>
                <dd>{helper.Description}</dd>
                <dt>Experience</dt>
                <dd>{helper.getFormatedExperience()}</dd>
                <dt>Email</dt>
                <dd>{helper.Email}</dd>
                <dt>Phone</dt>
                <dd>{helper.Phone}</dd>
                <dt>Category</dt>
                <dd>
                  {
                    categories.find((cat: any) => cat.HC_id === helper.HC_id)
                      ?.Name
                  }
                </dd>
                <dd>
                  <span
                    style={{
                      color: "var(--accent-color)",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change password
                  </span>
                </dd>
              </dl>
              <Button
                className="custom-button"
                onClick={() => {
                  setFirstname(helper.Firstname);
                  setLastname(helper.Lastname);
                  setDescription(helper.Description);
                  setExperience(helper.Experience);
                  setPhone(helper.Phone);
                  setShowHelperEdit(true);
                }}
              >
                Edit helper info
              </Button>
            </Col>
          </Row>
          {company && (
  <div className="card  shadow-sm">
    <div className="card-body">
      <h5 className="card-title fw-bold mb-3 text-center text-md-start">
        Company Information
      </h5>
      <div className="d-flex flex-column flex-md-row align-items-center gap-3">
        <img
          src={companyImageUrl || "/images/default-company.png"}
          alt="Company Logo"
          className="rounded"
          style={{ width: 120, height: 120, objectFit: "cover" }}
        />
        <div className="text-center text-md-start">
          <p className="mb-1">
            <strong>Name:</strong> {company.Name}
          </p>
          <p className="mb-1">
            <strong>Description:</strong> {company.Description}
          </p>
          <p className="mb-0">
            <strong>Address:</strong> {company.Address}
          </p>
        </div>
      </div>
    </div>
  </div>
)}

        </>
      )}
      {user && (
        <Modal
          show={showUserEdit}
          onHide={() => setShowUserEdit(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="userFirstname" className="mb-3">
                <Form.Label>Firstname</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={user.Firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="userLastname" className="mb-3">
                <Form.Label>Lastname</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={user.Lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="userPhone" className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={user.Phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
            {userEditError && (
              <div className="text-danger text-center mt-3">
                {userEditError}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUserEdit(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="custom-button"
              onClick={() => handleEdit()}
            >
              {isSavingUser ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal Edit Helper */}
      {helper && (
        <Modal
          show={showHelperEdit}
          onHide={() => setShowHelperEdit(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Helper Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="helperFirstname" className="mb-3">
                <Form.Label>Firstname</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={helper.Firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="helperLastname" className="mb-3">
                <Form.Label>Lastname</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={helper.Lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="helperDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={helper.Description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="helperExperience" className="mb-3">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={helper.Experience}
                  onChange={(e) => {
                    setExperience(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="helperPhone" className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={helper.Phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="helperCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.HC_id} value={cat.HC_id}>
                      {cat.Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
            {userEditError && (
              <div className="text-danger text-center mt-3">
                {userEditError}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowHelperEdit(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="custom-button"
              onClick={() => handleEdit()}
            >
              {isSavingUser ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal
        show={showPasswordModal}
        onHide={() => {
          setShowPasswordModal(false);
          setPasswordChangeError(null);
          setPasswordChangeSuccess(null);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="currentPassword" className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="confirmNewPassword" className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>

            {passwordChangeError && (
              <div className="text-danger mt-2 text-center">
                {passwordChangeError}
              </div>
            )}
            {passwordChangeSuccess && (
              <div className="text-success mt-2 text-center">
                {passwordChangeSuccess}
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="custom-button"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setDeleteError(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete your account? This action
          cannot be undone.
          {deleteError && <div className="text-danger my-2">{deleteError}</div>}
          {deleteSuccess && (
            <div className="text-success">
              🎉 Your account has been successfully deleted.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
