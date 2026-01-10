import { FaChartBar, FaRobot, FaBullseye, FaArrowRight, FaPlayCircle } from "react-icons/fa";
import { motion } from "motion/react";
import RotatingText from "../ui/RotatingText";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#f4f9ff] via-white to-[#e8f0ff] min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl w-full text-center relative z-10">

        {/* Heading with RotatingText */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <span>Personal One-Stop Solution</span>
            <div className="flex items-center justify-center">
              <span className="mr-3">for</span>
              <div className="inline-block min-w-[300px] md:min-w-[400px]">
                <RotatingText
                  texts={["investor.", "saver.", "planner.", "goal."]}
                  rotationInterval={3000}
                  splitBy="characters"
                  mainClassName="text-blue-600"
                  staggerDuration={0.03}
                />
              </div>
            </div>
          </div>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Organize, analyze, and plan your expenses, investments, and
          financial goals using <span className="text-blue-600 font-semibold">intelligent AI agents</span>.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 flex flex-col items-center gap-4"
        >


          {/* Row 2 */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 cursor-pointer"
            >
              <FaBullseye className="text-blue-600 text-xl" />
              <span className="text-gray-700 font-medium">
                Plan and achieve life goals smarter
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-14 flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-semibold flex items-center gap-3 transition shadow-xl"
          >
            Get Started <FaArrowRight className="text-lg" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: "#10b981" }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-gray-300 px-10 py-5 rounded-2xl font-semibold text-gray-900 hover:bg-gray-50 transition flex items-center gap-3"
          >
            <FaPlayCircle className="text-blue-600 text-xl" />
            View Demo
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-16 flex flex-wrap justify-center gap-12"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">7</div>
            <div className="text-sm text-gray-600 mt-1">AI Agents</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600 mt-1">Automated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600 mt-1">Monitoring</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
