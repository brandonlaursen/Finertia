import "./LoginPage.css";
import { LuInfo } from "react-icons/lu";
import { MdRemoveRedEye } from "react-icons/md";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

import { login } from "../../../store/session";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const [isLoading, setIsLoading] = useState(false);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

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
      <aside className="LoginPage__aside" />

      <main className="LoginPage__main">
        <form onSubmit={handleSubmit} className="LoginPage__form">
          <header>Log In to Finertia</header>
          <label>Email</label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value.trim())}
            required
            className="LoginPage__form-input"
          />

          <label>Password</label>

          <section className="LoginPage__form__password">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="LoginPage__form-input"
            />
            <MdRemoveRedEye
              className="LoginPage__form__password-icon"
              onClick={handlePasswordToggle}
            />
          </section>

          {errors.credential && (
            <p className="LoginPage__form__errors">
              <LuInfo className="LoginPage__form__errors-icon" />
              {errors.credential}
            </p>
          )}

          <section className="LoginPage__form__buttons">
            <button
              type="submit"
              className="LoginPage__form__login-account-btn LoginPage__form__button"
            >
              {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Log In"
              )}
            </button>

            <button
              type="button"
              className="LoginPage__form__create-account-btn LoginPage__form__button"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;
