# MUNCGLOBAL Server

Backend server for the MUNCGLOBAL website, handling registration, payment processing, and delegate management.

## Features

- Registration API for MUNC-GH 2025 conference
- Payment processing with Paystack integration
- Unique delegate ID generation
- Email notifications
- SQLite database for data storage

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd muncglobal-project/server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
5. Edit the `.env` file with your configuration values

### Running the Server

#### Development Mode

```
npm run dev
```

This starts the server with nodemon for automatic reloading during development.

#### Production Mode

```
npm start
```

## API Documentation

### Registration Endpoints

#### Register a Delegate

- **URL**: `/api/registration`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "firstName": "John",
    "middleName": "",
    "surname": "Doe",
    "dateOfBirth": "2000-01-01",
    "gender": "Male",
    "phoneNumber": "0201234567",
    "postalAddress": "P.O. Box 123, Accra",
    "email": "john.doe@example.com",
    "institution": "University of Ghana",
    "programOfStudy": "Political Science",
    "educationalLevel": "Undergraduate",
    "nationality": "Ghanaian",
    "city": "Accra",
    "emergencyContactName": "Jane Doe",
    "emergencyContactNumber": "0209876543",
    "emergencyContactRelationship": "Parent",
    "specialNeeds": "",
    "previousMunExperience": false,
    "referralSource": "Social Media",
    "paymentInfo": {
      "transactionId": "MUNC-123456789",
      "amount": 900,
      "status": "success",
      "method": "mobile_money"
    }
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Registration successful",
    "data": {
      "delegateId": "jdoe-ab123",
      "registrationId": 1
    }
  }
  ```

#### Get Registration by Delegate ID

- **URL**: `/api/registration/:delegateId`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "registration": {
        "delegate_id": "jdoe-ab123",
        "first_name": "John",
        "surname": "Doe",
        "email": "john.doe@example.com",
        "...": "..."
      },
      "payment": {
        "transactionId": "MUNC-123456789",
        "amount": 900,
        "status": "success",
        "paymentMethod": "mobile_money",
        "paymentDate": "2025-07-20T12:00:00.000Z"
      }
    }
  }
  ```

#### Get All Registrations (Admin Only)

- **URL**: `/api/registration`
- **Method**: `GET`
- **Headers**: `x-api-key: your_admin_api_key`
- **Response**:
  ```json
  {
    "status": "success",
    "results": 2,
    "data": {
      "registrations": [
        {
          "id": 1,
          "delegate_id": "jdoe-ab123",
          "...": "..."
        },
        {
          "id": 2,
          "delegate_id": "jsmith-cd456",
          "...": "..."
        }
      ]
    }
  }
  ```

### Payment Endpoints

#### Initialize Payment

- **URL**: `/api/payment/initialize`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "amount": 900,
    "firstName": "John",
    "surname": "Doe"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Payment initialized",
    "data": {
      "authorization_url": "https://checkout.paystack.com/MUNC-123456789",
      "access_code": "access_code_abc123",
      "reference": "MUNC-123456789"
    }
  }
  ```

#### Verify Payment

- **URL**: `/api/payment/verify`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "reference": "MUNC-123456789"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Payment verified successfully",
    "data": {
      "transactionId": "MUNC-123456789",
      "amount": 900,
      "status": "success",
      "method": "mobile_money",
      "currency": "GHS",
      "paidAt": "2025-07-20T12:00:00.000Z"
    }
  }
  ```

#### Get Payment Details

- **URL**: `/api/payment/:transactionId`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "transactionId": "MUNC-123456789",
      "amount": 900,
      "status": "success",
      "paymentMethod": "mobile_money",
      "paymentDate": "2025-07-20T12:00:00.000Z",
      "delegateId": "jdoe-ab123",
      "delegateName": "John Doe",
      "delegateEmail": "john.doe@example.com"
    }
  }
  ```

## Database Schema

### Registrations Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| delegate_id | TEXT | Unique delegate identifier |
| first_name | TEXT | First name |
| middle_name | TEXT | Middle name (optional) |
| surname | TEXT | Surname |
| date_of_birth | TEXT | Date of birth |
| gender | TEXT | Gender |
| phone_number | TEXT | Phone number |
| postal_address | TEXT | Postal address |
| email | TEXT | Email address |
| institution | TEXT | Educational institution |
| program_of_study | TEXT | Program of study |
| educational_level | TEXT | Educational level |
| nationality | TEXT | Nationality |
| city | TEXT | City |
| emergency_contact_name | TEXT | Emergency contact name |
| emergency_contact_number | TEXT | Emergency contact phone number |
| emergency_contact_relationship | TEXT | Relationship to emergency contact |
| special_needs | TEXT | Special needs (optional) |
| previous_mun_experience | BOOLEAN | Previous MUN experience |
| referral_source | TEXT | How they heard about the conference |
| created_at | TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | Last update date |

### Payments Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| registration_id | INTEGER | Foreign key to registrations table |
| transaction_id | TEXT | Unique transaction identifier |
| amount | REAL | Payment amount |
| status | TEXT | Payment status |
| payment_method | TEXT | Payment method |
| payment_date | TIMESTAMP | Payment date |
