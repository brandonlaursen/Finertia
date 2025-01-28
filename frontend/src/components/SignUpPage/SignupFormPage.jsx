import "./SignupFormPage.css";
import { FaSpaceShuttle } from "react-icons/fa";
import { IoPlanetOutline } from "react-icons/io5";
import { LuInfo } from "react-icons/lu";
import { MdRemoveRedEye } from "react-icons/md";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import { signup } from "../../../store/session";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordMatch:
          "Confirm Password field must be the same as the Password field",
      }));
    } else {
      setErrors((prevErrors) => {
        const { ...errors } = prevErrors;
        delete errors["passwordMatch"];
        return errors;
      });
    }
  }, [password, confirmPassword]);

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handlePasswordToggle = () => {
    console.log(showPassword);
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordToggle = () => {
    console.log(showConfirmPassword);
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(
        signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      );

      if (res.ok) {
        return res;
      }
    } catch (errors) {
      const data = await errors.json();
      setErrors(data.errors);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-page-left">
        <div className="signup-page-top-left" onClick={() => navigate("/")}>
          {" "}
          <FaSpaceShuttle />
          Finertia
        </div>

        <div className="signup-page-mid-left-1">
          Create your login
          <p></p>
        </div>

        <div className="signup-page-mid-left-2">
          We&apos;ll need your name, email address, and a unique password.
          You&apos;ll use this login to access Finertia next time.
        </div>

        <div className="signup-page-bottom-left">
          <IoPlanetOutline className="signup-image" />
        </div>
      </div>

      <div className="signup-page-right">
        <div className="signup-page-top-right">
          Enter your first and last name as they appear on your government ID.
        </div>

        <div className="signup-page-form-container">
          <form onSubmit={handleSubmit2} className="signup-page-form">
            <div className="signup-form-top">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
              />

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
              />
            </div>

            <div className="signup-form-bottom">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
              />

              <div className="signup-form-password-container">
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                  />
                  <MdRemoveRedEye
                    className="signup-password-icon"
                    onClick={handlePasswordToggle}
                  />
                </div>

                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm Password"
                  />
                  <MdRemoveRedEye
                    className="signup-password-icon"
                    onClick={handleConfirmPasswordToggle}
                  />
                </div>

                <div className="signup-errors">
                  {errors &&
                    Object.values(errors).map((error) => {
                      console.log(error);
                      return (
                        <>
                          <p className="signup-error">
                            {" "}
                            <LuInfo className="info-icon" />
                            {error}
                          </p>
                        </>
                      );
                    })}
                </div>
              </div>

              <button type="submit">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;
