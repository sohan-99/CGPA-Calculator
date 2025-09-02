# 🎓 CGPA Calculator - Academic Grade Point Calculator

A modern, user-friendly CGPA calculator designed for university students worldwide. Built with Next.js 15, TypeScript, Tailwind CSS, and React Hot Toast for a smooth, responsive, and interactive experience.

![CGPA Calculator Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=CGPA+Calculator+Preview)

## ✨ Features

### 🧮 **Advanced Calculator**

- **Multi-semester management** - Add unlimited semesters and courses
- **Real-time CGPA calculation** - Automatic updates as you enter grades
- **Weighted calculations** - Proper credit hour weighting for accurate results
- **Individual semester GPA** - Track performance for each term

### 📊 **Comprehensive Tracking**

- **Performance indicators** - Visual feedback on academic standing
- **Credit hour tracking** - Monitor total completed credits with flexible increments (0.25 steps)
- **Progress visualization** - Real-time CGPA display
- **Academic status** - Clear indication of graduation eligibility

### 💾 **Smart Data Management**

- **Local storage** - Your data is automatically saved and persists between sessions
- **Smart confirmation dialogs** - Beautiful toast notifications for data operations
- **Clear data option** - Modern confirmation system with React Hot Toast

### 🎨 **Modern UI/UX**

- **Responsive design** - Works perfectly on desktop, tablet, and mobile
- **Dark mode support** - Easy on the eyes with automatic theme detection
- **Smooth animations** - Beautiful transitions and hover effects
- **Glass morphism effects** - Modern, translucent design elements

### 📋 **Standard Grading System**

- **University-standard grades** - Common grading scale used by most universities
- **Grade point ranges** - Clear mapping from marks to grade points
- **Performance categories** - Understand what each grade means

### 🔔 **Interactive Notifications**

- **Toast notifications** - Beautiful, non-intrusive alerts using React Hot Toast
- **Confirmation dialogs** - Elegant confirmation system for critical actions
- **Success feedback** - Visual confirmation for completed actions

## 🏛️ Standard University Grading Scale

| Grade | Grade Point | Marks Range | Performance  |
| ----- | ----------- | ----------- | ------------ |
| A+    | 4.00        | 80-100      | Excellent    |
| A     | 3.75        | 75-79       | Excellent    |
| A-    | 3.50        | 70-74       | Excellent    |
| B+    | 3.25        | 65-69       | Very Good    |
| B     | 3.00        | 60-64       | Very Good    |
| B-    | 2.75        | 55-59       | Very Good    |
| C+    | 2.50        | 50-54       | Satisfactory |
| C     | 2.25        | 45-49       | Satisfactory |
| D     | 2.00        | 40-44       | Satisfactory |
| F     | 0.00        | Below 40    | Fail         |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cgpa-calculator.git
   cd cgpa-calculator
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📱 How to Use

### Adding Semesters

1. Click "Add New Semester" to create a new academic term
2. Each semester starts with a default name (can be customized)
3. Delete semesters using the trash icon (minimum 1 semester required)

### Adding Courses

1. Within each semester, click "Add Course" or "Add First Course"
2. Fill in the course details:
   - **Course Name**: Enter the full course name
   - **Credits**: Course credit hours (0.25 to 6.0 in 0.25 increments)
   - **Grade**: Select from the dropdown menu
3. Grade points are calculated automatically
4. View real-time CGPA updates next to the "Add Course" button

### Viewing Results

- **Current CGPA**: Displayed prominently at the top
- **Total Credits**: Sum of all completed course credits
- **Academic Progress**: Visual indicators of performance level
- **Semester GPA**: Individual GPA for each term

### Data Persistence

- All data is automatically saved to your browser's local storage
- Data persists between browser sessions
- Use "Clear All Data" to reset with beautiful confirmation dialog
- Toast notifications provide feedback for all data operations

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: React Hot Toast for notifications
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Storage**: Browser Local Storage
- **Icons**: Heroicons (SVG)
- **Fonts**: Inter, Geist Sans, Geist Mono

## 📂 Project Structure

```
cgpa-calculator/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and animations
│   │   ├── layout.tsx           # Root layout with metadata
│   │   └── page.tsx             # Main calculator component
│   └── components/
│       └── CGPASummaryCard.tsx  # Summary display component
├── public/                      # Static assets
├── package.json
└── README.md
```

## 🎯 Key Features Explained

### CGPA Calculation Formula

```
CGPA = Σ(Grade Point × Credit Hours) / Σ(Credit Hours)
```

### Flexible Credit Hours

- Supports increments of 0.25 credits
- Examples: 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, etc.
- Perfect for universities with fractional credit systems

### Interactive Toast System

- **Confirmation dialogs**: Elegant toast-based confirmations for critical actions
- **Success notifications**: Visual feedback for completed operations
- **Warning alerts**: Clear warnings with action buttons
- **Auto-dismiss**: Smart timing for different notification types

### Example Calculation

If you have:

- Course A: Grade A (3.75 points) × 3 credits = 11.25
- Course B: Grade B+ (3.25 points) × 4 credits = 13.00
- Total: 24.25 points ÷ 7 credits = **3.46 CGPA**

### Performance Levels

- **Excellent**: 3.75-4.00 CGPA (Green indicator)
- **Very Good**: 3.00-3.74 CGPA (Blue indicator)
- **Satisfactory**: 2.00-2.99 CGPA (Yellow indicator)
- **Need Improvement**: Below 2.00 CGPA (Red indicator)

## 🎨 Design Features

### Visual Elements

- **Glass morphism effects** with backdrop blur
- **Gradient backgrounds** for modern appeal
- **Smooth transitions** for all interactive elements
- **Custom scrollbars** for better aesthetics
- **Responsive grid layouts** for all screen sizes

### Accessibility

- **High contrast colors** for readability
- **Clear typography** with optimal font sizes
- **Keyboard navigation** support
- **Screen reader friendly** structure

## 🔧 Customization

### Changing University Information

Update the university name and details in:

- `src/app/layout.tsx` (metadata)
- `src/app/page.tsx` (header and footer)

### Modifying Grading Scale

Edit the `gradeOptions` array in `src/app/page.tsx`:

```typescript
const gradeOptions = [
  { grade: "A+", point: 4.0, range: "80-100" },
  // Add or modify grades as needed
];
```

### Credit Hour Configuration

Modify credit input constraints in the course input section:

```typescript
min = "0.25"; // Minimum credit value
max = "6"; // Maximum credit value
step = "0.25"; // Credit increment steps
```

### Toast Notification Settings

Customize toast behavior in the `clearAllData` function:

```typescript
toast.success("Message", {
  duration: 3000, // Display duration
  position: "top-center", // Position on screen
  icon: "🗑️", // Custom icon
});
```

## 📊 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

Built with ❤️ for university students worldwide.

### Contact

- 📧 Email: sohan75632@gmail.com
- 🌐 GitHub: [sohan-99](https://github.com/sohan-99)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling approach
- React Hot Toast for beautiful notification system
- University students worldwide who inspired this project

---

**Made for students, by developers who care about education** 🎓✨
