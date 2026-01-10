import GoalCards from "../components/Goal/GoalCards";

const GoalPage = () => {
    return (
        <div className="min-h-screen bg-[#e9ebee] py-12">
            <h1 className="text-4xl font-bold text-center text-black mb-8">
                Your Financial Goals
            </h1>
            <GoalCards />
        </div>
    );
}

export default GoalPage;