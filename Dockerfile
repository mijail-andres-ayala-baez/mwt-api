# Recipe to package the API in a container image.
# Two stages: "build" compiles TypeScript; "runtime" keeps only what is needed to run.

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy the dependency list first: Docker reuses this step while it does not change
COPY package.json package-lock.json ./
RUN npm ci

# Copy the code and compile it to dist/
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Only the production libraries, without the build tools
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# The node image already has a user without admin rights: use it
USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]
