Slot-Sync Frontend
The Slot-Sync frontend is a modern booking dashboard built with Next.js, React, and Tailwind CSS. It allows users to view, filter, and cancel resource bookings, and navigate to a form for creating new bookings. Check out the repository at arafat-sabbir/Slot-Sync-Client or visit the live app at https://slot-sync-client.vercel.app/.
Table of Contents

Features
Setup
Running the Frontend
Technologies
Contributing

Features

Booking Dashboard: Displays bookings grouped by resource in a responsive grid, with a fallback message ("No bookings found") when no bookings match filters.
Filters: Filter bookings by resource, date, or status (Upcoming, Ongoing, Past).
Cancel Bookings: Cancel bookings directly from the dashboard with optimistic updates.
New Booking: Link to a form for creating new bookings.
Responsive UI: Styled with Tailwind CSS and lucide-react icons for a clean, modern look.
Font Optimization: Uses next/font with Geist for optimized font loading.

Setup

Clone the Repository:
git clone https://github.com/arafat-sabbir/Slot-Sync-Client.git
cd Slot-Sync-Client


Install Dependencies:
npm install

Required packages: next, react, react-dom, date-fns, lucide-react.

Set Up Environment:Create a .env.local file in the root directory:
NEXT_PUBLIC_API_URL=http://localhost:5000/api



Running the Frontend

Ensure the backend is running at http://localhost:5000/api (see Slot-Sync-Server).
Start the Next.js app:npm run dev


Open http://localhost:3000 in your browser to view the dashboard.

Technologies

Next.js: React framework
React: UI components
Tailwind CSS: Styling
lucide-react: Icons
date-fns: Date handling
TypeScript: Type safety

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit changes (git commit -m "Add YourFeature").
Push to the branch (git push origin feature/YourFeature).
Open a pull request on GitHub.

For bugs or feature requests, please open an issue.
Deploy on Vercel
The easiest way to deploy this Next.js app is via the Vercel Platform. Ensure the NEXT_PUBLIC_API_URL is set to https://slot-sync-server.vercel.app/api in your Vercel environment variables.