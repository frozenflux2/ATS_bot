# ATS Bot Frontend Setup and Run Instructions

## How to Run the Application

### Step 1: Install Project Dependencies

Navigate to the root directory of your frontend project and run the following command to install all the necessary dependencies:

```bash
npm install
```

### Step 2: Configure Environment Variables

You need to configure the environment variables required by your application:

1. Copy the example environment file to create a new .env file:

```bash
cp .env.example .env
```

(For Windows users, you may need to manually copy the file using your file explorer or use an equivalent command in your command prompt.)

2. Open the .env file in a text editor and fill in the required information such as API keys, URLs, or any specific environment configurations your application needs.

### Step 3: Start the Application

Start the frontend application by running:

```bash
npm start
```

This command will typically start a local development server and launch your application in the default web browser.
