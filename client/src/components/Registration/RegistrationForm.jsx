import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Helper function to generate unique registration code
const generateUniqueCode = () => {
  const prefix = 'MUNC';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// API base URL - hardcoded to local server for testing
const API_BASE_URL = 'https://muncglobal-project-server.onrender.com/api';

// Form validation schema
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  middleName: yup.string(),
  surname: yup.string().required('Surname is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  postalAddress: yup.string(), 
  institution: yup.string().required('Institution name is required'),
  programOfStudy: yup.string().when('educationalLevel', {
    is: 'TERTIARY',
    then: () => yup.string().required('Program of study is required for tertiary students'),
    otherwise: () => yup.string()
  }),
  educationalLevel: yup.string().required('Educational level is required'),
  nationality: yup.string().required('Nationality is required'),
  city: yup.string().required('City is required'),
  emergencyContact: yup.string().required('Emergency contact name is required'),
  emergencyPhone: yup.string().required('Emergency contact phone is required'),
  emergencyRelationship: yup.string().required('Relationship with emergency contact is required'),
  specialNeeds: yup.string().required('Please indicate if you have any physical/dietary needs'),
  specialNeedsDetails: yup.string().when('specialNeeds', {
    is: 'Yes',
    then: () => yup.string().required('Please specify your physical/dietary needs'),
    otherwise: () => yup.string()
  }),
  previousExperience: yup.string().required('Please indicate if you have previous MUN experience'),
  howHeard: yup.string().required('Please tell us how you heard about us'),
  howHeardOther: yup.string().when('howHeard', {
    is: 'Other',
    then: () => yup.string().required('Please specify how you heard about us'),
    otherwise: () => yup.string()
  }),
  agreeTerms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions')
});

const RegistrationForm = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [howHeardSource, setHowHeardSource] = useState('');
  const toast = useToast();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      specialNeeds: '',
      specialNeedsDetails: ''
    }
  });
  
  // Watch values for conditional fields
  const watchSpecialNeeds = watch('specialNeeds');
  const watchHowHeard = watch('howHeard');
  
  const handleFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Generate unique registration code
      const registrationCode = generateUniqueCode();
      
      // Check if email already exists
      const emailCheckResponse = await axios.get(`${API_BASE_URL}/registration/email/${data.email}`);
      if (emailCheckResponse.data.exists) {
        toast.error('This email is already registered. Please use a different email address.');
        setIsSubmitting(false);
        return;
      }
      
      // Format data for backend
      const registrationData = {
        firstName: data.firstName,
        middleName: data.middleName || '',
        surname: data.surname,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        email: data.email,
        phoneNumber: data.phone,
        postalAddress: data.postalAddress || '',
        institution: data.institution,
        programOfStudy: data.programOfStudy || '',
        educationalLevel: data.educationalLevel,
        nationality: data.nationality,
        city: data.city,
        committeePreference: 'To be assigned', // Committee will be assigned by organizers
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        emergencyRelationship: data.emergencyRelationship,
        specialNeeds: data.specialNeeds,
        specialNeedsDetails: data.specialNeeds === 'Yes' ? data.specialNeedsDetails : '',
        previousExperience: data.previousExperience,
        howHeard: data.howHeard,
        howHeardOther: data.howHeard === 'Other' ? data.howHeardOther : '',
        registrationCode
      };
      
      // Store registration data in session storage for later submission after payment
      sessionStorage.setItem('pendingRegistration', JSON.stringify(registrationData));
      
      // Pass the enriched data to parent component for payment processing
      onSubmit(registrationData);
      
      toast.success('Registration data validated! Proceeding to payment...');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'There was an error submitting your registration. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const committees = [
    'United Nations Security Council (UNSC)',
    'United Nations General Assembly (UNGA)',
    'United Nations Human Rights Council (UNHRC)',
    'Economic and Social Council (ECOSOC)',
    'World Health Organization (WHO)',
    'African Union (AU)'
  ];

  const educationalLevels = [
    'BASIC SCHOOL',
    'SECONDARY',
    'TERTIARY'
  ];
  
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="bg-teal-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                id="middleName"
                type="text"
                {...register('middleName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                Surname *
              </label>
              <input
                id="surname"
                type="text"
                {...register('surname')}
                className={`w-full px-3 py-2 border rounded-md ${errors.surname ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.surname && (
                <p className="mt-1 text-sm text-red-600">{errors.surname.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <DatePicker
                    id="dateOfBirth"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={75}
                    showMonthDropdown
                    minDate={new Date('1950-01-01')}
                    maxDate={new Date()}
                    placeholderText="Select date of birth"
                    className={`w-full px-3 py-2 border rounded-md ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                id="gender"
                {...register('gender')}
                className={`w-full px-3 py-2 border rounded-md ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone/WhatsApp *
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 024 123 4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="postalAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Address
            </label>
            <input
              id="postalAddress"
              type="text"
              {...register('postalAddress')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="bg-teal-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Academic/Professional Information</h3>
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
              Name of Institution *
            </label>
            <input
              id="institution"
              type="text"
              {...register('institution')}
              className={`w-full px-3 py-2 border rounded-md ${errors.institution ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.institution && (
              <p className="mt-1 text-sm text-red-600">{errors.institution.message}</p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Educational Level *
            </label>
            <select
              id="educationalLevel"
              {...register('educationalLevel')}
              className={`w-full px-3 py-2 border rounded-md ${errors.educationalLevel ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select educational level</option>
              {educationalLevels.map((level, index) => (
                <option key={index} value={level}>{level}</option>
              ))}
            </select>
            {errors.educationalLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.educationalLevel.message}</p>
            )}
          </div>
          
          {watch('educationalLevel') === 'TERTIARY' && (
            <div className="mt-4">
              <label htmlFor="programOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                Programme of Study *
              </label>
              <input
                id="programOfStudy"
                type="text"
                {...register('programOfStudy')}
                className={`w-full px-3 py-2 border rounded-md ${errors.programOfStudy ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.programOfStudy && (
                <p className="mt-1 text-sm text-red-600">{errors.programOfStudy.message}</p>
              )}
            </div>
          )}

        </div>

        <div className="bg-teal-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Location Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                Nationality *
              </label>
              <select
                id="nationality"
                {...register('nationality')}
                className={`w-full px-3 py-2 border rounded-md ${errors.nationality ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select nationality</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
              {errors.nationality && (
                <p className="mt-1 text-sm text-red-600">{errors.nationality.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                id="city"
                type="text"
                {...register('city')}
                className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-teal-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Conference Preferences</h3>


          <div className="mt-4">
            <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-1">
              Do you have any previous MUN experience? *
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="previousExperienceYes"
                  type="radio"
                  value="Yes"
                  {...register('previousExperience')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="previousExperienceYes" className="ml-2 block text-sm text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="previousExperienceNo"
                  type="radio"
                  value="No"
                  {...register('previousExperience')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="previousExperienceNo" className="ml-2 block text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>
            {errors.previousExperience && (
              <p className="mt-1 text-sm text-red-600">{errors.previousExperience.message}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Do you have any Physical / Dietary Needs? *
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="specialNeedsYes"
                  type="radio"
                  name="specialNeeds"
                  value="Yes"
                  onChange={() => setValue('specialNeeds', 'Yes')}
                  checked={watch('specialNeeds') === 'Yes'}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="specialNeedsYes" className="ml-2 block text-sm text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="specialNeedsNo"
                  type="radio"
                  name="specialNeeds"
                  value="No"
                  onChange={() => {
                    setValue('specialNeeds', 'No');
                    setValue('specialNeedsDetails', '');
                  }}
                  checked={watch('specialNeeds') === 'No'}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="specialNeedsNo" className="ml-2 block text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>
            {errors.specialNeeds && (
              <p className="mt-1 text-sm text-red-600">{errors.specialNeeds.message}</p>
            )}
          </div>

          {watch('specialNeeds') === 'Yes' && (
            <div className="mt-4">
              <label htmlFor="specialNeedsDetails" className="block text-sm font-medium text-gray-700 mb-1">
                Please specify your physical/dietary needs *
              </label>
              <textarea
                id="specialNeedsDetails"
                {...register('specialNeedsDetails')}
                className={`w-full px-3 py-2 border rounded-md ${errors.specialNeedsDetails ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
              ></textarea>
              {errors.specialNeedsDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.specialNeedsDetails.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-teal-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Person's Name *
              </label>
              <input
                id="emergencyContact"
                type="text"
                {...register('emergencyContact')}
                className={`w-full px-3 py-2 border rounded-md ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.emergencyContact && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Person's Phone Number *
              </label>
              <input
                id="emergencyPhone"
                type="tel"
                {...register('emergencyPhone')}
                className={`w-full px-3 py-2 border rounded-md ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.emergencyPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship with Emergency Contact Person *
            </label>
            <input
              id="emergencyRelationship"
              type="text"
              {...register('emergencyRelationship')}
              className={`w-full px-3 py-2 border rounded-md ${errors.emergencyRelationship ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.emergencyRelationship && (
              <p className="mt-1 text-sm text-red-600">{errors.emergencyRelationship.message}</p>
            )}
          </div>
        </div>

        <div className="bg-teal-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Additional Information</h3>
          <div>
            <label htmlFor="howHeard" className="block text-sm font-medium text-gray-700 mb-1">
              How did you hear about us? *
            </label>
            <select
              id="howHeard"
              {...register('howHeard')}
              className={`w-full px-3 py-2 border rounded-md ${errors.howHeard ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Please select</option>
              <option value="X">X (Twitter)</option>
              <option value="Instagram">Instagram</option>
              <option value="Posters and Flyers">Posters and Flyers</option>
              <option value="Through Friend">Through Friend</option>
              <option value="Faculty Advisor">Faculty Advisor</option>
              <option value="Promotional Website">Promotional Website</option>
              <option value="Other">Other (Specify)</option>
            </select>
            {errors.howHeard && (
              <p className="mt-1 text-sm text-red-600">{errors.howHeard.message}</p>
            )}
          </div>
          
          {watchHowHeard === 'Other' && (
            <div className="mt-4">
              <label htmlFor="howHeardOther" className="block text-sm font-medium text-gray-700 mb-1">
                Please specify how you heard about us *
              </label>
              <textarea
                id="howHeardOther"
                {...register('howHeardOther')}
                className={`w-full px-3 py-2 border rounded-md ${errors.howHeardOther ? 'border-red-500' : 'border-gray-300'}`}
                rows="2"
                placeholder="Please tell us how you heard about MUNC-GH 2025"
              ></textarea>
              {errors.howHeardOther && (
                <p className="mt-1 text-sm text-red-600">{errors.howHeardOther.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeTerms"
                type="checkbox"
                {...register('agreeTerms')}
                className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                Declaration: By submitting this form, I agree to the <a href="#" className="text-teal-500 hover:underline">terms and conditions</a> of MUNCGLOBAL *
              </label>
              {errors.agreeTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeTerms.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-teal-500 text-white font-medium rounded-md hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Continue to Payment'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
