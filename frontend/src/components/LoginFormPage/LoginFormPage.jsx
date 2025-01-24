import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { login } from "../../../store/session";
import "./LoginForm.css";
import { LuInfo } from "react-icons/lu";
import { MdRemoveRedEye } from "react-icons/md";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    console.log(showPassword)
    setShowPassword(!showPassword);
  };

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    console.log(credential, password);

    try {
      const res = await dispatch(login({ credential, password }));
      return res;
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-section-1"></div>

      <div className="login-form-section-2">
        <div className="login-form-top">
          <form onSubmit={handleSubmit} className="login-form">
            <p>Log In to Finertia</p>
            <label>Email</label>
            <input
              type='text'
              value={credential}
              onChange={(e) => setCredential(e.target.value.trim())}
              required
            />

              <label>Password</label>
              <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <MdRemoveRedEye
              className='password-icon'
              onClick={handlePasswordToggle}
              />
            </div>

            {errors.credential && (
              <p className="login-errors">
                <LuInfo className="info-icon" /> {errors.credential}
              </p>
            )}
            <div className="login-button-container">
              <button type="submit">Log In</button>
              <Link to="/signup">
                <button type="button" id="create-acct-btn">
                  Create Account
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
