import React, { useState } from "react";
import { useNavigate } from "react-router";
import auth from "../Api/login.service";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("personal"); // personal/creator or business
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!email) return "Email is required";
      // basic email regex
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(email)) return "Enter a valid email address";
      if (!password) return "Password is required";
      if (password.length < 8) return "Password must be at least 8 characters";
    }
    if (step === 2) {
      if (!name || name.trim().length === 0) return "Full name is required";
    }
    if (step === 3) {
      if (!accountType) return "Select account type";
      if (
        accountType === "business" &&
        (!companyName || companyName.trim().length === 0)
      )
        return "Brand / Company Name is required for business accounts";
    }
    return null;
  };

  const handleNext = (e) => {
    (async () => {
      if (e) e.preventDefault();
      const err = validateStep();
      if (err) return setError(err);
      setError(null);
      // On step 1, call backend to check email (exists/disposable)
      if (step === 1) {
        try {
          const res = await auth.checkSignup({ email });
          if (!res || !res.ok) {
            setError(
              (res && res.data && (res.data.error || res.data.message)) ||
                "Check failed"
            );
            return;
          }
          if (res.data.disposable) {
            setError("Disposable email addresses are not allowed");
            return;
          }
          if (res.data.exists) {
            setError("An account already exists with this email");
            return;
          }
        } catch (err) {
          setError("Email check failed");
          return;
        }
      }
      setStep((s) => Math.min(3, s + 1));
    })();
  };

  const handleBack = (e) => {
    if (e) e.preventDefault();
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const err = validateStep();
    if (err) return setError(err);
    setLoading(true);
    setError(null);
    try {
      const payload = {
        email,
        password,
        name,
        accountType,
        companyName: accountType === "business" ? companyName : undefined,
      };
      const res = await auth.signup(payload);
      if (!res || !res.ok) {
        setError(
          (res && res.data && (res.data.error || res.data.message)) ||
            "Registration failed"
        );
        setLoading(false);
        return;
      }

      try {
        localStorage.setItem("auth-event", String(Date.now()));
      } catch (e) {}
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page signup-page">
      <h2>Sign up</h2>
      {error && <div className="auth-error">{error}</div>}
      <form
        className="auth-form"
        onSubmit={step === 3 ? handleSubmit : handleNext}>
        {step === 1 && (
          <>
            <label>
              Email Address (required)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>
            {/* Work/personal choice removed — backend tracks only personal emails */}
            <label>
              Password (required, min 8 characters)
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </label>
            <div className="form-actions">
              <button type="button" onClick={handleNext} disabled={loading}>
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label>
              Full Name (required)
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </label>
            <div className="form-actions">
              <button type="button" onClick={handleBack} disabled={loading}>
                Back
              </button>
              <button type="button" onClick={handleNext} disabled={loading}>
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label>
              Account Type (required)
              <div>
                <label>
                  <input
                    type="radio"
                    name="accountType"
                    value="personal"
                    checked={accountType === "personal"}
                    onChange={() => setAccountType("personal")}
                    disabled={loading}
                  />
                  Personal / Creator
                </label>
                <label>
                  <input
                    type="radio"
                    name="accountType"
                    value="business"
                    checked={accountType === "business"}
                    onChange={() => setAccountType("business")}
                    disabled={loading}
                  />
                  Business / Brand / Company
                </label>
              </div>
            </label>
            {accountType === "business" && (
              <label>
                Brand / Company Name (required for business)
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
              </label>
            )}

            {error && <div className="auth-error">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={handleBack} disabled={loading}>
                Back
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default Signup;
