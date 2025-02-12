import "./LoginPage.css";
import { LuInfo } from "react-icons/lu";
import { MdRemoveRedEye } from "react-icons/md";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import { login } from "../../../store/session";

function LoginPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // ! Refactor to dynamically handle errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await dispatch(login({ credential, password }));
      return res;
    } catch (res) {
      const data = await res.json();
      if (data.errors) setErrors(data.errors);
    }
  };

  if (sessionUser) return <Navigate to="/" replace={true} />;

  return (
    <div className="LoginPage">
      <div className="LoginPage__aside"></div>

      <div className="LoginPage__form-container">
        <form onSubmit={handleSubmit} className="LoginPage__form">
          <p>Log In to Finertia</p>
          <label>Email</label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value.trim())}
            required
          />

          <label>Password</label>

          <div className="LoginPage__form__password">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <MdRemoveRedEye
              className="LoginPage__form__password-icon"
              onClick={handlePasswordToggle}
            />
          </div>

          {errors.credential && (
            <p className="LoginPage__form__errors">
              <LuInfo className="LoginPage__form__errors__icon" />{" "}
              {errors.credential}
            </p>
          )}

          <div className="LoginPage__form__buttons">
            <button type="submit">Log In</button>
            <Link to="/signup">
              <button
                type="button"
                id="LoginPage__form__buttons__create__account"
              >
                Create Account
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
