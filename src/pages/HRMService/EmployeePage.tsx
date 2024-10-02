import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    TextField

} from "@mui/material";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../store/index.tsx";

import {
    fetchFindAllEmployee,
    fetchSaveEmployee,
    fetchDeleteEmployee,
    fetchUpdateEmployee,
    fetchFindByIdEmployee
} from "../../store/feature/hrmSlice.tsx";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import dayjs, {Dayjs} from "dayjs";


const EmployeePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const employees = useAppSelector((state) => state.hrmSlice.employeeList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { t } = useTranslation()

    //modal
    const [openAddEmployeeModal, setOpenAddEmployeeModel] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [hireDate, setHireDate] = useState<Dayjs | null>(dayjs());
    const [salary, setSalary] = useState(0);


    useEffect(() => {
        dispatch(fetchFindAllEmployee({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenEmployeeModal = () => {
        setOpenAddEmployeeModel(true);
    }

    const handleSaveEmployee = () => {
        setIsSaving(true);
        dispatch(fetchSaveEmployee({
            firstName: firstName,
            lastName: lastName,
            position: position,
            department: department,
            email: email,
            phone: phone,
            hireDate: hireDate?.toDate() || new Date(),
            salary: salary
        })).then((data) => {
            if (data.payload.message === "Success") {
                setFirstName('');
                setLastName('');
                setPosition('');
                setDepartment('');
                setEmail('');
                setPhone('');
                setHireDate(dayjs());
                setSalary(0);
                setOpenAddEmployeeModel(false);
                Swal.fire({
                    title: t("swal.success"),
                    text: t("hrmService.added"),
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: t("swal.error"),
                    text: t("hrmService.non-added"),
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
            }
            setIsSaving(false);
        }).catch((error) => {
            setOpenAddEmployeeModel(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.error-occurred"),
                icon: "error",
            });
            setIsSaving(false);
        });
    }
    const handleOpenUpdateModal = async () => {
        setOpenAddEmployeeModel(true);
        setIsUpdating(true);

        dispatch(fetchFindByIdEmployee(selectedRowIds[0])).then((data) => {
            setFirstName(data.payload.data.firstName);
            setLastName(data.payload.data.lastName);
            setPosition(data.payload.data.position);
            setDepartment(data.payload.data.department);
            setEmail(data.payload.data.email);
            setPhone(data.payload.data.phone);
            setHireDate(dayjs(data.payload.data.hireDate)); 
            setSalary(data.payload.data.salary);
        });
    }
    
    const handleUpdateEmployee = () => {
        dispatch(fetchUpdateEmployee({
            id: selectedRowIds[0],
            firstName: firstName,
            lastName: lastName,
            position: position,
            department: department,
            email: email,
            phone: phone,
            hireDate: hireDate?.toDate() || new Date(),
            salary: salary
        })).then(() => {
            setOpenAddEmployeeModel(false);
            setIsUpdating(false);
            setFirstName('')
            setLastName('')
            setPosition('')
            setDepartment('')
            setEmail('')
            setPhone('')
            setHireDate(dayjs())
            setSalary(0)
            Swal.fire({
                title: t("swal.success"),
                text: t("hrmService.successfullyupdated"),
                icon: "success",
            });
        }).catch((error) => {
            setOpenAddEmployeeModel(false);
            setIsUpdating(false);
            setOpenAddEmployeeModel(false);
            setIsUpdating(false);
            setFirstName('')
            setLastName('')
            setPosition('')
            setDepartment('')
            setEmail('')
            setPhone('')
            setHireDate(dayjs())
            setSalary(0)
            Swal.fire({
                title: t("swal.error"),
                text: t("hrmService.error-occurred"),
                icon: "error",
            });
        });
    };

    const handleDeleteEmployee = async () => {
        if (selectedRowIds.length === 0) return;

        setIsDeleting(true);
        try {

            const result = await Swal.fire({
                title: t("swal.areyousure"),
                text: t("hrmService.deleting"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("hrmService.delete"),
                cancelButtonText: t("hrmService.cancel"),
                html: `<input type="checkbox" id="confirm-checkbox" />
                   <label for="confirm-checkbox">${t("hrmService.confirmDelete")}</label>`,
                preConfirm: () => {
                    const popup = Swal.getPopup();
                    if (popup) {
                        const checkbox = popup.querySelector('#confirm-checkbox') as HTMLInputElement;
                        if (checkbox && !checkbox.checked) {
                            Swal.showValidationMessage(t("hrmService.checkboxRequired"));
                            return false;
                        }
                        return true;
                    }
                }
            });

            if (result.isConfirmed) {
                let hasError = false;
                for (const id of selectedRowIds) {
                    const selectedEmployee = employees.find(
                        (selectedEmployee) => selectedEmployee.id === id
                    );
                    if (!selectedEmployee) continue;

                    const data = await dispatch(fetchDeleteEmployee(selectedEmployee.id));

                    if (data.payload.message !== "Success") {
                        await Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                        hasError = true;
                        break;
                    }
                }

                if (!hasError) {
                    await Swal.fire({
                        title: t("hrmService.deleted"),
                        text: t("hrmService.successfullydeleted"),
                        icon: "success",
                    });

                    setSelectedRowIds([]);
                }
            }
        } catch (error) {
            localStorage.removeItem("token");
        } finally {
            setIsDeleting(false);
        }
    };


    const columns: GridColDef[] = [
        { field: "firstName", headerName: t("hrmService.firstName"), flex: 1.5, headerAlign: "center" },
        { field: "lastName", headerName: t("hrmService.lastName"), flex: 1.5, headerAlign: "center" },
        { field: "position", headerName: t("hrmService.position"), flex: 1.5, headerAlign: "center" },
        { field: "department", headerName: t("hrmService.department"), flex: 1.5, headerAlign: "center" },
        { field: "email", headerName: t("hrmService.email"), flex: 1.5, headerAlign: "center" },
        { field: "phone", headerName: t("hrmService.phone"), flex: 1.5, headerAlign: "center" },
        { field: "hireDate", headerName: t("hrmService.hireDate"), flex: 1.5, headerAlign: "center" },
        { field: "salary", headerName: t("hrmService.salary"), flex: 1.5, headerAlign: "center" },
        { field: "status", headerName: t("hrmService.status"), headerAlign: "center", flex: 1 },
    ]


    return (
        <div style={{ height: "auto" }}>

            <TextField
                label={t("hrmService.searchbyname")}
                variant="outlined"
                onChange={(event) => {
                    setSearchText(event.target.value);
                }}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
            <h1>Employee</h1>

            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={employees}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    }
                }}
                // getRowClassName={(params)=>
                //     params.row.isExpenditureApproved
                //         ? "approved-row"
                //         : "unapproved-row"
                // }
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={handleRowSelection}
                autoHeight={true}
                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgba(224, 224, 224, 1)",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        textAlign: "center",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                        textAlign: "center",
                    },
                    // "& .approved-row": {
                    //     backgroundColor: "rgba(77, 148, 255,1)",

                    // },
                    // "& .unapproved-row": {
                    //     backgroundColor: "rgba(242, 242, 242,1)",
                    // },

                }}
                rowSelectionModel={selectedRowIds}
            />
            <Grid container spacing={2} sx={{
                flexGrow: 1,
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                marginTop: '2%',
                marginBottom: '2%'
            }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenEmployeeModal}
                        variant="contained"
                        color="success"
                        //startIcon={<ApproveIcon />}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("hrmService.add")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenUpdateModal}
                        variant="contained"
                        color="primary"

                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("hrmService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDeleteEmployee}
                        variant="contained"
                        color="error"
                        disabled={isDeleting || selectedRowIds.length === 0}
                        //startIcon={<CancelIcon/>}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("hrmService.delete")}
                    </Button>
                </Grid>
                <Dialog open={openAddEmployeeModal} onClose={() => setOpenAddEmployeeModel(false)} fullWidth
                    maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('hrmService.update') : t('hrmService.add_employee')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.firstName')}
                            name="name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.lastName')}
                            name="Lastname"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.position')}
                            name="Position"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.department')}
                            name="Department"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.email')}
                            name="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.phone')}
                            name="Phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.hireDate')}
                            name="HireDate"
                            type="date"
                            value={hireDate ? hireDate.toISOString().substring(0, 10) : ''}
                            onChange={e => setHireDate(dayjs(e.target.value))}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            sx={{ marginTop: '15px' }}
                            label={t('hrmService.salary')}
                            name="Salary"
                            value={salary !== undefined ? salary : ''} // salary tanımlıysa değerini, değilse boş bırak
                            onChange={e => {
                                const value = e.target.value;
                                setSalary(value ? parseInt(value) : 0); // Boşsa 0, değilse sayıyı al
                            }}
                            required
                            fullWidth
                        />








                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddEmployeeModel(false);
                            setIsUpdating(false);
                            setFirstName('');
                            setLastName('');
                            setPosition('');
                            setDepartment('');
                            setEmail('');
                            setPhone('');
                            setHireDate(dayjs());
                            setSalary(0);
                        }} color="error" variant="contained">{t('hrmService.cancel')}</Button>
                        {isUpdating ? 
                        <Button onClick={() => handleUpdateEmployee()} color="primary" variant="contained"
                            disabled={firstName === '' || lastName === '' || position === '' || department === '' || email === '' || phone === '' || hireDate === null || salary === 0}>{t('hrmService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveEmployee()} color="success" variant="contained"
                                disabled={firstName === '' || lastName === '' || position === '' || department === '' || email === '' || phone === '' || hireDate === null || salary === 0}>{t('hrmService.save')}</Button>}


                    </DialogActions>
                </Dialog>

            </Grid>
        </div>
    );
}
export default EmployeePage;
