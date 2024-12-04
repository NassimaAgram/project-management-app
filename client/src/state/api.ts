import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { User as ClerkUser } from "@clerk/nextjs/server";
import { toast } from "sonner";

// Define your interfaces here
export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  [x: string]: any;
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  clerkID?: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      // Get Clerk token from the current session
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    // Make the API request
    const result: any = await baseQuery(args, api, extraOptions);

    // If there is an error in the response, handle it
    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error: ${errorMessage}`);
      return { error: { status: "FETCH_ERROR", error: errorMessage } }; // Ensure error is returned
    }

    // For mutation requests, show success messages
    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";
    if (isMutationRequest && result.data?.message) {
      toast.success(result.data.message);
    }

    // Normalize the response data if present
    if (result.data) {
      return { data: result.data.data }; // Ensure data is returned
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null }; // Handle 204 and similar status codes
    }

    // If no result or error, return an empty object (fix for unhandled cases)
    return { error: { status: "NO_DATA", error: "No data received" } };
  } catch (error: unknown) {
    // Handle unknown errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: { status: "FETCH_ERROR", error: errorMessage } }; // Return error object
  }
};


export const api = createApi({
  baseQuery: customBaseQuery, // Use the custom query with Clerk token
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    /* 
    ===============
    USER CLERK
    =============== 
    */
    createUser: build.mutation<User, Partial<User>>({
      query: (user) => ({
        url: "users", // Assuming your API endpoint is /users
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"], 
    }),    
    getAuthUser: build.query<any, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          // Call your server-side handler to get the authenticated user
          const res = await fetch("/state/server-handler");
          if (!res.ok) {
            throw new Error("Unauthorized or user not found");
          }

          const user = await res.json();

          // If user doesn't exist, handle accordingly
          if (!user || !user.id) {
            throw new Error("User data not found");
          }

          // Return user data if found
          return { data: user };
        } catch (error: any) {
          return { error: error.message || "Unexpected error occurred" };
        }
      },
    }), 
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
      // Ensure proper return of data
      transformResponse: (response) => {
        return response.data || []; // Return an empty array if no projects
      },
    }),    
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
} = api;
