# MUNCGLOBAL Database Migration Guide

This guide explains how to migrate your SQLite database to Aiven MySQL for better persistence and reliability.

## Prerequisites

- Aiven MySQL service credentials
- Access to your current SQLite database
- Node.js and npm installed

## Step 1: Install Dependencies

```bash
cd server
npm install
```

This will install the required dependencies including `mysql2` and `sequelize`.

## Step 2: Configure Environment Variables

1. Copy the Aiven MySQL credentials to your `.env` file:

```
AIVEN_DB_HOST=your-mysql-host.aivencloud.com
AIVEN_DB_PORT=3306
AIVEN_DB_NAME=defaultdb
AIVEN_DB_USER=avnadmin
AIVEN_DB_PASSWORD=your-password
```

2. Replace the placeholder values with your actual Aiven MySQL credentials.

## Step 3: Backup Your Current Data

Before migrating, it's recommended to export your current data:

```bash
# Access your export endpoint
curl -H "x-export-key: your-export-key" https://your-app.onrender.com/api/export/download-db -o backup.db
```

Or use the built-in export endpoint in your browser:
`https://your-app.onrender.com/api/export/download-db?key=your-export-key`

## Step 4: Run the Migration

Execute the migration script:

```bash
npm run migrate
```

This will:
1. Connect to your SQLite database
2. Read all data from the tables
3. Create the necessary tables in Aiven MySQL
4. Insert all data into the new MySQL database

## Step 5: Verify the Migration

After migration, you can verify the data was transferred correctly by:

1. Connecting to your Aiven MySQL database using a client like MySQL Workbench
2. Running queries to check if all data is present
3. Testing your application with the new database connection

## Step 6: Update Your Application

Once the migration is successful, update your application to use the new MySQL database:

1. In `server/src/index.js`, import and use the Sequelize models instead of SQLite
2. Deploy your updated application to Render

## Troubleshooting

If you encounter any issues during migration:

- Check the console output for specific error messages
- Verify your Aiven MySQL credentials are correct
- Ensure your Aiven MySQL service is running and accessible
- Check that your SQLite database file exists and is accessible

## Reverting to SQLite

If needed, you can revert to using SQLite by:

1. Removing the Aiven MySQL configuration from your `.env` file
2. Ensuring your application is still configured to use SQLite

## Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Aiven MySQL Documentation](https://docs.aiven.io/docs/products/mysql)
- [MySQL Documentation](https://dev.mysql.com/doc/)
