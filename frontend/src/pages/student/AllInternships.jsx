import { IoBriefcase } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import NoDataUI from "../../components/ui/NoDataUI";
import { useInternships } from "../../context/useInternships";
import { useAuth } from "../../context/AuthContext.jsx"; // add your auth hook path
import AddInternship from "./AddInternship";
import { useState, useEffect } from "react";


const AllInternships = ({ selectedOption }) => {
  return <ShowSettingsContent selectedOption={selectedOption} />;
};

const ShowSettingsContent = ({ selectedOption }) => {
  const { allRelated, setAllRelated } = useInternships(); // if your context exposes setter, use it; otherwise keep local state
  const { user } = useAuth(); // expects user.role === "admin"
  const [localRelated, setLocalRelated] = useState(allRelated || []);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setLocalRelated(allRelated || []);
  }, [allRelated]);

  const handleAdded = (newItem) => {
    // update local and (optionally) global context
    setLocalRelated((p) => [newItem, ...p]);
    if (typeof setAllRelated === "function") setAllRelated((p) => [newItem, ...p]);
    setShowAdd(false);
  };

  return (
    <div className="mt-4 p-4 bg-[#1C2222] rounded-md border-[.1rem] border-[var(--primary-text-muted)]">
      <div className="">
        <h2 className="text-2xl font-semibold">{selectedOption.heading}</h2>
        <p className="text-sm text-[var(--primary-text-muted)]">
          {selectedOption.subheading}
        </p>
      </div>

      {/* admin-only Add button */}
      {user?.role === "admin" && (
        <div className="mt-3">
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="bg-[#FFE066] text-black px-3 py-1 rounded-md text-sm font-semibold"
          >
            {showAdd ? "Close" : "Add Internship"}
          </button>
        </div>
      )}

      {showAdd && user?.role === "admin" && (
        <AddInternship onAdded={handleAdded} />
      )}

      <div className="mt-4 flex flex-wrap gap-4">
        {localRelated.length === 0 ? (
          <NoDataUI />
        ) : (
          <SettingsCardWrapper allRelatedInternships={localRelated} />
        )}
      </div>
    </div>
  );
};

// const ShowSettingsContent = ({ selectedOption }) => {
//   const { allRelated } = useInternships();

//   return (
//     <div className="mt-4 p-4 bg-[#1C2222] rounded-md border-[.1rem] border-[var(--primary-text-muted)]">
//       <div className="">
//         <h2 className="text-2xl font-semibold">{selectedOption.heading}</h2>
//         <p className="text-sm text-[var(--primary-text-muted)]">
//           {selectedOption.subheading}
//         </p>
//       </div>
//       <div className="mt-4 flex flex-wrap gap-4">
//         {allRelated.length === 0 ? (
//           <NoDataUI />
//         ) : (
//           <SettingsCardWrapper allRelatedInternships={allRelated} />
//         )}
//       </div>
//     </div>
//   );
// };

// const SettingsCardWrapper = ({ allRelatedInternships }) => {
//   return allRelatedInternships.map((data, i) => (
//     <SettingsCard key={i} {...data} />
//   ));
// };

const SettingsCard = (props) => {
  // Redirect user to the apply link
  const handleApply = () => {
    window.open(props.applyLink, "_blank"); // opens in new tab
    // OR use: window.location.href = internship.applyLink; // same tab
  };

  return (
    <div className="border-[.1rem] h-fit w-[22rem] p-6 rounded-lg text-[var(--primary-text-muted)] bg-[#1a1a1a] shadow-md">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-white">{props.program}</h2>
        <h3 className="flex items-center gap-2 text-sm">
          <IoBriefcase />
          {props.organization}
        </h3>
      </div>

      {/* Perks */}
      <p className="text-sm italic">{props.perks}</p>

      {/* Skills */}
      <div className="my-4">
        <p className="text-sm mb-1">Requirements:</p>
        <div className="flex flex-wrap gap-2">
          {props.skills.map((skill) => (
            <SettingCardSkills key={skill} skill={skill} />
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="my-3 text-sm space-y-1">
        <p className="flex items-center gap-2">
          <IoLocationSharp /> {props.location}
        </p>
        <p className="flex items-center gap-2">
          <FaRupeeSign /> {props.stipend || "Not specified"}
        </p>
        <p>
          <strong>Duration:</strong> {props.duration}
        </p>
        <p>
          <strong>Eligibility:</strong> {props.eligibility}
        </p>
        <p>
          <strong>Mode:</strong> {props.mode}
        </p>
        {props.contact_details && (
          <p>
            <strong>Contact:</strong>
            <a
              href={props.contact_details}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              {props.contact_details}
            </a>
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        className="bg-[#FFE066] text-black w-full py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-yellow-400 transition"
        onClick={handleApply}
      >
        Apply Now
      </button>
    </div>
  );
};

const SettingCardSkills = ({ skill }) => {
  return (
    <span className="bg-[#2B3434] text-white rounded-xl px-2 text-xs py-1">
      {skill}
    </span>
  );
};

export default AllInternships;
