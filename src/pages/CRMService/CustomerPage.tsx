import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, Input, Modal,
    TextField

} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";

import {
    fetchFindAllCustomer,
    fetchSaveCustomer,
    fetchDeleteCustomer,
    fetchUpdateCustomer,
    fetchFindCustomerById, fetchUploadExcelCustomer, fetchSendingEmailExternalSourceCustomer
} from "../../store/feature/crmSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {ICrmCustomer} from "../../model/ICrmCustomer.tsx";
import * as XLSX from 'xlsx';
import VisibilityIcon from "@mui/icons-material/Visibility";
import {Folder} from "@mui/icons-material";



const CustomerPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const customers = useAppSelector((state) => state.crmSlice.customerList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //modal
    const [openAddCustomerModal, setOpenAddCustomerModel] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');


    const [customerFile, setCustomerFile] = useState<ICrmCustomer[]>([]);

    const [open, setOpen] = useState(false);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type: 'array'});
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: ICrmCustomer[] = XLSX.utils.sheet_to_json(worksheet);
                setCustomerFile(jsonData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        if (customerFile.length > 0) {

            try {
                const response = await dispatch(fetchUploadExcelCustomer(customerFile)).unwrap();
                console.log("try 2 deyim")

                if (response.message === "Customers uploaded successfully") {
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("crmService.uploaded"),
                        icon: "success",
                    });
                } else {
                    console.error("API Response:", response);
                    Swal.fire({
                        title: t("swal.error"),
                        text: t("crmService.not-uploaded"),
                        icon: "error",
                    });
                }

                setIsSaving(false);
            } catch (error) {
                console.error("API request failed:", error);
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.not-uploaded"),
                    icon: "error",
                });
            }
        }
    };

    const hanleUploadModal = () => {
        setOpen(true);
    }
    const handleUploadCloseModal = () => {
        setOpen(false);
    }







    useEffect(() => {
        dispatch(fetchFindAllCustomer({
            page: 0,
            size: 500,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenCustomerModal = () => {
        setOpenAddCustomerModel(true);
    }

    const handleSaveCustomer = () => {
        setIsSaving(true);
        dispatch(fetchSaveCustomer({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            address: address
        })).then((data) => {
            if (data.payload.message === "Customer saved successfully") {
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setOpenAddCustomerModel(false);
                Swal.fire({
                    title: t("swal.success"),
                    text: t("crmService.added"),
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.non-added"),
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
            }
            setIsSaving(false);
        }).catch((error) => {
            setOpenAddCustomerModel(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
            setIsSaving(false);
        });
    }
    const handleOpenUpdateModal = async () => {
        setOpenAddCustomerModel(true);
        setIsUpdating(true);

        dispatch(fetchFindCustomerById(selectedRowIds[0])).then((data) => {
            setFirstName(data.payload.data.firstName);
            setLastName(data.payload.data.lastName);
            setEmail(data.payload.data.email);
            setPhone(data.payload.data.phone);
            setAddress(data.payload.data.address);
        })
    }
    const handleUpdateCustomer = async () => {
        dispatch(fetchUpdateCustomer({
            id: selectedRowIds[0],
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            address: address
        })).then(() => {
            setFirstName('')
            setLastName('')
            setEmail('')
            setPhone('')
            setAddress('')
            setOpenAddCustomerModel(false);
            setIsUpdating(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("crmService.updated"),
                icon: "success",
            });
            setIsUpdating(false);
        }).catch((error) => {
            setOpenAddCustomerModel(false);
            setIsUpdating(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
        })
    }

    const handleDeleteCustomer = async () => {
        if (selectedRowIds.length === 0) return;

        setIsDeleting(true);
        try {

            const result = await Swal.fire({
                title: t("swal.areyousure"),
                text: t("crmService.deleting"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("crmService.delete"),
                cancelButtonText: t("crmService.cancel"),
                html: `<input type="checkbox" size="large" id="confirm-checkbox" />
                   <label for="confirm-checkbox">${t("crmService.confirmDelete")}</label>`,
                preConfirm: () => {
                    const popup = Swal.getPopup();
                    if (popup) {
                        const checkbox = popup.querySelector('#confirm-checkbox') as HTMLInputElement;
                        if (checkbox && !checkbox.checked) {
                            Swal.showValidationMessage(t("crmService.checkboxRequired"));
                            return false;
                        }
                        return true;
                    }
                }
            });

            if (result.isConfirmed) {
                let hasError = false;
                for (const id of selectedRowIds) {
                    const selectedCustomer = customers.find(
                        (selectedCustomer) => selectedCustomer.id === id
                    );
                    if (!selectedCustomer) continue;

                    const data = await dispatch(fetchDeleteCustomer(selectedCustomer.id));

                    if (data.payload.message !== "Customer deleted successfully") {
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
                        title: t("crmService.deleted"),
                        text: t("crmService.successfullydeleted"),
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
        {field: "firstName", headerName: t("crmService.firstName"), flex: 1.5, headerAlign: "center"},
        {field: "lastName", headerName: t("crmService.lastName"), flex: 1.5, headerAlign: "center"},
        {field: "email", headerName: t("crmService.email"), flex: 1.5, headerAlign: "center"},
        {field: "phone", headerName: t("crmService.phone"), flex: 1.5, headerAlign: "center"},
        {field: "address", headerName: t("crmService.address"), flex: 1.5, headerAlign: "center"},
        {field: "status", headerName: t("crmService.status"), headerAlign: "center", flex: 1},
        {
            field: "details", headerName: t("crmService.details"), flex: 1.5, headerAlign: "center", renderCell: (params) => (
                <IconButton >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ]


    return (
        <div style={{height: "auto"}}>

            <TextField
                label={t("crmService.searchbyname")}
                variant="outlined"
                onChange={(event) => {
                    setSearchText(event.target.value);
                }}
                value={searchText}
                style={{marginBottom: "1%", marginTop: "1%"}}
                fullWidth
                inputProps={{maxLength: 50}}
            />

            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={customers}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    }
                }}
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
                        onClick={handleOpenCustomerModal}
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
                        {t("crmService.add")}
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
                        {t("crmService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDeleteCustomer}
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
                        {t("crmService.delete")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={hanleUploadModal} sx={{ width: 40, height: 40 }}>
                            <Folder sx={{ fontSize: 40 }} />
                        </IconButton>
                        <label style={{ marginLeft: 10 }}>{t('crmService.upload')}</label>
                    </Box>
                </Grid>

                <Dialog open={open} onClose={handleUploadCloseModal}>
                    <DialogTitle>{t('crmService.import')}</DialogTitle>
                    <DialogContent>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload}/>
                        <label>{t('crmService.uploadFile')}</label>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUploadCloseModal}>{t('crmService.close')}</Button>
                        <Button onClick={() => {
                            handleSubmit();
                            handleUploadCloseModal();

                        }}>{t('crmService.import')}</Button>
                    </DialogActions>
                </Dialog>


                <Dialog open={openAddCustomerModal} onClose={() => setOpenAddCustomerModel(false)} fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('crmService.update') : t('crmService.add_customer')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.firstName')}
                            name="name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.lastName')}
                            name="Lastname"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.email')}
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.phone')}
                            name="phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.address')}
                            name="address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddCustomerModel(false);
                            setIsUpdating(false);
                            setFirstName('');
                            setLastName('');
                            setEmail('');
                            setPhone('');
                            setAddress('');
                        }} color="error" variant="contained">{t('crmService.cancel')}</Button>
                        {isUpdating ?
                            <Button onClick={() => handleUpdateCustomer()} color="primary" variant="contained"
                                    disabled={firstName === '' || lastName === '' || email === '' || phone === '' || address === ''}>{t('crmService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveCustomer()} color="success" variant="contained"
                                    disabled={firstName === '' || lastName === '' || email === '' || phone === '' || address === ''}>{t('crmService.save')}</Button>}


                    </DialogActions>

                </Dialog>

            </Grid>
        </div>
    );
}
export default CustomerPage;
