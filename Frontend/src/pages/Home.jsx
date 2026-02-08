import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">


      <div
        className="absolute inset-0 bg-[url('/images/home-bg.png')] bg-cover bg-center bg-no-repeat"
      />


      <div className="absolute inset-0 bg-linear-to-b from-cyan-600/70 via-cyan-400/60 to-cyan-200/50 z-0"></div>


      <div className="relative z-10 px-4 flex flex-col items-center justify-center pb-24 md:pb-32 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-15 drop-shadow-2xl text-white leading-tight">
          Streamline Your Workflow. <br /> Achieve More Together.
        </h1>
        <p className="text-base md:text-lg text-cyan-50 max-w-2xl mb-8 font-medium drop-shadow-lg">
          The ultimate task management platform for modern teams. Organize, collaborate, and deliver projects on time, every time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <Link
            to="/home/workflow"
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-500 text-white rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform duration-150 font-semibold w-max cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Workflow
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2 border-2 border-cyan-600 text-cyan-600 rounded-lg bg-white transition font-medium w-max cursor-pointer"
          >
            Join Project
          </button>
        </div>
      </div>


      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          viewBox="0 0 1440 120"
          className="block w-full h-15 md:h-30"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C240,100 480,120 720,120 960,120 1200,100 1440,0 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};
