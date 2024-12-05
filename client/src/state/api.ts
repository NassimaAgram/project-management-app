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
      console.log("token :" + token);
      console.log("Raw API token:", token);
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
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || {}; // Return response or an empty object
      },
    }),
    getAuthUser: build.query<any, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          if (typeof window === "undefined") {
            throw new Error("Client-side only logic");
          }

          // Get the Clerk session and user details
          const session = await window.Clerk?.session?.getToken(); // Get session token
          if (!session) throw new Error("No session found");

          const user = await window.Clerk?.user; // Get current user from Clerk
          if (!user) throw new Error("No user found");

          // Extract only serializable data from the Clerk user object
          const userDetails = {
            id: user.id,
            username: user.username,
            email: user.emailAddresses[0]?.emailAddress,
          };

          // Optionally, you can fetch additional user data from your API, if required
          const userId = user.id; // Get userId from Clerk user

          // Fetch user details from your API, if necessary
          const userDetailsResponse = await fetchWithBQ(`users/${userId}`);
          const additionalUserDetails = userDetailsResponse.data as User;

          console.log("Raw API Response:", userDetailsResponse); // Debugging
          // Merge Clerk data with API data (if required)
          return { data: { ...userDetails, additionalUserDetails } };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || []; // Ensure that you handle cases when `data` is undefined
      },
    }),

    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || {}; // Return response or an empty object
      },
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || []; // Return empty array if no tasks
      },
    }),

    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
      transformResponse: (response) => {
        console.log("Raw API priority Response:", response); // Debugging
        return response || {}; // Return response or an empty object
      },
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || {}; // Return response or an empty object
      },
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
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || []; // Return empty array if no users
      },
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || []; // Return empty array if no teams
      },
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
      transformResponse: (response) => {
        console.log("Raw API Response:", response); // Debugging
        return response || { tasks: [], projects: [], users: [] }; // Default to empty arrays
      },
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
