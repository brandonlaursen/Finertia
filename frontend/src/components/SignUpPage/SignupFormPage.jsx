import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./SignupFormPage.css";
import { FaSpaceShuttle } from "react-icons/fa";
import { IoPlanetOutline } from "react-icons/io5";
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

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors({});
      try {
        dispatch(
          signup({
            email,
            username,
            firstName,
            lastName,
            password,
          })
        );
      } catch (res) {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      }
    } else {
      setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
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
          We'll need your name, email address, and a unique password. You'll use
          this login to access Robinhood next time.
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
          <form onSubmit={handleSubmit} className="signup-page-form">
            <div className="signup-form-top">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First Name"
              />

              {errors.firstName && <p>{errors.firstName}</p>}

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last Name"
              />

              {errors.lastName && <p>{errors.lastName}</p>}
            </div>

            <div className="signup-form-bottom">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
              {errors.email && <p>{errors.email}</p>}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
              />
              {errors.username && <p>{errors.username}</p>}

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
              {errors.password && <p>{errors.password}</p>}
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
              {/* <button type="submit">Sign Up</button> */}
            </div>
          </form>
        </div>

        <div className="signup-page-bottom-right">
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;
