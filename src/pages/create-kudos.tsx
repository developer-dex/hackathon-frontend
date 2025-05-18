import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  SelectChangeEvent,
  Autocomplete,
  CircularProgress,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import CategoryIcon from "@mui/icons-material/Category";
import SendIcon from "@mui/icons-material/Send";
import BadgeIcon from "@mui/icons-material/Badge";
import { IUser, EUserRole } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";
import { useUsers, useCategories } from "@/application/hooks";
import { kudosUseCases } from "@/application/useCases/kudos/index";
import { ICreateKudosRequest } from "@/application/useCases/kudos/createKudosUseCase";

interface ICreateKudosPageProps {
  user: IUser | null;
}

const CreateKudosPage: NextPage<ICreateKudosPageProps> = ({ user }) => {
  const router = useRouter();
  const { users, loading: loadingUsers, error: usersError } = useUsers();
  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useCategories();

  const [formData, setFormData] = useState({
    recipientId: "",
    recipientName: "",
    recipientEmail: "",
    category: "",
    message: "",
  });

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [formErrors, setFormErrors] = useState({
    recipientId: "",
    category: "",
    message: "",
  });

  // Add state for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      recipientId: "",
      category: "",
      message: "",
    };

    // Recipient validation
    if (!formData.recipientId) {
      newErrors.recipientId = "Please select a recipient";
      isValid = false;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRecipientChange = (
    event: React.SyntheticEvent,
    value: IUser | null
  ) => {
    setSelectedUser(value);
    if (value) {
      setFormData((prevState) => ({
        ...prevState,
        recipientId: value.id,
        recipientName: value.name,
        recipientEmail: value.email,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        recipientId: "",
        recipientName: "",
        recipientEmail: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the request payload
      const kudosData: ICreateKudosRequest = {
        receiverId: formData.recipientId,
        categoryId: formData.category,
        message: formData.message,
      };

      // Call the create kudos use case
      const result = await kudosUseCases.createKudos.execute(kudosData);

      if (result.success) {
        // Immediately redirect to home page with success parameter
        router.push({
          pathname: "/",
          query: { kudosCreated: "success" },
        });
      } else {
        setSubmitError(result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting kudos:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Redirect if user is not authenticated or not a tech lead
  useEffect(() => {
    if (!user || !authUseCase.roleGuard.hasRole(EUserRole.TEAM_LEAD)) {
      router.replace("/");
    }
  }, [user, router]);

  // For SSR - don't render the page content if not authenticated or not a tech lead
  if (!user || !authUseCase.roleGuard.hasRole(EUserRole.TEAM_LEAD)) {
    return null;
  }

  // Show errors if API calls fail
  const apiError = usersError || categoriesError;
  if (apiError) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">
          Error loading data: {apiError.message}. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Create Kudos | KUDOS App</title>
        <meta
          name="description"
          content="Create kudos to recognize your team members"
        />
      </Head>

      <Container
        maxWidth="md"
        sx={{
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 600,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              Create New Kudos
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Recognize your team members for their outstanding work
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Autocomplete
              id="recipient-select"
              options={users}
              getOptionLabel={(option) => `${option.name} (${option.role})`}
              value={selectedUser}
              onChange={handleRecipientChange}
              loading={loadingUsers}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1">
                        {option.name}{" "}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({option.role})
                        </Typography>
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Recipient"
                  placeholder="Select a team member to recognize..."
                  margin="normal"
                  fullWidth
                  error={!!formErrors.recipientId}
                  helperText={formErrors.recipientId}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {loadingUsers ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                    sx: {
                      "& input::placeholder": {
                        opacity: 0.7,
                        fontStyle: "italic",
                      },
                    },
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              )}
            />

            {selectedUser && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  borderRadius: "8px",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Selected Recipient:</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PersonIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2">{selectedUser.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EmailIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2">{selectedUser.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BadgeIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2">{selectedUser.role}</Typography>
                </Box>
              </Box>
            )}

            <FormControl
              fullWidth
              margin="normal"
              error={!!formErrors.category}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
                "& .MuiSelect-select": {
                  fontStyle: "normal",
                  "& em": {
                    fontStyle: "italic",
                    opacity: 0.7,
                  },
                },
              }}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                displayEmpty
                onChange={handleSelectChange}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                }
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select a recognition category...</em>;
                  }

                  const selectedCategory = categories.find(
                    (cat) => cat.id === selected
                  );
                  if (!selectedCategory)
                    return <em>Select a recognition category...</em>;

                  return selectedCategory.name;
                }}
              >
                <MenuItem value="">
                  <em>Select a recognition category...</em>
                </MenuItem>
                {loadingCategories ? (
                  <MenuItem disabled value="loading">
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Loading
                    categories...
                  </MenuItem>
                ) : categories.length === 0 ? (
                  <MenuItem disabled value="no-categories">
                    No categories available
                  </MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                      {category.description && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          - {category.description}
                        </Typography>
                      )}
                    </MenuItem>
                  ))
                )}
              </Select>
              {formErrors.category && (
                <Typography variant="caption" color="error">
                  {formErrors.category}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              id="message"
              name="message"
              label="Message"
              multiline
              rows={5}
              variant="outlined"
              value={formData.message}
              onChange={handleInputChange}
              error={!!formErrors.message}
              helperText={formErrors.message}
              placeholder="Write a message of appreciation..."
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ alignSelf: "flex-start", mt: 1.5, ml: 0.5, mr: 0.5 }}
                  >
                    <MessageIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  padding: "16px 14px",
                },
                "& .MuiInputBase-inputMultiline": {
                  pl: 4,
                },
                "& textarea::placeholder": {
                  opacity: 0.7,
                  fontStyle: "italic",
                },
              }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={() => router.push("/")}
                sx={{
                  borderRadius: "20px",
                  px: 3,
                  py: 1,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={isSubmitting}
                sx={{
                  borderRadius: "20px",
                  px: 4,
                  py: 1,
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Kudos"}
              </Button>
            </Box>

            {/* Show submit error if any */}
            {submitError && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error">{submitError}</Alert>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CreateKudosPage;
