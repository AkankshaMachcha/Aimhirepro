// src/pages/dashboard/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/profileSlice";
import {
  uploadProfileImage,
  updateUserProfile,
} from "../../services/userService";
import { toast } from "react-toastify";
import "../../assets/css/profile.css";
import defaultImg from "../../assets/img/default-profile.jpg";
import { FaEdit } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Country, State, City } from "country-state-city";
import { setUser } from "../../redux/auth/authSlice";



const ProfilePage = () => {
  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector((state) => state.profile);
  const authUser = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    dispatch(fetchUserProfile());
    setCountries(Country.getAllCountries());
  }, [dispatch]);

 

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
      if (profile.profileImage) {
        setImagePreview(`${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}/${profile.profileImage}`);
      }
    }
  }, [profile]);


  useEffect(() => {
    if (formData?.country) {
      const country = Country.getAllCountries().find(
        (c) => c.isoCode === formData.country || c.name === formData.country
      );
      if (country) {
        setStates(State.getStatesOfCountry(country.isoCode));
      }
    }
  }, [formData?.country]);

  useEffect(() => {
    if (formData?.country && formData?.state) {
      const country = Country.getAllCountries().find(
        (c) => c.isoCode === formData.country || c.name === formData.country
      );
      const state = State.getStatesOfCountry(country?.isoCode || "").find(
        (s) => s.isoCode === formData.state || s.name === formData.state
      );
      if (country && state) {
        setCities(City.getCitiesOfState(country.isoCode, state.isoCode));
      }
    }
  }, [formData?.state, formData?.country]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { data, error } = await uploadProfileImage(file);

    if (data) {
      toast.success("Profile photo updated!");
      const updatedImagePath = `${process.env.REACT_APP_IMAGE_BASE_URL}${data.profileImagePath}`;
      setImagePreview(updatedImagePath);

      // Update Redux auth.user
      dispatch(setUser({
        ...authUser,
        profileImage: data.profileImagePath
      }));

      // Update localStorage safely
      const existingUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...existingUser,
        profileImage: data.profileImagePath
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      toast.error(error);
    }
    setUploading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await updateUserProfile(formData);
    if (data) {
      toast.success("Profile updated successfully");
      dispatch(setUser({
        ...authUser,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        profileImage: data.profileImage
      }));

      // Update localStorage safely
      const existingUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...existingUser,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        profileImage: data.profileImage
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
    } else {
      toast.error(error);
    }
    setSaving(false);
  };

  if (loading) return <div className="profile-container">Loading profile...</div>;
  if (error || !formData) return <div className="profile-container">Unable to fetch profile.</div>;

  return (
    <div className="container profile-container">
      <div className="profile-section mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <img src={imagePreview || defaultImg} alt="Profile" className="profile-image small" />
          <label className="btn btn-outline-primary upload-button mb-2">
            {uploading ? "Uploading..." : "Upload New Photo"}
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
              hidden
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-section-header d-flex justify-content-between align-items-center">
          <h4 className="m-0">Your Profile</h4>
          {!editing && (
            <span className="text-primary clickable" onClick={() => setEditing(true)}>
              <FaEdit className="me-1" /> Update Profile
            </span>
          )}
        </div>

        {/* Name Fields */}
        <div className="row mb-3">
          {["firstName", "middleName", "lastName"].map((field, i) => (
            <div className="col-md-4" key={i}>
              <label className="form-label profile-label">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                className="form-control profile-input"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                readOnly={!editing}
              />
            </div>
          ))}
        </div>

        {/* Email & Phone */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label profile-label">Email</label>
            <input className="form-control profile-input" value={formData.email || ""} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label profile-label">Phone Number</label>
            <PhoneInput
              country={formData.country?.toLowerCase() || "in"}
              value={formData.phoneNumber || ""}
              onChange={(val) =>
                editing && setFormData((prev) => ({ ...prev, phoneNumber: val }))
              }
              inputProps={{
                name: "phoneNumber",
                required: true,
                className: "form-control profile-input",
                disabled: !editing,
              }}
              containerClass="w-100"
            />

          </div>
        </div>

        {/* Gender, DOB, Nationality */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label profile-label">Gender</label>
            <select
              className="form-control profile-input"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label profile-label d-block">Date of Birth</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                onChange={(date) =>
                  editing && setFormData((prev) => ({ ...prev, dateOfBirth: date }))
                }
                disabled={!editing}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </div>

          <div className="col-md-4">
            <label className="form-label profile-label">Nationality</label>
            <input
              className="form-control profile-input"
              name="nationality"
              value={formData.nationality || ""}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
        </div>

        {/* Address */}
        <div className="row mb-3">
          <div className="col-12">
            <label className="form-label profile-label">Address</label>
            <input
              className="form-control profile-input"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
        </div>

        {/* Country - State - City */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label profile-label">Country</label>
            <select
              className="form-control profile-input"
              name="country"
              value={formData.country || ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, country: e.target.value, state: "", city: "" }));
              }}
              disabled={!editing}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.isoCode} value={c.isoCode}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label profile-label">State</label>
            <select
              className="form-control profile-input"
              name="state"
              value={formData.state || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, state: e.target.value, city: "" }))
              }
              disabled={!editing}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label profile-label">City</label>
            <select
              className="form-control profile-input"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {editing && (
          <div className="d-flex justify-content-end">
            <button className="btn btn-success" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
