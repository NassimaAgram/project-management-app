"use client";

import { useAppSelector } from "@/state/store";
import Header from "@/components/Header";
import ModalNewTask from "@/components/ModalNewTask";
import TaskCard from "@/components/TaskCard";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import {
  Priority,
  Task,
  useGetAuthUserQuery,
  useGetTasksByUserQuery,
  useGetUsersQuery,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  // State
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Hooks
  const { user } = useUser();
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useGetUsersQuery();

  // Find the current user
  const currentUser = user
    ? users?.find((currentUser) => currentUser.email === user.emailAddresses[0]?.emailAddress)
    : null;


  const userId = currentUser?.userId;

  // Tasks query
  const { data: tasks, isLoading: isTasksLoading, isError: isTasksError } = useGetTasksByUserQuery(
    userId || 0,
    { skip: !userId }
  );

  // Filter tasks based on priority
  const filteredTasks = tasks?.filter((task: Task) => task.priority === priority);

  // Render Conditions
  if (isUsersLoading || !user) {
    return <p className="dark:text-white">Loading user data...</p>;
  }

  if (isUsersError) {
    return <div className="dark:text-white">Error loading user data</div>;
  }

  if (isTasksError) {
    return <div className="dark:text-white">Error fetching tasks</div>;
  }

  // Now that we have `currentUser`, we can safely use it
  console.log("user id " + userId);

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <Button
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </Button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${view === "list" ? "bg-gray-300" : "bg-white"
            } rounded-l`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${view === "table" ? "bg-gray-300" : "bg-white"
            } rounded-l`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {isTasksLoading  ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks?.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTasks && (
          <div className="z-0 w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
