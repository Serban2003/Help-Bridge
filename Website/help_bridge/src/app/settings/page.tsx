"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export default function SettingsPage() {
  // Fake user / helper data
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+40 712 345 678",
    avatar: "/images/default_avatar.svg",
  });

  const [helper, setHelper] = useState({
    firstName: "Alice",
    lastName: "Smith",
    description: "Expert IT consultant",
    experience: "5 years",
    phone: "+40 723 456 789",
    email: "alice@itco.com",
    category: "IT",
    company: { 
      logo: "/images/default_avatar.svg", 
      name: "IT Solutions SRL", 
      desc: "We solve your IT problems", 
      address: "Str. Exemplu nr. 5" 
    },
    avatar: "/images/default_avatar.svg",
  });

  // edit modal states
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [showHelperEdit, setShowHelperEdit] = useState(false);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);

  return (
    <Container className="py-5">
      {/* Ștergere cont */}
      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-danger">Delete account</Button>
      </div>

      {/* Secțiunea USER */}
      <h2>User Settings</h2>
      <Row className="align-items-center mb-5">
        <Col md={4} className="text-center">
          <img
            src={user.avatar}
            alt="User avatar"
            className="rounded-circle"
            style={{ width: 150, height: 150, objectFit: "cover" }}
          />
          <div className="mt-3">
            <Button onClick={() => setShowUserEdit(true)}>Edit avatar</Button>
          </div>
        </Col>
        <Col md={8}>
          <dl>
            <dt>First name</dt><dd>{user.firstName}</dd>
            <dt>Last name</dt><dd>{user.lastName}</dd>
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Phone</dt><dd>{user.phone}</dd>
          </dl>
          <Button onClick={() => setShowUserEdit(true)}>Edit user info</Button>
        </Col>
      </Row>

      {/* Secțiunea HELPER */}
      <h2>Helper Settings</h2>
      <Row className="align-items-center mb-5">
        <Col md={4} className="text-center">
          <img
            src={helper.avatar}
            alt="Helper avatar"
            className="rounded-circle"
            style={{ width: 150, height: 150, objectFit: "cover" }}
          />
          <div className="mt-3">
            <Button onClick={() => setShowHelperEdit(true)}>Edit avatar</Button>
          </div>
        </Col>
        <Col md={8}>
          <dl>
            <dt>First name</dt><dd>{helper.firstName}</dd>
            <dt>Last name</dt><dd>{helper.lastName}</dd>
            <dt>Description</dt><dd>{helper.description}</dd>
            <dt>Experience</dt><dd>{helper.experience}</dd>
            <dt>Phone</dt><dd>{helper.phone}</dd>
            <dt>Email</dt><dd>{helper.email}</dd>
            <dt>Category</dt><dd>{helper.category}</dd>
            <dt>Company</dt>
            <dd>
              {helper.company.name}{" "}
              <Button variant="link" onClick={() => setShowCompanyInfo(true)}>
                View company
              </Button>
            </dd>
          </dl>
          <Button onClick={() => setShowHelperEdit(true)}>Edit helper info</Button>
        </Col>
      </Row>

      {/* Modal Edit User */}
      <Modal show={showUserEdit} onHide={() => setShowUserEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Avatar upload */}
            <Form.Group controlId="userAvatar" className="mb-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control
                type="text"
                value={user.avatar}
                onChange={e => setUser({ ...user, avatar: e.target.value })}
              />
            </Form.Group>
            {/* Celelalte câmpuri */}
            {["firstName","lastName","email","phone"].map(field => (
              <Form.Group controlId={field} className="mb-3" key={field}>
                <Form.Label>{field.replace(/([A-Z])/g, " $1")}</Form.Label>
                <Form.Control
                  type="text"
                  value={(user as any)[field]}
                  onChange={e =>
                    setUser({ ...user, [field]: e.target.value })
                  }
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowUserEdit(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Edit Helper */}
      <Modal show={showHelperEdit} onHide={() => setShowHelperEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Helper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="helperAvatar" className="mb-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control
                type="text"
                value={helper.avatar}
                onChange={e => setHelper({ ...helper, avatar: e.target.value })}
              />
            </Form.Group>
            {["firstName","lastName","description","experience","phone","email","category"].map(field => (
              <Form.Group controlId={field} className="mb-3" key={field}>
                <Form.Label>{field.replace(/([A-Z])/g, " $1")}</Form.Label>
                <Form.Control
                  type="text"
                  value={(helper as any)[field]}
                  onChange={e =>
                    setHelper({ ...helper, [field]: e.target.value })
                  }
                />
              </Form.Group>
            ))}
            {/* Company fields */}
            <Form.Group controlId="companyName" className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                value={helper.company.name}
                onChange={e =>
                  setHelper({
                    ...helper,
                    company: { ...helper.company, name: e.target.value },
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="companyDesc" className="mb-3">
              <Form.Label>Company Description</Form.Label>
              <Form.Control
                type="text"
                value={helper.company.desc}
                onChange={e =>
                  setHelper({
                    ...helper,
                    company: { ...helper.company, desc: e.target.value },
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="companyAddress" className="mb-3">
              <Form.Label>Company Address</Form.Label>
              <Form.Control
                type="text"
                value={helper.company.address}
                onChange={e =>
                  setHelper({
                    ...helper,
                    company: { ...helper.company, address: e.target.value },
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="companyLogo" className="mb-3">
              <Form.Label>Company Logo URL</Form.Label>
              <Form.Control
                type="text"
                value={helper.company.logo}
                onChange={e =>
                  setHelper({
                    ...helper,
                    company: { ...helper.company, logo: e.target.value },
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHelperEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowHelperEdit(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Company Info */}
      <Modal show={showCompanyInfo} onHide={() => setShowCompanyInfo(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Company Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <img
              src={helper.company.logo}
              alt="Company logo"
              style={{ width: 100, height: 100, objectFit: "contain" }}
            />
          </div>
          <h5>{helper.company.name}</h5>
          <p>{helper.company.desc}</p>
          <p><strong>Address:</strong> {helper.company.address}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCompanyInfo(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
