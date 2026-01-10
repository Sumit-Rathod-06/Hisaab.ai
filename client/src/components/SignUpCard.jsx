import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Snackbar } from '@mui/material';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUpCard(props) {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [p, setPassword] = React.useState('');
    const [role, setRole] = React.useState('customer');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState(false);
    const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();
    const navigate = useNavigate();

    const { handleRegister } = useContext(AuthContext);

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!firstName.value || firstName.value.length < 1) {
            setFirstNameError(true);
            setFirstNameErrorMessage('First name is required.');
            isValid = false;
        } else {
            setFirstNameError(false);
            setFirstNameErrorMessage('');
        }

        if (!lastName.value || lastName.value.length < 1) {
            setLastNameError(true);
            setLastNameErrorMessage('Last name is required.');
            isValid = false;
        } else {
            setLastNameError(false);
            setLastNameErrorMessage('');
        }

        return isValid;
    };

    const finalReg = async () => {
        try {
            const result = await handleRegister({
                first_name: firstName,
                last_name: lastName,
                email,
                password: p,
                role: role
            }, navigate);
            console.log(result);
            setMessage(result);
            setOpen(true);
            setFirstName("");
            setLastName("");
            setEmail("");
            setError("");
            setPassword("")
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "An error occurred");
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Card variant="outlined">
                <SitemarkIcon />
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    Sign up
                </Typography>
                <Box
                    component="form"
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (validateInputs()) finalReg();
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="firstName">First name</FormLabel>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            placeholder="John"
                            error={firstNameError}
                            helperText={firstNameErrorMessage}
                            color={firstNameError ? 'error' : 'primary'}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="lastName">Last name</FormLabel>
                        <TextField
                            autoComplete="family-name"
                            name="lastName"
                            required
                            fullWidth
                            id="lastName"
                            placeholder="Snow"
                            error={lastNameError}
                            helperText={lastNameErrorMessage}
                            color={lastNameError ? 'error' : 'primary'}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            placeholder="your@email.com"
                            name="email"
                            autoComplete="email"
                            variant="outlined"
                            type="email"
                            error={emailError}
                            helperText={emailErrorMessage}
                            color={emailError ? 'error' : 'primary'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="role">Role</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="role"
                            name="role"
                            select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="customer">Customer</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                        </TextField>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            color={passwordError ? 'error' : 'primary'}
                            value={p}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox value="allowExtraUsernames" color="primary" />}
                        label="I want to receive updates via username."
                    />
                    <p style={{ color: "red" }}>{error}</p>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Sign up
                    </Button>
                </Box>
                <Divider>
                    <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                </Divider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => alert('Sign up with Google')}
                        startIcon={<GoogleIcon />}
                    >
                        Sign up with Google
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                            to={"/login"}
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Card>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} message={message} />
        </>
    );
}
