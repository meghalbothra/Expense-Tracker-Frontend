import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { format } from 'date-fns'; // Importing date-fns
import '../styles/Profile.css';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [joinedDate, setJoinedDate] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');
    const [error, setError] = useState(null); // State to store error

    useEffect(() => {
        fetchUserProfile(); // Fetch initial user profile data
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            const response = await axios.get('http://localhost:8000/api/v1/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { name, email, joinedDate } = response.data;
            setName(name);
            setEmail(email);
            // Format the date
            setJoinedDate(format(new Date(joinedDate), 'MMMM do, yyyy'));
        } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to fetch user profile', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide,
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage(reader.result);
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleEditProfile = () => {
        setEditMode(true);
    };

    const handleSaveProfile = async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            await axios.put('http://localhost:8000/api/v1/auth/profile', {
                name,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEditMode(false);
            toast.success('Profile updated successfully', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide,
            });
        }
    };

    const handleAddImage = () => {
        document.getElementById('add-image-button').click();
    };

    const handlePasswordUpdate = async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookies
            await axios.put('http://localhost:8000/api/v1/auth/profile/update-password', {
                currentPassword,
                newPassword,
                confirmNewPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Password updated successfully', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide,
            });
            setPasswordUpdateMessage('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Slide,
            });
        }
    };

    const handleGoToDashboard = () => {
        window.location.href = '/dashboard'; // Navigate to the dashboard page
    };

    return (
        <div className="profile-container">
            <ToastContainer />
            <div className="profile-card">
                <button className="cross-button" onClick={handleGoToDashboard}>X</button> {/* Cross button for navigation */}
                <h2 className="profile-heading">MY PROFILE</h2>
                {image && (
                    <div className="profile-image">
                        <img src={image} alt="Profile" />
                    </div>
                )}
                <div className="profile-details">
                    <div className="profile-detail">
                        {editMode ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        ) : (
                            <h4>
                                <span>NAME:</span> {name}
                            </h4>
                        )}
                    </div>
                    <div className="profile-detail">
                        <h4>
                            <span>EMAIL:</span> {email}
                        </h4>
                    </div>
                    <div className="profile-detail">
                        <h4>
                            <span>JOINED ON:</span> {joinedDate}
                        </h4>
                    </div>
                    <div className="profile-button-container">
                        {!editMode ? (
                            <button
                                className="edit-profile-button"
                                onClick={handleEditProfile}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                
                            </>
                        )}
                    </div>
                    {editMode && (
                        <div className="password-update">
                            <h3>Change Password</h3>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <button className="profile-button" onClick={handlePasswordUpdate}>
                                Update Password
                            </button>
                            {passwordUpdateMessage && <p>{passwordUpdateMessage}</p>}
                        </div>
                    )}
                    <div className="profile-button-container">
                        {editMode && (
                            <button className="profile-button" onClick={handleAddImage}>
                                Add Image
                            </button>
                        )}
                        {editMode && (
                            <button className="profile-button" onClick={handleSaveProfile}>
                                Save
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <input
                id="add-image-button"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Profile;
