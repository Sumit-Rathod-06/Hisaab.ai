import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  Target
} from "lucide-react";

const audienceData = [
  {
    title: "College Students",
    description:
      "Learn to manage finances early and build strong money habits for the future.",
    icon: GraduationCap,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Young Professionals",
    description:
      "Balance career growth with smart saving, investing, and financial planning.",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "First-Time Investors",
    description:
      "Navigate the investment world confidently with clear guidance and insights.",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Goal Planners",
    description:
      "Plan major milestones like buying a home, travel, or early retirement.",
    icon: Target,
    color: "bg-teal-100 text-teal-600",
  },
];

const Audience = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Who Is It For?
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Designed for anyone who wants to take control of their financial future.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {audienceData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full ${item.color}`}
                >
                  <Icon size={26} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Audience;
