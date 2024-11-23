# Step 1: Use the official Node.js image
FROM node:20.10.0

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./

# Install dependencies with improved network settings
RUN npm install --legacy-peer-deps && npm cache clean --force

# Step 4: Copy the rest of the frontend code
COPY . .

# Step 5: Build the Next.js application
RUN npm run build

# Step 6: Expose the frontend port
EXPOSE 3000

# Step 7: Start the Next.js app
CMD ["npm", "run", "start"]
