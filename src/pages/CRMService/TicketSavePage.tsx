import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    TextField, Typography

} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";

import {
    fetchFindAllCustomerForOpportunity, fetchSaveTicket
} from "../../store/feature/crmSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";

const TicketSavePage = () => {
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
    const [openAddTicketModal, setOpenAddTicketModel] = useState(false);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [ticketStatus, setTicketStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [createdDate, setCreatedDate] = useState<Dayjs | null>(dayjs());
    const [closedDate, setClosedDate] = useState<Dayjs | null>(dayjs());
    const navigate = useNavigate();




    const goToTicketPage = () => {
        navigate("/tickets");
    }


    useEffect(() => {
        dispatch(fetchFindAllCustomerForOpportunity({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenTicketModal = () => {
        setOpenAddTicketModel(true);
    }

    const handleSaveTicket = () => {
        if (selectedRowIds.length === 0) return;
        setIsSaving(true);

        for (const id of selectedRowIds) {
            const selectedCustomer = customers.find(
                (selectedCustomer) => selectedCustomer.id === id
            );
            if (!selectedCustomer) continue;
            setSelectedRowIds([]);

            dispatch(fetchSaveTicket({
                subject: subject,
                description: description,
                ticketStatus: ticketStatus,
                priority: priority,
                createdDate: createdDate?.toDate() || new Date(),
                closedDate: closedDate?.toDate() || new Date(),
                customerId: selectedCustomer.id
            })).then((data) => {
                if (data.payload.message === "Ticket saved successfully") {
                    setSubject('');
                    setDescription('');
                    setTicketStatus('');
                    setPriority('');
                    setCreatedDate(dayjs());
                    setClosedDate(dayjs());
                    setOpenAddTicketModel(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("crmService.added_ticket"),
                        icon: "success",
                    }).then(
                        goToTicketPage
                    )
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
                setOpenAddTicketModel(false);
                Swal.fire({
                    title: t("swal.error"),
                    text: t("crmService.error-occurred"),
                    icon: "error",
                });
                setIsSaving(false);
            });

        }


    }

    const columns: GridColDef[] = [
        {field: "firstName", headerName: t("crmService.firstName"), flex: 1.5, headerAlign: "center"},
        {field: "lastName", headerName: t("crmService.lastName"), flex: 1.5, headerAlign: "center"},
        {field: "email", headerName: t("crmService.email"), flex: 1.5, headerAlign: "center"},
        {field: "phone", headerName: t("crmService.phone"), flex: 1.5, headerAlign: "center"},
        {field: "address", headerName: t("crmService.address"), flex: 1.5, headerAlign: "center"},

    ]


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{height: "auto"}}>

                <Typography variant="h6" align="center" style={{marginBottom: '1%'}}>
                    {("Biletleme işlemi yapmak istediğiniz kullanıcıları seçin")}
                </Typography>

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
                            onClick={handleOpenTicketModal}
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
                    <Dialog open={openAddTicketModal} onClose={() => setOpenAddTicketModel(false)}
                            fullWidth
                            maxWidth='lg'>
                        <DialogTitle>{isUpdating ? t('crmService.update') : t('crmService.make-ticket')}</DialogTitle>
                        <DialogContent>
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.subject')}
                                name="subject"
                                onChange={e => setSubject(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.description')}
                                name="description"
                                onChange={e => setDescription(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.priority')}
                                name="priority"
                                onChange={e => setPriority(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.ticket_status')}
                                name="ticketStatus"
                                onChange={e => setTicketStatus(e.target.value)}
                                required
                                fullWidth
                            />
                            <DatePicker
                                label={t('crmService.created_date')}
                                value={createdDate}
                                onChange={(newDate) => setCreatedDate(newDate)}
                                sx={{marginTop: '15px'}}

                            />
                            <DatePicker
                                label={t('crmService.closed_date')}
                                value={closedDate}
                                onChange={(newDate) => setClosedDate(newDate)}
                                sx={{marginTop: '15px'}}

                            />


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setSubject('');
                                setDescription('');
                                setTicketStatus('');
                                setPriority('');
                                setCreatedDate(dayjs());
                                setClosedDate(dayjs());
                                setOpenAddTicketModel(false);


                            }} color="error" variant="contained">{t('crmService.cancel')}</Button>
                            {
                                <Button onClick={() => handleSaveTicket()} color="success" variant="contained"
                                        disabled={subject === '' || description === '' || ticketStatus === '' || priority === '' || createdDate === null || closedDate === null }>{t('crmService.save')}</Button>}


                        </DialogActions>
                    </Dialog>

                </Grid>
            </div>
        </LocalizationProvider>
    );
}
export default TicketSavePage;
