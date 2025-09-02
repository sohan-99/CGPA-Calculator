"use client";

interface CGPASummaryCardProps {
  cgpa: number;
  totalCredits: number;
  totalSemesters: number;
}

export default function CGPASummaryCard({
  cgpa,
  totalCredits,
  totalSemesters,
}: CGPASummaryCardProps) {
  const getPerformanceLevel = (cgpa: number) => {
    if (cgpa >= 3.75)
      return {
        level: "Excellent",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
      };
    if (cgpa >= 3.0)
      return {
        level: "Very Good",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
      };
    if (cgpa >= 2.0)
      return {
        level: "Satisfactory",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      };
    return {
      level: "Need Improvement",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    };
  };

  const performance = getPerformanceLevel(cgpa);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {cgpa.toFixed(2)}
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium">
            Current CGPA
          </div>
          <div
            className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${performance.color} ${performance.bgColor}`}
          >
            {performance.level}
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            {totalCredits}
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium">
            Total Credits
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Credits Completed
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {totalSemesters}
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium">
            Semesters
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Academic Terms
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {cgpa > 0 ? Math.round((cgpa / 4.0) * 100) : 0}%
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium">
            Percentage
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Equivalent Score
          </div>
        </div>
      </div>

      {cgpa > 0 && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Academic Progress
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {cgpa >= 2.0
                  ? "You are on track for graduation!"
                  : "Focus on improving your grades."}
              </p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-700 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((cgpa / 4.0) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
