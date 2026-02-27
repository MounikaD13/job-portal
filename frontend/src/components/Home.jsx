// import React from 'react'

// export default function Home() {

//   return (
//     <div className="min-h-screen bg-gray-100 flex">

//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
//         <h1 className="text-2xl font-bold text-green-600 mb-8">jobi</h1>

//         <nav className="space-y-3 text-gray-600 text-sm">
//           <button className="bg-green-100 text-green-600 w-full text-left px-4 py-2 rounded-lg">
//             Dashboard
//           </button>
//           <button className="hover:bg-gray-100 w-full text-left px-4 py-2 rounded-lg">
//             My Profile
//           </button>
//           <button className="hover:bg-gray-100 w-full text-left px-4 py-2 rounded-lg">
//             My Jobs
//           </button>
//           <button className="hover:bg-gray-100 w-full text-left px-4 py-2 rounded-lg">
//             Messages
//           </button>
//           <button className="hover:bg-gray-100 w-full text-left px-4 py-2 rounded-lg">
//             Saved Jobs
//           </button>
//         </nav>

//         <div className="mt-auto text-xs text-gray-400">
//           © 2026 jobi
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 p-8">

//         {/* Top Navbar */}
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-semibold">Dashboard</h2>

//           <div className="flex items-center gap-4">
//             <input
//               type="text"
//               placeholder="Search here..."
//               className="border px-4 py-2 rounded-lg text-sm"
//             />
//             <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
//               Post a Job
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-4 gap-6 mb-8">
//           <StatCard number="07" label="Applied Jobs" />
//           <StatCard number="03" label="Saved Jobs" />
//           <StatCard number="1.7k" label="Profile Views" />
//           <StatCard number="04" label="Shortlisted" />
//         </div>

//         {/* Bottom Section */}
//         <div className="grid grid-cols-3 gap-6">

//           {/* Chart Section */}
//           <div className="col-span-2 bg-white p-6 rounded-xl shadow">
//             <h3 className="font-semibold mb-4">Job Views</h3>
//             <div className="h-48 bg-green-50 rounded-lg flex items-center justify-center text-gray-400">
//               Chart Placeholder
//             </div>
//           </div>

//           {/* Posted Jobs */}
//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="font-semibold mb-4">Posted Jobs</h3>

//             <div className="space-y-4 text-sm">
//               <JobItem title="UI & Mobile Prototype" />
//               <JobItem title="Diamond Villa" />
//               <JobItem title="Dashboard UI" />
//               <JobItem title="Product Designer" />
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }
// function StatCard({ number, label }) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
//       <h4 className="text-2xl font-bold text-gray-800">{number}</h4>
//       <p className="text-sm text-gray-500 mt-2">{label}</p>
//     </div>
//   )
// }
// function JobItem({ title }) {
//   return (
//     <div className="flex justify-between items-center">
//       <span className="text-gray-700">{title}</span>
//       <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
//         Active
//       </span>
//     </div>
//   )
// }


// import React, { useState } from "react"
// import { Bell, Search, Menu, X } from "lucide-react"
// import { Link } from "react-router-dom"

// export default function Home() {
//   const [open, setOpen] = useState(false)

//   return (
//     <nav className="bg-white shadow-sm w-full">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">

//           {/* LEFT SIDE */}
//           <div className="flex items-center gap-8">
//             <h1 className="text-xl sm:text-2xl font-bold text-[#6f5199]">
//               Skill Scout
//             </h1>

//             {/* Desktop Menu */}
//             {/* <ul className="hidden md:flex gap-6 text-sm text-gray-600 font-medium">
//               <li className="hover:text-black cursor-pointer">Home</li>
//               <li className="hover:text-black cursor-pointer">Jobs</li>
//               <li className="hover:text-black cursor-pointer">Explore</li>
//               <li className="hover:text-black cursor-pointer">Contact</li>
//             </ul> */}
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="flex items-center gap-4">

//             {/* Desktop Search */}
//             {/* <div className="relative hidden lg:block">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-2.5 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search here..."
//                 className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#6f5199]"
//               />
//             </div> */}
//             {/* <div className="relative hidden sm:block cursor-pointer">
//               <Bell size={18} className="text-gray-600" />
//               <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#6f5199] rounded-full"></span>
//             </div> */}
//             <div className="hidden md:flex gap-3">
//               <Link
//                 to="/login"
//                 className="bg-[#6f5199] hover:bg-[#9b7feb] text-white px-3 py-2 rounded-md text-sm"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className=" bg-[#0f172a] hover:text-cyan-400 text-white px-3 py-2 rounded-md text-sm"
//               >
//                 Register
//               </Link>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden"
//               onClick={() => setOpen(!open)}
//             >
//               {open ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {open && (
//         <div className="md:hidden bg-white border-t px-4 py-4 space-y-4 shadow-sm">
//           {/* <ul className="space-y-3 text-gray-600 font-medium">
//             <li>Home</li>
//             <li>Jobs</li>
//             <li>Explore</li>
//             <li>Contact</li>
//           </ul> */}

//           <div className="pt-3 border-t space-y-3 ">
//             <Link
//               to="/login"
//               className="block w-full text-center bg-[#3fd1f2] text-white py-2 rounded-md"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="block w-full text-center bg-[#3fd1f2] text-white py-2 rounded-md"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }
import React from 'react'

export default function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/1webp.jpg')" }}
    >
      <h1 className="text-white text-4xl">
        Welcome
      </h1>
    </div>
  )
}

