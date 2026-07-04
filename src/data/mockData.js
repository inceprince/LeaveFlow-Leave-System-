export const announcements = [
  {
    id: 1,
    title: "Q3 Performance Reviews Starting Next Week",
    content: "Dear Team, We are pleased to announce that our Q3 performance review cycle will begin on July 10th. All employees are required to complete their self-assessment forms by July 14th. Managers will schedule one-on-one meetings between July 15th–20th. Please ensure all your project documentation is up to date before your review session. HR will send calendar invites by end of this week. Rating criteria remain unchanged: Impact, Collaboration, Growth, and Ownership. For any queries, contact hr@company.com.",
    date: "2026-07-01",
    category: "HR",
    priority: "high",
    author: "HR Department"
  },
  {
    id: 2,
    title: "Office Closure – Independence Day",
    content: "Please note that our offices will remain closed on July 4th, 2026 in observance of Independence Day. All teams should plan their work accordingly and ensure critical deliverables are completed before the holiday. Emergency support will be available via the on-call rotation system. Enjoy the long weekend and stay safe!",
    date: "2026-06-28",
    category: "Holiday",
    priority: "medium",
    author: "Administration"
  },
  {
    id: 3,
    title: "Enhanced Health Insurance Benefits – FY 2026-27",
    content: "We are excited to announce upgraded health insurance benefits for FY 2026-27. Key highlights: family coverage limit raised to $500,000; dental and vision care now fully included; mental health sessions increased from 10 to 20 per year; cashless treatment available at 500+ new network hospitals. Open enrollment starts July 15th. Review the detailed benefits guide sent to your email and submit enrollment forms by July 25th. Contact benefits@company.com for assistance.",
    date: "2026-06-25",
    category: "Benefits",
    priority: "high",
    author: "HR Benefits Team"
  },
  {
    id: 4,
    title: "All-Hands Meeting – Product Roadmap H2 2026",
    content: "You are invited to our quarterly all-hands meeting on July 8th at 2:00 PM IST. CEO Rajesh Kumar will present the company vision and H2 2026 product roadmap. Product leads will share status updates on current initiatives followed by an open Q&A session. The meeting will be held in Conference Hall A at HQ and live-streamed for remote employees. A Zoom link will be shared 24 hours in advance. Attendance is mandatory for all full-time employees.",
    date: "2026-06-22",
    category: "Company",
    priority: "medium",
    author: "Executive Office"
  },
  {
    id: 5,
    title: "Hybrid Work Policy Update – Effective August 1st",
    content: "Effective August 1st 2026, the hybrid work policy is being updated. Employees must work from office a minimum of 3 days per week. Monday, Wednesday, and Friday are designated office days. Remote work on Tuesdays and Thursdays remains optional with manager approval. Team leads must maintain at least 80% in-office attendance across their teams. The updated policy document is available on the intranet. Please acknowledge receipt via the HR portal by July 20th.",
    date: "2026-06-18",
    category: "Policy",
    priority: "high",
    author: "Management"
  },
  {
    id: 6,
    title: "New Cafeteria Vendor & Menu Starting July 1st",
    content: "Starting July 1st, we have partnered with FreshBite to revamp cafeteria offerings. The new menu includes a healthy salad bar, rotating regional cuisines each week, expanded vegan and gluten-free options, and freshly brewed artisan coffee. Breakfast hours: 8:00–10:00 AM. Lunch hours extended to 1:30–2:30 PM. Feedback forms are available at the cafeteria counter. We hope you enjoy the new dining experience!",
    date: "2026-06-15",
    category: "Facilities",
    priority: "low",
    author: "Admin Team"
  }
];

export const teamMembers = [
  { id: 1, name: "Priya Sharma", role: "Senior Frontend Developer", department: "Engineering", email: "priya.sharma@company.com", phone: "+91 98765 43210", status: "active", location: "Bangalore" },
  { id: 2, name: "Rahul Gupta", role: "Backend Engineer", department: "Engineering", email: "rahul.gupta@company.com", phone: "+91 87654 32109", status: "on-leave", location: "Mumbai" },
  { id: 3, name: "Anita Desai", role: "Product Manager", department: "Product", email: "anita.desai@company.com", phone: "+91 76543 21098", status: "active", location: "Delhi" },
  { id: 4, name: "Vikram Singh", role: "DevOps Engineer", department: "Engineering", email: "vikram.singh@company.com", phone: "+91 65432 10987", status: "active", location: "Hyderabad" },
  { id: 5, name: "Meera Nair", role: "UX Designer", department: "Design", email: "meera.nair@company.com", phone: "+91 54321 09876", status: "active", location: "Bangalore" },
  { id: 6, name: "Arjun Patel", role: "Data Analyst", department: "Analytics", email: "arjun.patel@company.com", phone: "+91 43210 98765", status: "active", location: "Pune" },
  { id: 7, name: "Kavya Reddy", role: "QA Engineer", department: "Engineering", email: "kavya.reddy@company.com", phone: "+91 32109 87654", status: "on-leave", location: "Hyderabad" },
  { id: 8, name: "Sanjay Kumar", role: "HR Manager", department: "Human Resources", email: "sanjay.kumar@company.com", phone: "+91 21098 76543", status: "active", location: "Delhi" },
  { id: 9, name: "Deepika Joshi", role: "Full Stack Developer", department: "Engineering", email: "deepika.joshi@company.com", phone: "+91 10987 65432", status: "active", location: "Bangalore" },
  { id: 10, name: "Arun Mehta", role: "Marketing Lead", department: "Marketing", email: "arun.mehta@company.com", phone: "+91 09876 54321", status: "active", location: "Mumbai" },
  { id: 11, name: "Sneha Iyer", role: "Business Analyst", department: "Analytics", email: "sneha.iyer@company.com", phone: "+91 98760 43218", status: "active", location: "Chennai" },
  { id: 12, name: "Rohit Verma", role: "iOS Developer", department: "Engineering", email: "rohit.verma@company.com", phone: "+91 87651 32107", status: "active", location: "Gurgaon" }
];

export const attendanceData = {
  currentMonth: {
    present: 18,
    absent: 1,
    onLeave: 2,
    holidays: 1,
    totalWorkingDays: 22,
    percentage: 90
  },
  recentAttendance: [
    { date: "2026-07-03", checkIn: "09:05 AM", checkOut: "06:10 PM", status: "present", hours: "9h 05m" },
    { date: "2026-07-02", checkIn: "08:55 AM", checkOut: "06:00 PM", status: "present", hours: "9h 05m" },
    { date: "2026-07-01", checkIn: "-",        checkOut: "-",         status: "leave",   hours: "-" },
    { date: "2026-06-30", checkIn: "09:15 AM", checkOut: "06:05 PM", status: "present", hours: "8h 50m" },
    { date: "2026-06-29", checkIn: "-",        checkOut: "-",         status: "weekend", hours: "-" },
    { date: "2026-06-28", checkIn: "-",        checkOut: "-",         status: "weekend", hours: "-" },
    { date: "2026-06-27", checkIn: "09:00 AM", checkOut: "06:15 PM", status: "present", hours: "9h 15m" },
    { date: "2026-06-26", checkIn: "09:10 AM", checkOut: "06:00 PM", status: "present", hours: "8h 50m" },
    { date: "2026-06-25", checkIn: "-",        checkOut: "-",         status: "absent",  hours: "-" },
    { date: "2026-06-24", checkIn: "09:02 AM", checkOut: "06:05 PM", status: "present", hours: "9h 03m" }
  ]
};
