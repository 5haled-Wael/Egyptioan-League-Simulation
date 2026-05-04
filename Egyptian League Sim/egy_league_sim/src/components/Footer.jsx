// STYLE
import FooterBox from "./FooterBox";
// ICONS
import { GoTrophy } from "react-icons/go";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
// ASSETS
import logo from "../assets/Nile_League.png";

export default function Footer({ mainTxt, btnTxt }) {
  return (
    <>
      {/* FOOTER BOX */}
      <div className="container mt-5">
        <FooterBox mainTxt={mainTxt} btnTxt={btnTxt} />
      </div>

      <footer className="site-footer mt-4">
        <div className="container">
          <div className="footer-grid">
            {/* BRABD */}
            <div className="footer-brand">
              {/* ICON */}
              <div className="footer-brand-icon">
                <GoTrophy />
              </div>
              {/* TITLE */}
              <h5 className="footer-brand-name">
                Egyptian Premier League Simulator
              </h5>
              {/* CONTACT */}
              <div className="footer-contact">
                <span>Mansoura University</span>
                <span className="contact-label">Phone</span>
                <span>+20 01111000010</span>
                <span className="contact-label">Email</span>
                <span>example@gmail.com</span>
              </div>
              {/* SOCIAL */}
              <div className="footer-socials">
                <a href="#" className="social-btn">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-btn">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="social-btn">
                  <FaInstagram />
                </a>
                <a href="#" className="social-btn">
                  <FaTwitter />
                </a>
                <a href="#" className="social-btn">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="footer-col">
              <h6 className="footer-col-title">Quick Links</h6>
              <ul className="footer-links">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Fixtures</a>
                </li>
                <li>
                  <a href="#">Teams</a>
                </li>
                <li>
                  <a href="#">Standings</a>
                </li>
                <li>
                  <a href="#">Simulation</a>
                </li>
              </ul>
            </div>

            {/* LEGAL */}
            <div className="footer-col">
              <h6 className="footer-col-title">Legal</h6>
              <ul className="footer-links">
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Cookie Policy</a>
                </li>
              </ul>
            </div>

            {/* LOGO */}
            <div className="footer-logo-col">
              <img src={logo} alt="Nile League Logo" className="footer-logo" />
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            <span>
              © 2025 Egyptian Premier League Simulator. All rights reserved.
            </span>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
