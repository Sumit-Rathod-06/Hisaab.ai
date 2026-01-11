import { useState } from "react";

export default function ManualInvestmentForm({ onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    type: "",
    platform: "",
    mode: "lumpsum",
    investedAmount: "",
    sipAmount: "",
    startDate: "",
    duration: "",
    riskLevel: "",
    goal: "",
    goalYear: "",
    taxSaving: false,
  });

  function update(field, value) {
    setData({ ...data, [field]: value });
  }

  function submit() {
    const finalPayload = {
      source: "manual",
      ...data,
    };

    console.log("Manual Investment Data:", finalPayload);
    alert("Investment added successfully");
  }

  return (
    <div className="bg-white p-8 rounded-2xl border shadow-sm">
      <button onClick={onBack} className="text-sm text-blue-600 mb-4">
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-6">
        Add Investment (Step {step}/4)
      </h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            placeholder="Investment Name"
            className="input"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <select
            className="input"
            value={data.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="">Select Type</option>
            <option>Equity</option>
            <option>Mutual Fund</option>
            <option>Fixed Deposit</option>
            <option>PPF</option>
            <option>Crypto</option>
          </select>

          <input
            placeholder="Platform / Bank / Broker"
            className="input"
            value={data.platform}
            onChange={(e) => update("platform", e.target.value)}
          />
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <select
            className="input"
            value={data.mode}
            onChange={(e) => update("mode", e.target.value)}
          >
            <option value="lumpsum">Lumpsum</option>
            <option value="sip">Monthly SIP</option>
          </select>

          {data.mode === "lumpsum" ? (
            <input
              placeholder="Total Amount Invested"
              className="input"
              value={data.investedAmount}
              onChange={(e) => update("investedAmount", e.target.value)}
            />
          ) : (
            <input
              placeholder="Monthly SIP Amount"
              className="input"
              value={data.sipAmount}
              onChange={(e) => update("sipAmount", e.target.value)}
            />
          )}

          <input
            type="date"
            className="input"
            value={data.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <select
            className="input"
            value={data.duration}
            onChange={(e) => update("duration", e.target.value)}
          >
            <option value="">Investment Duration</option>
            <option>Short-term</option>
            <option>Medium-term</option>
            <option>Long-term</option>
          </select>

          <select
            className="input"
            value={data.riskLevel}
            onChange={(e) => update("riskLevel", e.target.value)}
          >
            <option value="">Risk Level</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <select
            className="input"
            value={data.goal}
            onChange={(e) => update("goal", e.target.value)}
          >
            <option value="">Linked Goal</option>
            <option>Emergency Fund</option>
            <option>House</option>
            <option>Retirement</option>
            <option>Vacation</option>
          </select>

          <input
            placeholder="Target Year"
            className="input"
            value={data.goalYear}
            onChange={(e) => update("goalYear", e.target.value)}
          />
        </>
      )}

      {/* CONTROLS */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>Back</button>
        )}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save Investment
          </button>
        )}
      </div>
    </div>
  );
}
