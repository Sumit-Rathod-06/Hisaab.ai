export default function Investment() {
  return (
    <>
      <style>{`
        /* ---------- SECTION ---------- */
        .investment-section {
          padding: 80px 6%;
          background: #f4f7fb;
        }

        /* ---------- TITLE ---------- */
        .investment-title {
          font-size: 2.4rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #000000; /* strict black */
          margin-bottom: 48px;
        }

        .investment-icon {
          font-size: 1.6rem;
        }

        /* ---------- GRID ---------- */
        .investment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 28px;
        }

        /* ---------- CARD ---------- */
        .invest-card {
          padding: 28px;
          background: #ffffff;
          border-radius: 14px;
          border: 1.5px solid transparent;
          color: #000000; /* strict black */
          cursor: pointer;

          /* soft background shadow */
          box-shadow:
            0 8px 22px rgba(0, 0, 0, 0.08),
            0 2px 6px rgba(0, 0, 0, 0.05);

          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        /* ---------- HOVER ---------- */
        .invest-card:hover {
          border-color: #007bff; /* blue border */
          box-shadow:
            0 12px 30px rgba(0, 123, 255, 0.18),
            0 4px 10px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        /* ---------- TEXT ---------- */
        .invest-card h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: #000000; /* strict black */
        }

        .invest-card p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #000000; /* strict black */
        }
      `}</style>

      <section className="investment-section">
        <h2 className="investment-title">
          <span className="investment-icon">💹</span>
          Investments
        </h2>

        <div className="investment-grid">
          <div className="invest-card">
            <h3>Stocks</h3>
            <p>Track and grow your equity investments.</p>
          </div>

          <div className="invest-card">
            <h3>Mutual Funds</h3>
            <p>Diversified funds aligned to your goals.</p>
          </div>

          <div className="invest-card">
            <h3>Crypto</h3>
            <p>Monitor high-risk digital assets securely.</p>
          </div>
        </div>
      </section>
    </>
  );
}
