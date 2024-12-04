# Step 1: Use the official Node.js image for the build stage
FROM node:20.10.0 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Step 4: Copy the entire project
COPY . .

# Step 5: Generate Prisma Client and build the app
RUN npx prisma generate
RUN npm run build

# Step 6: Remove development dependencies to keep the build lightweight
RUN npm prune --production

# Step 7: Use a smaller Node.js image for the runtime stage
FROM node:20.10.0-slim AS runtime

# Step 8: Set the working directory inside the runtime container
WORKDIR /app

# Step 9: Copy only necessary files from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

# Step 10: Create a non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser
USER appuser

# Step 11: Expose the backend API port
EXPOSE 5000

# Step 12: Set environment variables (adjust as needed)
ENV NODE_ENV=production

# Step 13: Run the server
CMD ["node", "dist/index.js"]
