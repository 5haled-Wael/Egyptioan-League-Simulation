import "../styles/Footer.css";

export default function FooterBox({ mainTxt, btnTxt }) {
  return (
    <div className="p-5 d-flex flex-column justify-content-center align-items-center footer-box">
      <span className="fs-1">{mainTxt}</span>
      <button type="button" className="btn mt-3">
        {btnTxt}
      </button>
    </div>
  );
}
