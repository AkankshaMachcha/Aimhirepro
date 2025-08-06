import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    TextField,
    Select,
    MenuItem,
    Chip,
    Button,
    InputLabel,
    FormControl,
    Pagination
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { DatePicker } from '@mui/x-date-pickers';
import '../../assets/css/AdminUserListPage.css';
import AdminUserCard from './AdminUserCard';
import { Container, Row, Col } from 'react-bootstrap';
import { getAdminUsers } from '../../services/adminService';

const defaultFilters = {
    search: '',
    role: '',
    enabled: '',
    createdAfter: '',
    createdBefore: '',
    city: '',
    state: '',
    country: '',
    sortBy: 'createdAt',
    direction: 'desc',
};

const AdminUserListPage = () => {
    const [filters, setFilters] = useState({ ...defaultFilters });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(9); // Set to 9 users per page
    const [totalPages, setTotalPages] = useState(0);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                ...filters,
                page: pageNumber,
                size: pageSize
            };

            // Format date fields
            if (filters.createdAfter instanceof Date && !isNaN(filters.createdAfter)) {
                params.createdAfter = filters.createdAfter.toISOString();
            }
            if (filters.createdBefore instanceof Date && !isNaN(filters.createdBefore)) {
                params.createdBefore = filters.createdBefore.toISOString();
            }

            if (filters.enabled === 'true') params.enabled = true;
            else if (filters.enabled === 'false') params.enabled = false;

            const res = await getAdminUsers(params);
            // console.log('Fetched Page:', pageNumber, 'Users:', res.content);
            setUsers(res.content || []);
            setTotalPages(res.totalPages || 0);
        } catch (err) {
            // console.error('Fetch error:', err?.response?.data || err.message);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [pageNumber, filters]);

    // useEffect(() => {
    //     setPageNumber(0);
    // }, [JSON.stringify(filters)]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPageNumber(0);
    };

    const handleRemoveFilter = (key) => {
        setFilters((prev) => ({ ...prev, [key]: defaultFilters[key] }));
    };

    const handleReset = () => {
        setFilters({ ...defaultFilters });
    };

    const renderChips = () => {
        return Object.entries(filters)
            .filter(([_, val]) => val !== '' && val !== null)
            .map(([key, value]) => (
                <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    onDelete={() => handleRemoveFilter(key)}
                    className="admin-chip"
                    color="primary"
                    variant="outlined"
                    size="small"
                />
            ));
    };

    const renderRoleValue = (selected) => {
        const labelMap = {
            FREE: 'Free',
            PREMIUM: 'Premium',
            '': 'All Roles',
        };
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {labelMap[selected]}
            </Box>
        );
    };

    const renderEnabledValue = (selected) => {
        const iconMap = {
            true: <CheckCircleIcon sx={{ mr: 1 }} />,
            false: <CancelIcon sx={{ mr: 1 }} />,
            '': null,
        };
        const labelMap = {
            true: 'Enabled',
            false: 'Disabled',
            '': 'All',
        };
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {iconMap[selected]}
                {labelMap[selected]}
            </Box>
        );
    };

    return (


        <Box className="admin-wrapper">
            <Box className="admin-user-header">
                <h2 className="admin-user-heading">Search & Manage Users</h2>
                <p className="admin-user-subtext">
                    Use the filters below to search users by role, location, status, or registration date. View user details and monitor account activity.
                </p>
            </Box>

            <Box className="admin-filter-card">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} className="admin-grid-search">
                        <TextField
                            fullWidth
                            label="Search"
                            placeholder="Name or Email"
                            name="search"
                            size="small"
                            value={filters.search}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-role">
                        <FormControl fullWidth size="small">
                            <Select
                                name="role"
                                value={filters.role}
                                onChange={handleChange}
                                displayEmpty
                                renderValue={renderRoleValue}
                            >
                                <MenuItem value="">All Roles</MenuItem>
                                <MenuItem value="FREE">Free</MenuItem>
                                <MenuItem value="PREMIUM">Premium</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-enabled">
                        <FormControl fullWidth size="small">
                            <Select
                                name="enabled"
                                value={filters.enabled}
                                onChange={handleChange}
                                displayEmpty
                                renderValue={renderEnabledValue}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="true">Enabled</MenuItem>
                                <MenuItem value="false">Disabled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-created-before">
                        <FormControl fullWidth size="small">
                            <DatePicker
                                label="Created Before"
                                value={filters.createdBefore || null}
                                onChange={(newValue) =>
                                    setFilters((prev) => ({ ...prev, createdBefore: newValue }))
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        variant: 'outlined',
                                        InputProps: {
                                            sx: {
                                                backgroundColor: '#f5f8ff',
                                                fontSize: '9px',
                                                height: '50px',
                                                width :'100px',
                                                pl: 2
                                            }
                                        },
                                        InputLabelProps: {
                                            sx: {
                                                fontSize: '9px'
                                            }
                                        }
                                    }
                                }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-created-after">
                        <FormControl fullWidth size="small">
                            <DatePicker
                                label="Created After"
                                value={filters.createdAfter || null}
                                onChange={(newValue) =>
                                    setFilters((prev) => ({ ...prev, createdAfter: newValue }))
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        variant: 'outlined',
                                        InputProps: {
                                            sx: {
                                                backgroundColor: '#f5f8ff',
                                                fontSize: '9px',
                                                height: '50px',
                                                width :'100px',
                                                pl: 2
                                            }
                                        },
                                        InputLabelProps: {
                                            sx: {
                                                fontSize: '9px'
                                            }
                                        }
                                    }
                                }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-city">
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            size="small"
                            value={filters.city}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-state">
                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            size="small"
                            value={filters.state}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-country">
                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            size="small"
                            value={filters.country}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-sort-by">
                        <FormControl fullWidth size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                name="sortBy"
                                value={filters.sortBy}
                                label="Sort By"
                                onChange={handleChange}
                            >
                                <MenuItem value="createdAt">Created Date</MenuItem>
                                <MenuItem value="firstName">First Name</MenuItem>
                                <MenuItem value="lastName">Last Name</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={2} className="admin-grid-direction">
                        <FormControl fullWidth size="small">
                            <InputLabel>Direction</InputLabel>
                            <Select
                                name="direction"
                                value={filters.direction}
                                label="Direction"
                                onChange={handleChange}
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={2} className="admin-grid-reset">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleReset}
                            startIcon={<RefreshIcon />}
                            className="admin-reset-btn"
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
                {Object.values(filters).some((v) => v) && (
                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                        {renderChips()}
                    </Box>
                )}
            </Box>

            <div className="admin-user-list-wrapper py-3 px-2">
                {loading && <p>Loading users...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Container fluid>
                    <Row className="g-5">
                        {users
                            .filter((user) => !user.authority.includes('ADMIN'))
                            .map((user, index) => (
                                <Col key={index} xs={12} sm={6} md={4} lg={4}>
                                    <AdminUserCard user={user} />
                                </Col>
                            ))}
                    </Row>
                </Container>


                {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={totalPages}
                            page={pageNumber + 1}
                            onChange={(e, value) => setPageNumber(value - 1)}
                            color="primary"
                            shape="rounded"
                            size="large" // <- This increases the button size
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontSize: '1.4rem',        // Bigger text
                                    width: '50px',             // Wider buttons
                                    height: '40px',            // Taller buttons
                                    margin: '0 6px',           // Spacing between buttons
                                }
                            }}
                        />
                    </Box>

                )}
            </div>
        </Box>
    );
};

export default AdminUserListPage;
