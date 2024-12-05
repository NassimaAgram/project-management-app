import { Project } from "@/state/api";
import React from "react";

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg hover:scale-105 transition-all duration-200 dark:bg-dark-secondary dark:text-white">
      {/* Project Name */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.name}</h3>
      
      {/* Project Description */}
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {project.description || "No description available."}
      </p>

      {/* Start and End Dates */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
