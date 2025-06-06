# The Architect 🏛️

&gt; Your daily co-pilot for building a better you, one prescribed action at a time.

The Architect is a web application designed to combat decision fatigue and foster consistency. Instead of presenting you with endless choices, it provides a clear, prescribed set of daily actions, alongside tools to track your own custom habits. It's built on the philosophy of "prescription over permission" to help you build momentum and achieve your goals.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&amp;logo=react&amp;logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&amp;logo=vite&amp;logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&amp;logo=typescript&amp;logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&amp;logo=tailwind-css&amp;logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-181818?style=for-the-badge&amp;logo=supabase&amp;logoColor=white)

---

## ✨ v0 Features (Current MVP)

The initial version of The Architect is focused on establishing the core experience.

### 1. Daily Dashboard
The central hub of the application. It presents a clean, date-focused view of your daily tasks.

### 2. Prescriptive Systems (The "Big Four")
These are four non-negotiable daily habits prescribed by the app to build a foundation for well-being.
-   **💪 Workout:** A simple binary tracker for daily physical activity.
-   **📖 Reading:** A binary tracker to encourage daily learning.
-   **🥗 Diet:** A binary tracker for maintaining a clean diet.
-   **🤝 Social Mission:** A unique, daily rotating challenge to improve social skills and build connections.

### 3. Custom Systems
Create and track your own habits. The Architect supports two types of custom trackers:
-   **Binary:** For yes/no habits (e.g., "Did I meditate?").
-   **Numeric:** For quantifiable habits (e.g., "Pages read," "Minutes of focused work").

### 4. Seamless Date Navigation
Easily move between days using an intuitive calendar popover to log or review past activities.

### 5. Secure Backend with Supabase
-   **User Authentication:** Secure sign-up and login using email and password.
-   **Data Persistence:** All user data, including logs and custom systems, is saved to a PostgreSQL database.
-   **Row Level Security (RLS):** RLS is enabled on all tables to ensure users can only access their own data.

---

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/) (with Vite), [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/) (Icons)
-   **Backend as a Service (BaaS):** [Supabase](https://supabase.io/) (Authentication, Database, APIs)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Forms:** [React Hook Form](https://react-hook-form.com/)
-   **Date Management:** [date-fns](https://date-fns.org/)

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
-   Node.js (v18 or later)
-   npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/the-architect-app.git
cd the-architect-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase
1.  Create a new project on [Supabase](https://supabase.com/).
2.  In your Supabase project, go to the SQL Editor and run the contents of `supabase/migrations/create_initial_schema.sql` to set up the necessary tables and policies.
3.  Create a `.env` file in the root of the project.
4.  Find your Project URL and `anon` key in your Supabase project's **Settings &gt; API** section.
5.  Add these keys to your `.env` file:

    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

### 4. Run the Development Server
```bash
npm run dev
```
The application should now be running on `http://localhost:5173`.

---

## 🗺️ Future Roadmap (v1 and Beyond)

-   **Streak Counters:** Visualize consistency with streak indicators for each system.
-   **Advanced Analytics:** Charts and graphs to show progress over time.
-   **Weekly/Monthly Reviews:** Automated summaries of your accomplishments.
-   **Gamification:** Achievements, points, and other motivational elements.
-   **Mobile App:** A native mobile experience using React Native / Expo.
