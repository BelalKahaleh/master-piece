import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get student ID from URL params

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/students/${id}`);
        setStudent(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.response?.data?.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Loading student data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      
      {student ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="bg-gray-200 w-full aspect-square rounded-lg flex items-center justify-center">
                  <span className="text-4xl text-gray-500">
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                {student.firstName} {student.lastName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p>{student.email}</p>
                </div>
                
                {student.studentId && (
                  <div>
                    <p className="text-gray-500 text-sm">Student ID</p>
                    <p>{student.studentId}</p>
                  </div>
                )}
                
                {student.phone && (
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p>{student.phone}</p>
                  </div>
                )}
                
                {student.dateOfBirth && (
                  <div>
                    <p className="text-gray-500 text-sm">Date of Birth</p>
                    <p>{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}
                
                {student.program && (
                  <div>
                    <p className="text-gray-500 text-sm">Program</p>
                    <p>{student.program}</p>
                  </div>
                )}
                
                {student.enrollmentDate && (
                  <div>
                    <p className="text-gray-500 text-sm">Enrollment Date</p>
                    <p>{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {student.address && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p>
                {student.address.street && `${student.address.street}, `}
                {student.address.city && `${student.address.city}, `}
                {student.address.state && `${student.address.state}, `}
                {student.address.zip && `${student.address.zip}, `}
                {student.address.country && student.address.country}
              </p>
            </div>
          )}
          
          {student.courses && student.courses.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.courses.map((course, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{course.name}</p>
                    {course.code && <p className="text-sm text-gray-500">Course Code: {course.code}</p>}
                    {course.instructor && <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No student data found</p>
      )}
    </div>
  );
}