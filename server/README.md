# ATS Bot Backend Setup and Run Instructions

## How to Run the Application

### Step 1: Install Yarn Globally

First, install Yarn globally on your system by running the following command:

```bash
npm install -g yarn
```

### Step 2: Install Project Dependencies

Navigate to the root directory of your project and run:

```bash
yarn install
```

This command will install all the dependencies required for the project as specified in the package.json file.

### Step 3: Configure Environment Variables

You need to set up your environment configuration:

1. Copy the example environment file to create a new .env file:

```bash
cp .env.example .env
```

(For Windows users, you may need to manually copy the file using your file explorer or use an equivalent command in your command prompt.)

2. Open the .env file in a text editor and fill in the required information such as database URLs, API keys, and any other environment-specific variables.

### Step 4: Start the Application

Start the application by running:

```bash
yarn start
```

This command will execute the start script defined in your package.json file, typically launching the server for your application.
