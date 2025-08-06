import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { changeUserPassword } from '../../services/userService';
import { logoutUser } from '../../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../../assets/css/change-password.css';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { currentPassword, newPassword, confirmPassword } = form;

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await changeUserPassword({
                oldPassword: currentPassword,
                newPassword,
                confirmPassword,
            });

            if (error) {
                toast.error(error); // This can be "Incorrect old password" from backend
            } else {
                toast.success("Password changed successfully. Please login again.");
                setTimeout(() => {
                    dispatch(logoutUser());
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||   
                "Failed to change password. Please try again.";
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 profile-section change-password-container">
            <div className="col-md-6 p-4">
                <h3 className="mb-3 text-primary">Change Password</h3>
                <form onSubmit={handleSubmit}>
                    {['currentPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
                        <div className="mb-3" key={index}>
                            <label className="form-label text-dark fw-medium">
                                {field === 'currentPassword'
                                    ? 'Current Password'
                                    : field === 'newPassword'
                                        ? 'New Password'
                                        : 'Confirm New Password'}
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword[field.replace('Password', '')] ? 'text' : 'password'}
                                    className="form-control"
                                    name={field}
                                    value={form[field]}
                                    onChange={handleChange}
                                    required
                                />
                                <span
                                    className="input-group-text password-toggle"
                                    onClick={() => toggleVisibility(field.replace('Password', ''))}
                                >
                                    {showPassword[field.replace('Password', '')] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="col-md-6">
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
