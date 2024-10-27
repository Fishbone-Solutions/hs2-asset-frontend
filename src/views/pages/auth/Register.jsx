import React, { useState, useEffect } from "react";
import Footer from "components/Footer/Footer";
import AuthNavbar from "components/Navbars/AuthNavbar";
import { RxCross2 } from "react-icons/rx";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    preferred_user_id: "",
    re_password: "",
  });
  const [registerEmailState, setRegisterEmailState] = useState("");

  const handleLogin = () => {
    // Logic for login/signup
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const verifyEmail = (value) => {
    const emailRex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRex.test(value);
  };

  useEffect(() => {
    document.body.classList.toggle("register-page");
    return () => {
      document.body.classList.toggle("register-page");
    };
  }, []);

  return (
    <div className="login-page">
      <AuthNavbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 ml-auto mr-auto width-login">
            <p className="supporting-text">Supporting Reusability</p>
            <p className="platform-title">
              <span>HS2 </span>
              <span>Exchange Platform</span>
              <span className="version">Beta Version</span>
            </p>

            <form className="card p-4 shadow card-login">
              <h4 className="text-center fw-bold mb-3 text-white">
                Create Account
              </h4>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#36454F" }}>
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#36454F" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#36454F" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  className={`form-control ${
                    registerEmailState === "has-danger" ? "is-invalid" : ""
                  } ${registerEmailState === "has-success" ? "is-valid" : ""}`}
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!verifyEmail(value)) {
                      setRegisterEmailState("has-danger");
                    } else {
                      setRegisterEmailState("has-success");
                    }
                    setFormData((prevState) => ({
                      ...prevState,
                      email: value,
                    }));
                  }}
                  required
                />
                {registerEmailState === "has-danger" && (
                  <div className="invalid-feedback">
                    Please enter a valid email address.
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#36454F" }}>
                  Preferred User ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="preferred_user_id"
                  value={formData.preferred_user_id}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#36454F" }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#36454F" }}>
                  Retype Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="re_password"
                  value={formData.re_password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 mt-4"
                style={{ backgroundColor: "rgb(82,203,206)" }}
                onClick={handleLogin}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <div className="full-page-background" />
    </div>
  );
}

export default Register;
