import { FaChartBar, FaRobot, FaBullseye } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="bg-[#f4fff9] min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl w-full text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          AI-Powered Personal Finance <br />
          Planning System
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Organize, analyze, and plan your expenses, investments, and
          financial goals using intelligent AI agents.
        </p>

        {/* Feature Pills */}
        <div className="mt-10 flex flex-col items-center gap-4">

          {/* Row 1 */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm">
              <FaChartBar className="text-emerald-600 text-lg" />
              <span className="text-gray-700 font-medium">
                Track expenses & savings automatically
              </span>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm ">
              <FaRobot className="text-emerald-600 text-lg" />
              <span className="text-gray-700 font-medium">
                Get personalized financial advice
              </span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm ">
              <FaBullseye className="text-emerald-600 text-lg" />
              <span className="text-gray-700 font-medium">
                Plan and achieve life goals smarter
              </span>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-12 flex gap-6 justify-center">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition">
            Get Started →
          </button>

          <button className="border border-gray-300 px-8 py-4 rounded-xl font-semibold text-gray-900 hover:bg-gray-100 transition">
            View Demo
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
