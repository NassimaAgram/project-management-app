import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { FileText, CheckCircle, Clock } from "lucide-react";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl dark:bg-dark-secondary dark:text-white">
      {/* Attachments Section */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-200">
            Attachments
          </h3>
          <div className="flex flex-wrap gap-4">
            {task.attachments.map((attachment, index) => (
              <Image
                key={index}
                src={`/${attachment.fileURL}`}
                alt={attachment.fileName}
                width={200}
                height={100}
                className="rounded-lg border border-gray-300 shadow-md dark:border-gray-600"
              />
            ))}
          </div>
        </div>
      )}

      {/* Task Information */}
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {task.title}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              task.priority === "High" || "Urgent"
                ? "bg-red-100 text-red-600"
                : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.priority} Priority
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300">
          {task.description || "No description provided."}
        </p>

        {/* Status */}
        <div className="flex items-center space-x-2">
          {task.status === "Completed" ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <Clock className="text-yellow-500" />
          )}
          <p
            className={`font-semibold ${
              task.status === "Completed"
                ? "text-green-500"
                : "text-yellow-500"
            }`}
          >
            {task.status}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
          <div>
            <p className="text-sm font-semibold">Start Date</p>
            <p>{task.startDate ? format(new Date(task.startDate), "P") : "Not set"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Due Date</p>
            <p>{task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}</p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Tags:
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {task.tags || "No tags"}
          </p>
        </div>

        {/* Author and Assignee */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Author:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {task.author ? task.author.username : "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Assignee:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {task.assignee ? task.assignee.username : "Unassigned"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
