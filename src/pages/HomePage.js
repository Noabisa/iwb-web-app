import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./HomePage.css";
import logo from "../logo iwb.png";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="homepage-layout">
      <Sidebar onSectionSelect={setActiveSection} />
      <div className="main-content">

        {activeSection === "home" && (
          <section className="hero-section">
            <div className="hero-content">
              <img src={logo} alt="IWB Logo" className="logo" />
              <h1>Innovative Waste & Boards</h1>
              <p>Building a greener future through responsible e-waste recycling.</p>
              <button className="primary-button" onClick={() => setActiveSection("services")}>
                Explore Products & Services
              </button>
            </div>
          </section>
        )}

        {activeSection === "about" && (
          <section className="about-section">
            <h2>About Us</h2>
            <p>
              Founded in 2024 in Lesotho, IWB (Innovative Waste & Boards) is a pioneer in sustainable electronic waste recycling.
              We specialize in the eco-friendly recovery and repurposing of electronic components like RAM, hard drives, and motherboards.
              Our goal is to minimize environmental harm and create value from discarded technology.
            </p>
          </section>
        )}

        {activeSection === "services" && (
          <section className="services-section">
            <h2>Our Key Services</h2>
            <div className="services-cards">
              <div className="card">
                <h3>RAM Recycling</h3>
                <p>Efficient and clean recovery of memory modules for reuse or safe disposal.</p>
              </div>
              <div className="card">
                <h3>Hard Drive Recovery</h3>
                <p>Secure data erasure and refurbishment of hard drives to extend hardware lifespan.</p>
              </div>
              <div className="card">
                <h3>Motherboard Component Recycling</h3>
                <p>Extracting valuable components like capacitors and ICs for reprocessing.</p>
              </div>
            </div>
          </section>
        )}

        {activeSection === "impact" && (
          <section className="impact-section">
            <h2>Our Impact</h2>
            <div className="impact-cards">
              <div className="impact-card">
                <h3>100K+ kg</h3>
                <p>Electronic waste recycled responsibly</p>
              </div>
              <div className="impact-card">
                <h3>85%</h3>
                <p>Recovery efficiency in our recycling process</p>
              </div>
              <div className="impact-card">
                <h3>40+</h3>
                <p>Partner organizations across Southern Africa</p>
              </div>
            </div>
          </section>
        )}

        {activeSection === "investor" && (
          <section className="investor-section">
            <h2>Why Invest in IWB?</h2>
            <ul>
              <li>📈 Rapidly growing e-waste sector with high ROI potential</li>
              <li>🌱 Strong commitment to ESG (Environmental, Social, Governance)</li>
              <li>🔍 Full transparency in operations, reporting, and data handling</li>
              <li>🛠️ Scalable business model ready for African and global expansion</li>
            </ul>
            <a href="/investor-info" className="investor-button">Learn More & Partner With Us</a>
          </section>
        )}

        {activeSection === "certifications" && (
          <section className="certifications-section">
            <h2>Certified & Compliant</h2>
            <p>We follow global standards for environmental and data safety compliance:</p>
            <ul>
              <li>ISO 14001 – Environmental Management</li>
              <li>R2 Certified for responsible recycling</li>
              <li>GDPR-compliant data handling procedures</li>
            </ul>
          </section>
        )}

        {activeSection === "why" && (
          <section className="why-choose-section">
            <h2>Why Choose IWB?</h2>
            <ul>
              <li>🌍 Eco-conscious recycling practices</li>
              <li>🔒 Secure handling of sensitive components</li>
              <li>🤝 Trusted by companies across Southern Africa</li>
              <li>📊 Transparent reporting and tracking</li>
              <li>💡 Innovative recovery solutions</li>
            </ul>
          </section>
        )}

        {activeSection === "testimonials" && (
          <section className="testimonials-section">
            <h2>What Clients Say</h2>
            <div className="testimonial">
              <p>"IWB helped us recycle outdated tech with confidence. Their secure data wipe and environmental care are unmatched."</p>
              <span>- Tech Solutions Ltd.</span>
            </div>
            <div className="testimonial">
              <p>"Professional, reliable, and truly committed to sustainability. Highly recommended for all electronics recycling needs."</p>
              <span>- GreenTech Investments</span>
            </div>
          </section>
        )}

        {activeSection === "partners" && (
          <section className="partners-section">
            <h2>Our Trusted Partners</h2>
            <ul>
              <li>IWC (Integrated Waste Consortium)</li>
              <li>GreenTech Investments</li>
              <li>Eco Innovators Africa</li>
            </ul>
          </section>
        )}

        {activeSection === "footer" && (
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-branding">
                <h3>IWB</h3>
                <p>Innovative Waste & Boards - Redefining sustainability through electronics recycling.</p>
              </div>
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul>
                  <li onClick={() => setActiveSection("home")}>Home</li>
                  <li onClick={() => setActiveSection("services")}>Products & Services</li>
                  <li onClick={() => setActiveSection("about")}>About Us</li>
                  <li onClick={() => setActiveSection("footer")}>Contact</li>
                </ul>
              </div>
              <div className="footer-contact">
                <h4>Contact Us</h4>
                <p>Email: info@iwb-recycle.com</p>
                <p>Phone: +266 5000 0000</p>
                <p>Location: Maseru, Lesotho</p>
              </div>
              <div className="footer-investor">
                <h4>Investor Relations</h4>
                <p>Interested in joining our mission? <a href="/investor-info">Get in touch</a> to view our prospectus.</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} IWB - All rights reserved.</p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default HomePage;
