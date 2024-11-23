# Step 1: Use the official Node.js image
FROM node:20.10.0

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Step 4: Copy the entire project
COPY . .

# Step 5: Build Prisma Client
RUN npx prisma generate

# Step 6: Expose the backend API port
EXPOSE 5000

# Step 7: Run the server in development mode
CMD ["npm", "run", "dev"]
