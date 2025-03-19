import "./SignUpPage.css";
// import { FaSpaceShuttle } from "react-icons/fa";
import { LuInfo } from "react-icons/lu";
import { MdRemoveRedEye } from "react-icons/md";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";

import { signup } from "../../../store/session";

function SignUpPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);


  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

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

  if (sessionUser) return <Navigate to="/" replace={true} />;

  return (
    <div className="SignUpPage">
      <aside className="SignUpPage__aside">
        <Link className="SignUpPage__aside-logo" to="/welcome">
          {/* <FaSpaceShuttle /> */}
          <img src="/public/favicon3.png" alt="Logo" width="18" />
          Finertia
        </Link>

        <header className="SignUpPage__aside-header">Create your login</header>

        <sub className="SignUpPage__aside-subtext">
          We&apos;ll need your name, email address, and a unique password.
          You&apos;ll use this login to access Finertia next time.
        </sub>

        <div className="SignUpPage__aside__image-container">
          <figure className="SignUpPage__aside__image" />
        </div>
      </aside>

      <div className="SignUpPage__main">
        <header className="SignUpPage__main-header">
          Enter your first and last name as they appear on your government ID.
        </header>

        <form onSubmit={handleSubmit} className="SignUpPage__form">
          <section className="SignUpPage__form__section-one">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
              className="SignUpPage__form-input"
            />

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last Name"
              className="SignUpPage__form-input"
            />
          </section>

          <section className="SignUpPage__form__section-two">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="SignUpPage__form-input"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="SignUpPage__form-input"
            />

            <div className="SignUpPage__form__password-container">
              <div className="SignUpPage__form__password">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="SignUpPage__form-input"
                />
                <MdRemoveRedEye
                  className="SignUpPage__hide-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              <div className="SignUpPage__form__password">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                      className="SignUpPage__form-input"
                />
                <MdRemoveRedEye
                  className="SignUpPage__hide-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>

              <div className="SignUpPage__form__errors">
                {errors &&
                  Object.values(errors).map((error) => {
                    return (
                      <>
                        <p className="SignUpPage__form__error">
                          <LuInfo className="SignUpPage__info-icon" />
                          {error}
                        </p>
                      </>
                    );
                  })}
              </div>
            </div>

            <button type="submit">   {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Sign Up"
              )}</button>
          </section>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
