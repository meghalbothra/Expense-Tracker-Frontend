import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify
import '../styles/Reminders.css'; // Import your custom CSS

const Reminders = () => {
    const [reminderList, setReminderList] = useState([]);
    const [newReminder, setNewReminder] = useState({ title: '', date: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch reminders when component mounts
    useEffect(() => {
        fetchReminders();
    }, []);

    // Function to fetch reminders
    const fetchReminders = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token'); // Retrieve token from cookie
            const response = await axios.get('http://localhost:8000/api/v1/reminders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReminderList(response.data);
        } catch (error) {
            console.error('Error fetching reminder data:', error);
            setError('Failed to fetch reminders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes for new reminders
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReminder({ ...newReminder, [name]: value });
    };

    // Add a new reminder
    const handleAddReminder = async () => {
        if (newReminder.title !== '' && newReminder.date !== '') {
            try {
                const token = Cookies.get('token'); // Retrieve token from cookie
                const response = await axios.post('http://localhost:8000/api/v1/reminders', newReminder, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const newReminderData = response.data;
                setReminderList([...reminderList, newReminderData]); // Update state with new reminder data
                setNewReminder({ title: '', date: '' });

                // Show success toast notification
                toast.success('Reminder added successfully!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
            } catch (error) {
                console.error('Error adding reminder:', error);
                // Show error toast notification
                toast.error('Error adding reminder. Please try again.', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
            }
        }
    };

    // Delete a reminder
    const handleDeleteReminder = async (id) => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookie
            await axios.delete(`http://localhost:8000/api/v1/reminders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReminderList(reminderList.filter((reminder) => reminder.id !== id));
            // Show success toast notification for deletion
            toast.success('Reminder deleted successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide
            });
        } catch (error) {
            console.error('Error deleting reminder:', error);
            // Show error toast notification
            toast.error('Error deleting reminder. Please try again.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide
            });
        }
    };

    // Toggle completion status of a reminder
    const handleToggleCompletion = async (id) => {
        try {
            const token = Cookies.get('token');
            const reminder = reminderList.find((reminder) => reminder.id === id);
            const updatedReminder = { ...reminder, completed: !reminder.completed };

            const response = await axios.put(`http://localhost:8000/api/v1/reminders/${id}/toggle`, updatedReminder, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Assuming backend responds with updated reminder data
            const updatedReminderData = response.data;

            setReminderList(reminderList.map((reminder) => 
                (reminder.id === id ? { ...reminder, completed: updatedReminderData.completed } : reminder)
            ));

            toast.success(`Reminder marked as ${updatedReminderData.completed ? 'completed' : 'incomplete'}!`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide
            });
        } catch (error) {
            console.error('Error updating reminder status:', error);
            toast.error('Error updating reminder status. Please try again.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide
            });
        }
    };

    return (
        <div className="reminder-container">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
            <h2 className="reminder-heading">Reminders</h2>
            <div className="reminder-list">
                {reminderList.map((reminder) => (
                    <div className="reminder-item" key={reminder.id}>
                        <div className="reminder-content">
                            <div className="reminder-title-date">
                                <h3 className={`reminder-title ${reminder.completed ? 'completed' : ''}`}>
                                    {reminder.title}
                                </h3>
                                <p className="reminder-date">{new Date(reminder.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button
                            className="complete-button"
                            onClick={() => handleToggleCompletion(reminder.id)}
                        >
                            {reminder.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteReminder(reminder.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <div className="add-reminder-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={newReminder.title}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="date"
                    placeholder="Enter date"
                    value={newReminder.date}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={handleAddReminder}>Add Reminder</button>
            </div>
        </div>
    );
};

export default Reminders;
