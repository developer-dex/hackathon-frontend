import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  TablePagination,
  Stack,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import MainLayout from "@/components/templates/MainLayout";
import { IUser } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";
import { useRouter } from "next/router";
import { EUserRole } from "@/domain/models/auth";
import { useUsers } from "@/application/hooks/useUsers";
import { useTeams } from "@/application/hooks/useTeams";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import { toast } from "react-toastify";
import { adminUseCase } from "@/application/useCases/admin/index";

interface IAdminPageProps {
  user: IUser | null;
  onLogout: () => void;
}

const AdminPage: React.FC<IAdminPageProps> = ({ user, onLogout }) => {
  const router = useRouter();
  const {
    users,
    loading,
    error,
    pagination,
    changePage,
    changeItemsPerPage,
    getCurrentPage,
    hasNextPage,
    hasPreviousPage,
  } = useUsers();

  // Get teams data for team selection
  const { teams, loading: loadingTeams } = useTeams();

  // State for approval confirmation dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [approving, setApproving] = useState(false);

  // State for role change confirmation dialog
  const [openRoleChangeDialog, setOpenRoleChangeDialog] = useState(false);
  const [roleChangeUserId, setRoleChangeUserId] = useState<string | null>(null);
  const [roleChangeUserName, setRoleChangeUserName] = useState<string>("");
  const [roleChangeCurrentRole, setRoleChangeCurrentRole] = useState<
    EUserRole | string
  >("");
  const [roleChangeNewRole, setRoleChangeNewRole] = useState<
    EUserRole | string
  >("");
  const [changingRole, setChangingRole] = useState(false);

  // State for team change confirmation dialog
  const [openTeamChangeDialog, setOpenTeamChangeDialog] = useState(false);
  const [teamChangeUserId, setTeamChangeUserId] = useState<string | null>(null);
  const [teamChangeUserName, setTeamChangeUserName] = useState<string>("");
  const [teamChangeCurrentTeam, setTeamChangeCurrentTeam] =
    useState<string>("");
  const [teamChangeCurrentTeamId, setTeamChangeCurrentTeamId] =
    useState<string>("");
  const [teamChangeNewTeamId, setTeamChangeNewTeamId] = useState<string>("");
  const [changingTeam, setChangingTeam] = useState(false);

  // Check if user is an admin, if not redirect
  useEffect(() => {
    if (!authUseCase.roleGuard.isAdmin()) {
      router.replace("/");
    }
  }, [router, user]);

  // Handle opening approval confirmation dialog
  const handleApproveClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setOpenConfirmDialog(true);
  };

  // Handle closing approval confirmation dialog
  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedUserId(null);
  };

  // Handle user verification approval
  const handleConfirmApproval = async () => {
    if (!selectedUserId) return;

    try {
      setApproving(true);

      // Use the ApproveUserUseCase from the admin use case
      const updatedUser = await adminUseCase.approveUser.execute(
        selectedUserId
      );

      if (updatedUser) {
        toast.success(
          `User ${selectedUserName} has been approved successfully`
        );
        // Refresh the users list
        changePage(getCurrentPage()); // Reload current page
      } else {
        toast.error(`Failed to approve user: User not updated`);
      }
    } catch (error) {
      console.error("❌ Error approving user:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setApproving(false);
      handleCloseDialog();
    }
  };

  // Handle opening role change dialog
  const handleRoleChangeClick = (
    userId: string,
    userName: string,
    currentRole: EUserRole | string
  ) => {
    setRoleChangeUserId(userId);
    setRoleChangeUserName(userName);
    setRoleChangeCurrentRole(currentRole);

    // Set the new role to the other option (toggle between Team Member and Team Lead)
    const newRole =
      currentRole === EUserRole.TEAM_MEMBER
        ? EUserRole.TEAM_LEAD
        : EUserRole.TEAM_MEMBER;

    setRoleChangeNewRole(newRole);
    setOpenRoleChangeDialog(true);
  };

  // Handle closing role change dialog
  const handleCloseRoleDialog = () => {
    setOpenRoleChangeDialog(false);
    setRoleChangeUserId(null);
  };

  // Handle role change confirmation
  const handleConfirmRoleChange = async () => {
    if (!roleChangeUserId || !roleChangeNewRole) return;

    try {
      setChangingRole(true);

      // Use the ChangeUserRoleUseCase from the admin use case
      const updatedUser = await adminUseCase.changeUserRole.execute(
        roleChangeUserId,
        roleChangeNewRole.toString()
      );

      if (updatedUser) {
        toast.success(
          `User ${roleChangeUserName}'s role has been changed to ${roleChangeNewRole} successfully`
        );
        // Refresh the users list
        changePage(getCurrentPage()); // Reload current page
      } else {
        toast.error(`Failed to change user role`);
      }
    } catch (error) {
      console.error("❌ Error changing user role:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setChangingRole(false);
      handleCloseRoleDialog();
    }
  };

  // Handle opening team change dialog
  const handleTeamChangeClick = (
    userId: string,
    userName: string,
    currentTeamId: string,
    currentTeamName: string
  ) => {
    setTeamChangeUserId(userId);
    setTeamChangeUserName(userName);
    setTeamChangeCurrentTeamId(currentTeamId);
    setTeamChangeCurrentTeam(currentTeamName || "No Team");
    setTeamChangeNewTeamId(currentTeamId);
    setOpenTeamChangeDialog(true);
  };

  // Handle closing team change dialog
  const handleCloseTeamDialog = () => {
    setOpenTeamChangeDialog(false);
    setTeamChangeUserId(null);
  };

  // Handle team change confirmation
  const handleConfirmTeamChange = async () => {
    if (!teamChangeUserId || !teamChangeNewTeamId) return;

    try {
      setChangingTeam(true);

      // Use the ChangeUserTeamUseCase from the admin use case
      const updatedUser = await adminUseCase.changeUserTeam.execute(
        teamChangeUserId,
        teamChangeNewTeamId
      );

      if (updatedUser) {
        // Find the new team name
        const newTeamName =
          teams.find((team) => team.id === teamChangeNewTeamId)?.name ||
          "Unknown Team";

        toast.success(
          `User ${teamChangeUserName}'s team has been changed to ${newTeamName} successfully`
        );
        // Refresh the users list
        changePage(getCurrentPage()); // Reload current page
      } else {
        toast.error(`Failed to change user team`);
      }
    } catch (error) {
      console.error("❌ Error changing user team:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setChangingTeam(false);
      handleCloseTeamDialog();
    }
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    changeItemsPerPage(parseInt(event.target.value, 10));
  };

  // Handle page change from TablePagination
  const handlePageChange = (event: unknown, newPage: number) => {
    changePage(newPage);
  };

  // Helper function to render verification status with appropriate styling
  const renderVerificationStatus = (
    status: string,
    userId: string,
    userName: string
  ) => {
    if (status === "Verified") {
      return (
        <Chip
          label="Verified"
          color="success"
          size="small"
          icon={<CheckCircleIcon />}
          sx={{ fontWeight: "medium" }}
        />
      );
    } else if (status === "Pending") {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label="Pending"
            color="error"
            size="small"
            variant="outlined"
            sx={{ fontWeight: "medium" }}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleApproveClick(userId, userName)}
            sx={{
              fontSize: "0.75rem",
              py: 0.5,
              textTransform: "none",
              borderRadius: "16px",
            }}
          >
            Approve
          </Button>
        </Box>
      );
    } else {
      return status;
    }
  };

  // If the user is null or not admin, show a loading state
  if (!user || user.role !== EUserRole.ADMIN) {
    return (
      <MainLayout user={user} onLogout={onLogout}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} onLogout={onLogout}>
      <Box sx={{ maxWidth: 1200, mx: "auto", py: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4 }}
          data-testid="admin-panel-title"
        >
          Admin Panel - Users List
        </Typography>

        {loading || loadingTeams ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mb: 2 }}>
            Error loading users: {error.message}
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead sx={{ backgroundColor: "primary.main" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        width: "70px",
                      }}
                    >
                      No.
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Verification Status
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Team
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Created At
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Change Role
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Change Team
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          textAlign: "center",
                          fontWeight: "medium",
                          width: "70px",
                        }}
                      >
                        {pagination.offset + index + 1}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {renderVerificationStatus(
                          user.verificationStatus || "Pending",
                          user.id,
                          user.name
                        )}
                      </TableCell>
                      <TableCell>
                        {user.team?.name ||
                          (user.teamId ? user.teamId.name : "No Team")}
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {/* Only show edit icon for Team Member and Team Lead roles */}
                        {(user.role === EUserRole.TEAM_MEMBER ||
                          user.role === EUserRole.TEAM_LEAD) && (
                          <Tooltip title="Change role">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleRoleChangeClick(
                                  user.id,
                                  user.name,
                                  user.role
                                )
                              }
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Tooltip title="Change team">
                          <IconButton
                            color="secondary"
                            onClick={() =>
                              handleTeamChangeClick(
                                user.id,
                                user.name,
                                user.team?.id || "",
                                user.team?.name || "No Team"
                              )
                            }
                            size="small"
                          >
                            <GroupsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {pagination.offset + 1} to{" "}
                {Math.min(pagination.offset + users.length, pagination.total)}{" "}
                of {pagination.total} users
              </Typography>

              <Stack spacing={2} direction="row" alignItems="center">
                <TablePagination
                  component="div"
                  count={pagination.total}
                  page={getCurrentPage()}
                  onPageChange={handlePageChange}
                  rowsPerPage={pagination.limit}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Users per page:"
                  sx={{ border: "none" }}
                  nextIconButtonProps={{
                    disabled: !hasNextPage(),
                  }}
                  backIconButtonProps={{
                    disabled: !hasPreviousPage(),
                  }}
                />
              </Stack>
            </Box>
          </>
        )}
      </Box>

      {/* Approval Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm User Approval</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to approve user{" "}
            <strong>{selectedUserName}</strong>? This will change their
            verification status to Verified.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            variant="outlined"
            disabled={approving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmApproval}
            color="primary"
            variant="contained"
            disabled={approving}
            startIcon={
              approving ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
            autoFocus
          >
            {approving ? "Approving..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={openRoleChangeDialog}
        onClose={handleCloseRoleDialog}
        aria-labelledby="role-dialog-title"
        aria-describedby="role-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="role-dialog-title">Change User Role</DialogTitle>
        <DialogContent>
          <DialogContentText id="role-dialog-description" sx={{ mb: 3 }}>
            You are about to change <strong>{roleChangeUserName}</strong>&apos;s
            role from <strong>{roleChangeCurrentRole}</strong>.
          </DialogContentText>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="new-role-label">New Role</InputLabel>
            <Select
              labelId="new-role-label"
              value={roleChangeNewRole}
              label="New Role"
              onChange={(e) =>
                setRoleChangeNewRole(e.target.value as EUserRole)
              }
              disabled={changingRole}
            >
              <MenuItem value={EUserRole.TEAM_MEMBER}>Team Member</MenuItem>
              <MenuItem value={EUserRole.TEAM_LEAD}>Team Lead</MenuItem>
            </Select>
            <FormHelperText>Select the new role for this user</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseRoleDialog}
            color="inherit"
            variant="outlined"
            disabled={changingRole}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRoleChange}
            color="primary"
            variant="contained"
            disabled={
              changingRole || roleChangeCurrentRole === roleChangeNewRole
            }
            startIcon={
              changingRole ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
            autoFocus
          >
            {changingRole ? "Updating..." : "Change Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Change Confirmation Dialog */}
      <Dialog
        open={openTeamChangeDialog}
        onClose={handleCloseTeamDialog}
        aria-labelledby="team-dialog-title"
        aria-describedby="team-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="team-dialog-title">Change User Team</DialogTitle>
        <DialogContent>
          <DialogContentText id="team-dialog-description" sx={{ mb: 3 }}>
            You are about to change <strong>{teamChangeUserName}</strong>&apos;s
            team from <strong>{teamChangeCurrentTeam}</strong>.
          </DialogContentText>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="new-team-label">New Team</InputLabel>
            <Select
              labelId="new-team-label"
              value={teamChangeNewTeamId}
              label="New Team"
              onChange={(e) => setTeamChangeNewTeamId(e.target.value as string)}
              disabled={changingTeam}
            >
              <MenuItem value="">No Team</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the new team for this user</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseTeamDialog}
            color="inherit"
            variant="outlined"
            disabled={changingTeam}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmTeamChange}
            color="primary"
            variant="contained"
            disabled={
              changingTeam || teamChangeCurrentTeamId === teamChangeNewTeamId
            }
            startIcon={
              changingTeam ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
            autoFocus
          >
            {changingTeam ? "Updating..." : "Change Team"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AdminPage;
