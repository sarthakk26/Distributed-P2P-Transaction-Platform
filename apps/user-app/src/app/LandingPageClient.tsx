"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [activeSection, setActiveSection] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "how-it-works", "security", "support"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description:
        "Create your account in minutes with our simple and secure registration process.",
      icon: "👤",
    },
    {
      number: "2",
      title: "Add Funds",
      description:
        "Easily transfer money from your bank account to your Cosmos wallet.",
      icon: "💳",
    },
    {
      number: "3",
      title: "Start Transacting",
      description:
        "Send money, make payments, and track your expenses with ease.",
      icon: "⚡",
    },
  ];

  return (
    <div className="landing-page">
      {/* Fixed Background */}
      <div className="fixed-background" />

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-links">
          <button
            onClick={() => scrollToSection("features")}
            className={activeSection === "features" ? "active" : ""}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className={activeSection === "how-it-works" ? "active" : ""}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("security")}
            className={activeSection === "security" ? "active" : ""}
          >
            Security
          </button>
          <button
            onClick={() => scrollToSection("support")}
            className={activeSection === "support" ? "active" : ""}
          >
            Support
          </button>
        </div>
        <div className="nav-actions">
          <Link href="/signin" className="login-btn">
            Log In
          </Link>
          <Link href="/signup" className="signup-btn">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Scrolling Content */}
      <div className="content-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              YOUR WALLET,
              <br />
              REIMAGINED FOR
              <br />
              THE COSMOS.
            </h1>
            <p className="hero-subtitle">
              Effortlessly manage, send, and track your
              <br />
              finances in a secure, stellar environment.
            </p>
          </div>

          <div className="hero-visual">
            <div className="floating-element rocket-1">🚀</div>
            <div className="floating-element rocket-2">🚀</div>
            <div className="floating-element coin-1">🪙</div>
            <div className="floating-element coin-2">🪙</div>
            <div className="floating-element coin-3">🪙</div>
            <div className="floating-element magnify">🔍</div>

            <div className="concept-container">
              <Image
                src="/concept.png"
                alt="Wallet Dashboard Concept"
                width={1200}
                height={800}
                priority
                className="concept-image"
              />
            </div>

            <div className="character-left floating-element">
              <div
                className="character-avatar"
                style={{
                  background:
                    "linear-gradient(135deg, #e94ca8 0%, #a855f7 100%)",
                }}
              >
                👨‍💼
              </div>
            </div>
            <div className="character-right floating-element">
              <div
                className="character-avatar"
                style={{
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                }}
              >
                👩‍💼
              </div>
            </div>
            <div className="bot-character floating-element">🤖</div>
          </div>

          <div className="sparkle-decoration">✨</div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-container">
            <h2 className="section-title">See Your Money Clearly</h2>

            <div className="feature-grid-new">
              <div className="feature-card-new">
                <div className="feature-card-header">
                  <div className="feature-icon-new">📊</div>
                  <h3>Smart Dashboard</h3>
                </div>
                <p className="feature-description">
                  Everything you need to understand your money — clearly,
                  instantly.
                </p>
                <div className="feature-highlights">
                  <span className="highlight-badge">Live Updates</span>
                  <span className="highlight-badge">Charts</span>
                  <span className="highlight-badge">Activity</span>
                </div>
              </div>

              <div className="feature-card-new">
                <div className="feature-card-header">
                  <div className="feature-icon-new">⚡</div>
                  <h3>Instant P2P</h3>
                </div>
                <p className="feature-description">
                  Send money instantly using just a phone number — no bank
                  details needed.
                </p>
                <div className="feature-highlights">
                  <span className="highlight-badge">Phone-Based</span>
                  <span className="highlight-badge">Quick Send</span>
                  <span className="highlight-badge">Safe</span>
                </div>
              </div>

              <div className="feature-card-new">
                <div className="feature-card-header">
                  <div className="feature-icon-new">💳</div>
                  <h3>Bank Top-Ups</h3>
                </div>
                <p className="feature-description">
                  Add money from your bank with full confirmation and tracking.
                </p>
                <div className="feature-highlights">
                  <span className="highlight-badge">Verified</span>
                  <span className="highlight-badge">Tracked</span>
                  <span className="highlight-badge">Secure</span>
                </div>
              </div>

              <div className="feature-card-new">
                <div className="feature-card-header">
                  <div className="feature-icon-new">🛡️</div>
                  <h3>Safety Built In</h3>
                </div>
                <p className="feature-description">
                  Transfers are protected by design — not just checks after the
                  fact.
                </p>
                <div className="feature-highlights">
                  <span className="highlight-badge">ACID Safe</span>
                  <span className="highlight-badge">Auto-Recovery</span>
                  <span className="highlight-badge">Validated</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-container">
            <h2 className="section-title">How Cosmos Works</h2>
            <p className="section-subtitle">
              Get started in three simple steps and take control of your
              finances today.
            </p>

            <div className="steps-container">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  {/* Step card */}
                  <div className="step-card">
                    {/* Number badge */}
                    <div className="step-number-badge">{step.number}</div>

                    {/* Icon */}
                    <div className="step-icon">{step.icon}</div>

                    {/* Text */}
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>

                  {/* Connector arrow between cards */}
                  {index < steps.length - 1 && (
                    <div className="step-connector">
                      <svg
                        viewBox="0 0 60 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="connector-arrow"
                      >
                        <path
                          d="M0 12 H52 M44 4 L52 12 L44 20"
                          stroke="url(#arrowGrad)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient
                            id="arrowGrad"
                            x1="0"
                            y1="0"
                            x2="60"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="100%" stopColor="#764ba2" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="security-section">
          <div className="section-container">
            <h2 className="section-title">
              Your Money is Protected - By Design
            </h2>
            <p className="section-subtitle">
              Security isn't an add-on here. Every transaction is engineered to
              be correct, auditable, and failure-safe — even under retries,
              crashes, or concurrent requests.
            </p>

            <div className="security-grid">
              <div className="security-card">
                <div className="security-icon">🛡️</div>
                <h3>Transaction-Safe by Design</h3>
                <p>
                  All transfers run inside database transactions with row-level
                  locking, preventing double spending and partial updates.
                </p>
              </div>
              <div className="security-card">
                <div className="security-icon">✅</div>
                <h3>Verified Bank Webhooks</h3>
                <p>
                  Every bank callback is signature-verified, replay-protected,
                  and processed exactly once.
                </p>
              </div>
              <div className="security-card">
                <div className="security-icon">🔁</div>
                <h3>Retry & Replay Safe</h3>
                <p>
                  Duplicate requests and webhook retries are safely ignored
                  using idempotency and state guards.
                </p>
              </div>
              <div className="security-card">
                <div className="security-icon">🧭</div>
                <h3>Explicit State Machines</h3>
                <p>
                  Each transaction follows a strict lifecycle. Invalid or
                  out-of-order state changes are blocked automatically.
                </p>
              </div>
              <div className="security-card">
                <div className="security-icon">🛠️</div>
                <h3>Continuous Reconciliation</h3>
                <p>
                  Background checks detect stuck, inconsistent, or invalid
                  transactions before they become issues.
                </p>
              </div>
              <div className="security-card">
                <div className="security-icon">👀</div>
                <h3>Full Audit Visibility</h3>
                <p>
                  Every state change is logged, traceable, and visible through
                  an internal ops dashboard.
                </p>
              </div>
            </div>

            <div className="security-stats">
              <div className="stat-item">
                <div className="stat-number">ACID</div>
                <div className="stat-label">Transactional Safety</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Idempotent Transfers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Double-Spend Risk</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">All</div>
                <div className="stat-label">State-Validated</div>
              </div>
            </div>

            <p className="security-note">
              We never share your financial data without your permission. Your
              privacy is our priority.
            </p>
          </div>
        </section>

        {/* Support Section */}
        <section
          id="support"
          className="min-h-screen py-24 px-[5%] bg-[rgba(10,14,39,0.85)] backdrop-blur-[20px]"
        >
          <div className="max-w-[1200px] mx-auto px-8">
            <h2 className="font-['Orbitron'] text-5xl text-white text-center mb-4 uppercase tracking-[-1px]">
              We're Here to Help
            </h2>
            <p className="text-center text-xl text-white/70 mb-16 max-w-[700px] mx-auto">
              Have a question or need assistance? Send us a message and we'll
              get back to you within 24 hours.
            </p>

            <div className="max-w-[600px] mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-[10px]">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-3">📧</div>
                  <h3 className="font-['Orbitron'] text-2xl text-white mb-1">
                    Send us a Message
                  </h3>
                  <p className="text-white/60 text-sm">
                    We typically respond within 24 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="name"
                        className="text-white/90 font-semibold text-sm"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className="bg-white/8 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/12 focus:ring-2 focus:ring-[rgba(102,126,234,0.1)] placeholder:text-white/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-white/90 font-semibold text-sm"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="bg-white/8 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/12 focus:ring-2 focus:ring-[rgba(102,126,234,0.1)] placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="subject"
                      className="text-white/90 font-semibold text-sm"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      required
                      className="bg-white/8 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/12 focus:ring-2 focus:ring-[rgba(102,126,234,0.1)] placeholder:text-white/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-white/90 font-semibold text-sm"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more..."
                      rows={4}
                      required
                      className="bg-white/8 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm transition-all duration-300 focus:outline-none focus:border-[#667eea] focus:bg-white/12 focus:ring-2 focus:ring-[rgba(102,126,234,0.1)] placeholder:text-white/40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-xl font-bold text-base transition-all duration-300 mt-2 shadow-[0_10px_30px_rgba(102,126,234,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(102,126,234,0.5)] active:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                  {submitStatus === "success" && (
                    <p className="text-green-400 text-sm text-center font-medium mt-2">
                      ✓ Message sent! We'll get back to you within 24 hours.
                    </p>
                  )}

                  {submitStatus === "error" && (
                    <p className="text-red-400 text-sm text-center font-medium mt-2">
                      ✗ Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="footer-bottom">
          <p>&copy; 2026 Cosmos Wallet. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .fixed-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("/base.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: -1;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          background: rgba(10, 14, 39, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-links {
          display: flex;
          gap: 3rem;
          align-items: center;
        }

        .nav-links button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem 0;
          font-family: inherit;
        }

        .nav-links button::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #e94ca8;
          transition: width 0.3s ease;
        }

        .nav-links button:hover,
        .nav-links button.active {
          color: #ffffff;
        }

        .nav-links button:hover::after,
        .nav-links button.active::after {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          position: absolute;
          right: 2.5rem;
        }

        .login-btn {
          background: transparent;
          color: #ffffff;
          padding: 0.6rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .login-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .signup-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 0.7rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
        }

        /* Hero */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8rem 5% 4rem;
          gap: 4rem;
          position: relative;
        }

        .hero-content {
          flex: 1;
          max-width: 450px;
          z-index: 2;
        }

        .hero-title {
          font-family: "Orbitron", sans-serif;
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: -2px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .hero-visual {
          flex: 1;
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .concept-container {
          position: relative;
          z-index: 1;
          animation: float 6s ease-in-out infinite;
        }

        .concept-image {
          max-width: 100%;
          height: auto;
          filter: drop-shadow(0 20px 60px rgba(102, 126, 234, 0.3));
        }

        .floating-element {
          position: absolute;
          font-size: 3rem;
          animation: float 4s ease-in-out infinite;
        }

        .rocket-1 {
          top: 1%;
          left: 5%;
          animation-delay: 0s;
        }
        .rocket-2 {
          top: 10%;
          right: 0;
          animation-delay: 1.5s;
        }
        .coin-1 {
          top: 20%;
          left: 35%;
          animation-delay: 0.5s;
        }
        .coin-2 {
          top: 1%;
          right: 10%;
          animation-delay: 1s;
        }
        .coin-3 {
          bottom: 30%;
          left: 8%;
          animation-delay: 2s;
        }
        .magnify {
          bottom: 50%;
          left: 15%;
          animation-delay: 1.2s;
        }
        .character-left {
          bottom: 5%;
          left: 10%;
          animation-delay: 0.8s;
        }
        .character-right {
          bottom: 10%;
          right: 5%;
          animation-delay: 1.8s;
        }
        .bot-character {
          bottom: 40%;
          left: 25%;
          animation-delay: 2.5s;
        }

        .character-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .sparkle-decoration {
          position: absolute;
          bottom: 15%;
          right: 40%;
          font-size: 4rem;
          animation: pulse 2s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-title {
          font-family: "Orbitron", sans-serif;
          font-size: 3rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        .section-subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Features */
        .features-section {
          min-height: 100vh;
          padding: 6rem 5%;
          background: rgba(10, 14, 39, 0.85);
          backdrop-filter: blur(20px);
        }

        .feature-grid-new {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .feature-card-new {
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.1) 0%,
            rgba(118, 75, 162, 0.1) 100%
          );
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .feature-card-new::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .feature-card-new:hover::before {
          transform: scaleX(1);
        }

        .feature-card-new:hover {
          transform: translateY(-10px);
          border-color: rgba(102, 126, 234, 0.5);
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.15) 0%,
            rgba(118, 75, 162, 0.15) 100%
          );
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
        }

        .feature-card-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .feature-icon-new {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: inline-block;
          transition: transform 0.4s ease;
        }

        .feature-card-new:hover .feature-icon-new {
          transform: scale(1.1) rotate(5deg);
        }

        .feature-card-new h3 {
          font-family: "Orbitron", sans-serif;
          font-size: 1.1rem;
          color: #ffffff;
          margin-bottom: 0;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .feature-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .feature-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .highlight-badge {
          background: rgba(102, 126, 234, 0.2);
          border: 1px solid rgba(102, 126, 234, 0.4);
          color: rgba(255, 255, 255, 0.9);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .feature-card-new:hover .highlight-badge {
          background: rgba(102, 126, 234, 0.3);
          border-color: rgba(102, 126, 234, 0.6);
          color: #ffffff;
        }

        /* ── How It Works ── */
        .how-it-works-section {
          padding: 6rem 5%;
          background: rgba(6, 10, 30, 0.9);
          backdrop-filter: blur(20px);
        }

        .steps-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          max-width: 1000px;
          margin: 0 auto;
        }

        .step-card {
          flex: 1;
          max-width: 280px;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.08) 0%,
            rgba(118, 75, 162, 0.08) 100%
          );
          border: 1px solid rgba(102, 126, 234, 0.25);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-card:hover {
          transform: translateY(-10px);
          border-color: rgba(102, 126, 234, 0.6);
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.15) 0%,
            rgba(118, 75, 162, 0.15) 100%
          );
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
        }

        .step-number-badge {
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-family: "Orbitron", sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5);
        }

        .step-icon {
          font-size: 3.5rem;
          margin-bottom: 1.2rem;
          display: inline-block;
          transition: transform 0.4s ease;
        }

        .step-card:hover .step-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .step-title {
          font-family: "Orbitron", sans-serif;
          font-size: 1rem;
          color: #ffffff;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: 0.5px;
        }

        .step-description {
          color: rgba(255, 255, 255, 0.65);
          font-size: 0.875rem;
          line-height: 1.7;
        }

        .step-connector {
          flex-shrink: 0;
          width: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .connector-arrow {
          width: 60px;
          height: 24px;
          opacity: 0.6;
        }

        /* Security */
        .security-section {
          min-height: 100vh;
          padding: 6rem 5%;
          background: rgba(10, 14, 39, 0.7);
        }

        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          margin-bottom: 4rem;
        }

        .security-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.4s ease;
        }

        .security-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
        }

        .security-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .security-card h3 {
          font-family: "Orbitron", sans-serif;
          font-size: 1.5rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .security-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
        }

        .security-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-item {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-number {
          font-family: "Orbitron", sans-serif;
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
        }

        .security-note {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
          font-style: italic;
        }

        .footer-bottom {
          text-align: center;
          padding: 2rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          background: rgba(10, 14, 39, 0.95);
        }

        /* Responsive */
        @media (max-width: 1400px) {
          .feature-grid-new {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 1024px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
            padding-top: 7rem;
          }
          .hero-title {
            font-size: 3.5rem;
          }
          .hero-visual {
            min-height: 500px;
          }
          .feature-grid-new {
            grid-template-columns: repeat(2, 1fr);
          }
          .steps-container {
            flex-direction: column;
            gap: 2.5rem;
          }
          .step-connector {
            transform: rotate(90deg);
          }
          .step-card {
            max-width: 100%;
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .nav-actions {
            position: static;
          }
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1.1rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .feature-grid-new {
            grid-template-columns: 1fr;
          }
          .security-grid {
            grid-template-columns: 1fr;
          }
          .security-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .floating-element {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 1rem 5%;
          }
          .nav-actions {
            gap: 0.5rem;
          }
          .login-btn,
          .signup-btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
          .hero-title {
            font-size: 2rem;
          }
          .section-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
