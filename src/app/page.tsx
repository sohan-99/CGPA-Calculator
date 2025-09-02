"use client";

import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import CGPASummaryCard from "../components/CGPASummaryCard";

interface Course {
  id: string;
  name: string;
  credit: number;
  grade: string;
  gradePoint: number;
}

interface Semester {
  id: string;
  name: string;
  courses: Course[];
  gpa: number;
}

const gradeOptions = [
  { grade: "A+", point: 4.0, range: "80-100" },
  { grade: "A", point: 3.75, range: "75-79" },
  { grade: "A-", point: 3.5, range: "70-74" },
  { grade: "B+", point: 3.25, range: "65-69" },
  { grade: "B", point: 3.0, range: "60-64" },
  { grade: "B-", point: 2.75, range: "55-59" },
  { grade: "C+", point: 2.5, range: "50-54" },
  { grade: "C", point: 2.25, range: "45-49" },
  { grade: "D", point: 2.0, range: "40-44" },
  { grade: "F", point: 0.0, range: "Below 40" },
];

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [activeTab, setActiveTab] = useState("calculator");
  const [cgpa, setCGPA] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const addSemester = () => {
    const newSemester: Semester = {
      id: `semester-${Date.now()}`,
      name: `Semester ${semesters.length + 1}`,
      courses: [],
      gpa: 0,
    };
    setSemesters([...semesters, newSemester]);
  };

  const addCourse = (semesterId: string) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: "",
      credit: 3,
      grade: "",
      gradePoint: 0,
    };

    setSemesters(
      semesters.map((semester) =>
        semester.id === semesterId
          ? { ...semester, courses: [...semester.courses, newCourse] }
          : semester
      )
    );
  };

  const updateCourse = (
    semesterId: string,
    courseId: string,
    field: keyof Course,
    value: string | number
  ) => {
    setSemesters(
      semesters.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.map((course) =>
                course.id === courseId
                  ? {
                      ...course,
                      [field]: value,
                      ...(field === "grade" && {
                        gradePoint:
                          gradeOptions.find((g) => g.grade === value)?.point ||
                          0,
                      }),
                    }
                  : course
              ),
            }
          : semester
      )
    );
  };

  const deleteCourse = (semesterId: string, courseId: string) => {
    setSemesters(
      semesters.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.filter(
                (course) => course.id !== courseId
              ),
            }
          : semester
      )
    );
  };

  const deleteSemester = (semesterId: string) => {
    setSemesters(semesters.filter((semester) => semester.id !== semesterId));
  };

  const calculateSemesterGPA = (courses: Course[]) => {
    if (courses.length === 0) return 0;

    const totalPoints = courses.reduce(
      (sum, course) => sum + course.gradePoint * course.credit,
      0
    );
    const totalCredits = courses.reduce(
      (sum, course) => sum + course.credit,
      0
    );

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateCGPA = useCallback(() => {
    let totalPoints = 0;
    let totalCreds = 0;

    semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        if (course.grade && course.credit > 0) {
          totalPoints += course.gradePoint * course.credit;
          totalCreds += course.credit;
        }
      });
    });

    setCGPA(totalCreds > 0 ? totalPoints / totalCreds : 0);
    setTotalCredits(totalCreds);

    // Update semester GPAs
    setSemesters((prevSemesters) =>
      prevSemesters.map((semester) => ({
        ...semester,
        gpa: calculateSemesterGPA(semester.courses),
      }))
    );
  }, [semesters]);

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadData = () => {
      const savedData = localStorage.getItem("cgpa-calculator-data");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData.semesters && parsedData.semesters.length > 0) {
            setSemesters(parsedData.semesters);
            setCGPA(parsedData.cgpa || 0);
            setTotalCredits(parsedData.totalCredits || 0);
          } else {
            // Add initial semester if no data exists
            const initialSemester: Semester = {
              id: `semester-${Date.now()}`,
              name: "Semester 1",
              courses: [],
              gpa: 0,
            };
            setSemesters([initialSemester]);
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
          // Add initial semester on error
          const initialSemester: Semester = {
            id: `semester-${Date.now()}`,
            name: "Semester 1",
            courses: [],
            gpa: 0,
          };
          setSemesters([initialSemester]);
        }
      } else {
        // Add initial semester if no saved data
        const initialSemester: Semester = {
          id: `semester-${Date.now()}`,
          name: "Semester 1",
          courses: [],
          gpa: 0,
        };
        setSemesters([initialSemester]);
      }
      setIsLoading(false);
    };

    loadData();
  }, []); // Empty dependency array is correct here

  useEffect(() => {
    if (!isLoading && semesters.length > 0) {
      calculateCGPA();
    }
  }, [semesters, isLoading, calculateCGPA]); // Include calculateCGPA in dependencies

  useEffect(() => {
    // Save data to localStorage whenever it changes
    if (!isLoading) {
      const dataToSave = {
        semesters,
        cgpa,
        totalCredits,
      };
      localStorage.setItem("cgpa-calculator-data", JSON.stringify(dataToSave));
    }
  }, [semesters, cgpa, totalCredits, isLoading]);

  const clearAllData = () => {
    // Show confirmation toast with action buttons
    toast(
      (t) => (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Clear all data?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                const initialSemester: Semester = {
                  id: `semester-${Date.now()}`,
                  name: "Semester 1",
                  courses: [],
                  gpa: 0,
                };
                setSemesters([initialSemester]);
                setCGPA(0);
                setTotalCredits(0);
                localStorage.removeItem("cgpa-calculator-data");
                toast.success("All data has been cleared successfully!", {
                  duration: 100,
                  icon: "🗑️",
                });
              }}
              className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Yes, clear all
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading your CGPA calculator...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  CGPA Calculator
                </h1>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Academic Grade Point Average Calculator
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("calculator")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "calculator"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  Calculator
                </button>
                <button
                  onClick={() => setActiveTab("grading")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "grading"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  Grading Scale
                </button>
              </div>
              <button
                onClick={clearAllData}
                className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                title="Clear All Data"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {activeTab === "calculator" ? (
          <div className="space-y-8">
            {/* CGPA Summary */}
            <CGPASummaryCard
              cgpa={cgpa}
              totalCredits={totalCredits}
              totalSemesters={semesters.length}
            />

            {/* Semesters */}
            <div className="space-y-6">
              {semesters.map((semester, semesterIndex) => (
                <div
                  key={semester.id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden card-hover"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="font-bold text-lg">
                            {semesterIndex + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {semester.name}
                          </h3>
                          <div className="text-sm opacity-90">
                            {semester.courses.length} course
                            {semester.courses.length !== 1 ? "s" : ""} • GPA:{" "}
                            {semester.gpa.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSemester(semester.id)}
                        className="text-red-200 hover:text-white transition-colors p-2 rounded-full hover:bg-red-500/20"
                        disabled={semesters.length === 1}
                        title="Delete Semester"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {semester.courses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="mb-4">No courses added yet</p>
                        <button
                          onClick={() => addCourse(semester.id)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span>Add First Course</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                          <div className="col-span-5">Course Name</div>
                          <div className="col-span-2">Credits</div>
                          <div className="col-span-2">Grade</div>
                          <div className="col-span-2">Points</div>
                          <div className="col-span-1">Action</div>
                        </div>

                        {semester.courses.map((course) => (
                          <div
                            key={course.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl fade-in"
                          >
                            <div className="md:col-span-5">
                              <input
                                type="text"
                                placeholder="Course Name (e.g., Calculus I)"
                                value={course.name}
                                onChange={(e) =>
                                  updateCourse(
                                    semester.id,
                                    course.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <input
                                type="number"
                                placeholder="Credits"
                                min="0.25"
                                max="6"
                                step="0.25"
                                value={course.credit || ""}
                                onChange={(e) =>
                                  updateCourse(
                                    semester.id,
                                    course.id,
                                    "credit",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <select
                                value={course.grade}
                                onChange={(e) =>
                                  updateCourse(
                                    semester.id,
                                    course.id,
                                    "grade",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                              >
                                <option value="">Select Grade</option>
                                {gradeOptions.map((option) => (
                                  <option
                                    key={option.grade}
                                    value={option.grade}
                                  >
                                    {option.grade} ({option.point})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <div className="text-center font-semibold text-gray-700 dark:text-gray-300 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                {course.gradePoint.toFixed(2)}
                              </div>
                            </div>
                            <div className="md:col-span-1">
                              <button
                                onClick={() =>
                                  deleteCourse(semester.id, course.id)
                                }
                                className="w-full p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Course"
                              >
                                <svg
                                  className="w-5 h-5 mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="mt-4 flex justify-center items-center space-x-4">
                          <button
                            onClick={() => addCourse(semester.id)}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span>Add Course</span>
                          </button>

                          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-md">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            <span>Total CGPA: {cgpa.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="text-center">
                <button
                  onClick={addSemester}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add New Semester</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Grading Scale Tab */
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  University Grading Scale
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Standard grading system and performance indicators
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-4 gap-4 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-300 dark:border-gray-600 pb-3">
                <div>Grade</div>
                <div>Grade Point</div>
                <div>Marks Range</div>
                <div>Performance</div>
              </div>

              {gradeOptions.map((option) => (
                <div
                  key={option.grade}
                  className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                      {option.grade}
                    </span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 font-semibold">
                    {option.point.toFixed(2)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {option.range}%
                  </div>
                  <div className="text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        option.point >= 3.75
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : option.point >= 3.0
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : option.point >= 2.0
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {option.point >= 3.75
                        ? "Excellent"
                        : option.point >= 3.0
                        ? "Very Good"
                        : option.point >= 2.0
                        ? "Satisfactory"
                        : "Fail"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Important Notes
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                    Minimum passing grade is D (2.0 grade point)
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                    CGPA is calculated as the weighted average of all courses
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                    Credit hours are considered as weights in the calculation
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                    A CGPA of 2.0 or higher is required for graduation
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  CGPA Calculation
                </h3>
                <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
                  <p className="font-mono bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                    CGPA = Σ(Grade Point × Credit Hours) / Σ(Credit Hours)
                  </p>
                  <p className="text-xs">
                    Example: If you have courses with grades A (3.75, 3 credits)
                    and B+ (3.25, 4 credits):
                  </p>
                  <p className="text-xs font-mono bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                    CGPA = (3.75×3 + 3.25×4) / (3+4) = 24.25 / 7 = 3.46
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400">
                © 2025 CGPA Calculator
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Academic Grade Point Average Calculator - Built for students
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📧 sohan75632@gmail.com</span>
              {/* <span>📱 +8801722562608</span> */}
              <a
                href="https://github.com/sohan-99"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
