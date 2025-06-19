import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Grid,
    Box,
    Stack,
    Typography,
    FormControl,
    Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '@/contexts/auth-context/auth-context.context';
import { CustomAlert } from '@/components/ui/CustomAlert';
import { CustomShrinkTextField } from '@/components/ui/CustomShrinkTextField';
import { LogoIcon } from '@/components/shared/LogoIcon';
import BgImage from '@/assets/images/login-bg.png';
import { PageContainer } from '@/components/shared/PageContainer';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const currentYear = moment().year();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validate: (values) => {
            const errors: any = {};
            if (values.email === "") {
                errors.email = "Email is required.";
            }
            if (values.password === "") {
                errors.password = "Password is required.";
            }
            return errors;
        },
        onSubmit: async (values) => {
            setLoading(true);
            await login(
                values.email,
                values.password,
                () => {
                    setLoading(false);
                    navigate("/dashboard");
                },
                (errorMessage) => {
                    setLoading(false);
                    setError(errorMessage);
                }
            );
        },
    });

    const emailError = !!formik.errors.email;
    const passwordError = !!formik.errors.password;

    return (
        <PageContainer title="Login" description="This is the login page">
            <Grid
                container
                sx={{
                    position: "relative",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Grid
                    item
                    xs={1}
                    md={4}
                    sx={{
                        backgroundColor: theme.palette.grey[100],
                        display: { xs: "none", md: "block" },
                    }}
                >
                    <Box sx={{ height: "100vh", overflow: "hidden" }}>
                        <Stack padding={3}>
                            <LogoIcon width="250px" alignment="start" />
                            <Typography
                                variant="h1"
                                mt={10}
                                textAlign={"center"}
                                fontSize={"2.5rem"}
                                fontWeight={800}
                            >
                                Hi, Welcome back
                            </Typography>
                            <Typography
                                variant="h3"
                                mt={3}
                                textAlign={"center"}
                                color={theme.palette.grey[600]}
                            >
                                More effectively with optimized workflows.
                            </Typography>
                            <Box mt={8}>
                                <img src={BgImage} style={{ width: "100%" }} alt="login" />
                            </Box>
                            <Typography
                                variant="body1"
                                textAlign={"center"}
                                marginTop={2}
                                sx={{ color: "rgb(140, 140, 140)" }}
                            >
                                @ {currentYear} All Rights Reserved.
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={10} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3.5} />
                        <Grid item xs={12} md={5}>
                            <Typography variant="h1" fontWeight={800}>
                                Sign in to your account
                            </Typography>
                            {error && (
                                <CustomAlert
                                    sx={{ mt: 2 }}
                                    severity="error"
                                    onClose={() => setError(null)}
                                >
                                    {error}
                                </CustomAlert>
                            )}
                            <Stack>
                                <form autoComplete="off" onSubmit={formik.handleSubmit}>
                                    <FormControl sx={{ mt: 2 }} fullWidth error={emailError}>
                                        <CustomShrinkTextField
                                            id="email"
                                            label={"Email"}
                                            name="email"
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                            value={formik.values.email}
                                            fullWidth
                                            type="text"
                                            error={emailError}
                                            helperText={formik.errors.email}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ mt: 4 }} fullWidth error={passwordError}>
                                        <CustomShrinkTextField
                                            label={"Password"}
                                            id="password"
                                            name="password"
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            value={formik.values.password}
                                            type="password"
                                            error={passwordError}
                                            helperText={formik.errors.password}
                                            onChange={formik.handleChange}
                                        />
                                    </FormControl>
                                    <Box sx={{ mt: 2 }} display="flex" justifyContent={"end"}>
                                        <Typography
                                            component={Link}
                                            to="/auth/reset-password"
                                            fontWeight="500"
                                            sx={{
                                                textDecoration: "none",
                                                color: "primary.main",
                                            }}
                                        >
                                            Forgot Password?
                                        </Typography>
                                    </Box>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={loading}
                                        type="submit"
                                        sx={{
                                            mt: 2,
                                            fontSize: "1.2rem",
                                            pt: "15px",
                                            pb: "15px",
                                            borderRadius: "10px",
                                            fontWeight: 900,
                                            background: "#000",
                                        }}
                                    >
                                        Login
                                    </Button>
                                </form>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={3.5}></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PageContainer>
    );
}; 