# MUNCGLOBAL MySQL Migration Guide

This document provides details about the migration from SQLite to Aiven MySQL for the MUNCGLOBAL project.

## Migration Overview

The MUNCGLOBAL application has been migrated from SQLite to Aiven MySQL for improved reliability, scalability, and persistence. This migration ensures that your data remains intact even when Render rebuilds your application.

## What Changed

1. **Database Engine**: Changed from SQLite (file-based) to Aiven MySQL (cloud-hosted)
2. **ORM**: Added Sequelize ORM for database interactions
3. **Routes**: Updated all API routes to use Sequelize models
4. **Data Export**: Enhanced data export functionality for MySQL

## Configuration

The MySQL connection is configured with the following environment variables in your `.env` file:

```
AIVEN_DB_HOST=krem-kremlin-0821.g.aivencloud.com
AIVEN_DB_PORT=27945
AIVEN_DB_NAME=muncglobal
AIVEN_DB_USER=avnadmin
AIVEN_DB_PASSWORD=AVNS_kZLVJsoI3kPE_36vM5r
```

## Database Models

The following Sequelize models have been created:

1. **Registration**: Stores user registration information
2. **Payment**: Stores payment records linked to registrations
3. **PaymentInitialization**: Stores payment initialization records

## Accessing Your Data

### API Endpoints

All existing API endpoints continue to work as before. The data is now stored in Aiven MySQL instead of SQLite.

### Data Export

You can export your data using the following endpoints:

- **JSON Export**: `/api/export/registrations?key=your-export-key`
- **CSV Export**: `/api/export/registrations/csv?key=your-export-key`
- **Complete Data**: `/api/export/complete?key=your-export-key`
- **Database Backup**: `/api/export/download-db?key=your-export-key`

The export key is defined in your `.env` file as `EXPORT_KEY`.

## Deployment Considerations

When deploying to Render:

1. Make sure all required environment variables are set in the Render dashboard
2. The application will automatically connect to Aiven MySQL on startup
3. No need to worry about SQLite database files being overwritten during deployments

## Troubleshooting

If you encounter any issues with the MySQL connection:

1. **Connection Errors**: Check that your Aiven MySQL service is running and the credentials are correct
2. **Migration Errors**: Run the migration script again with `npm run migrate`
3. **Data Inconsistencies**: Use the data export endpoints to verify your data

## Reverting to SQLite (Emergency Only)

If you need to revert to SQLite temporarily:

1. Rename `src/routes/MySQLRegistration.js` to `src/routes/MySQLRegistration.js.bak`
2. Rename `src/routes/MySQLDataExportRoutes.js` to `src/routes/MySQLDataExportRoutes.js.bak`
3. Update `src/index.js` to use the original routes:
   ```javascript
   import registrationRoutes from './routes/registration.js';
   import dataExportRoutes from './routes/dataExportRoutes.js';
   ```
4. Remove the database initialization code from `src/index.js`

## Future Improvements

Consider implementing the following improvements:

1. **Connection Pooling**: Optimize database connections for high traffic
2. **Automated Backups**: Schedule regular backups of your MySQL database
3. **Monitoring**: Add database monitoring and alerting

## Support

If you need assistance with your Aiven MySQL database, contact Aiven support or refer to their documentation at [https://docs.aiven.io/docs/products/mysql](https://docs.aiven.io/docs/products/mysql).
