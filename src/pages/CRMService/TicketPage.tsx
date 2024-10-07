import React, {useEffect, useState} from "react";
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

import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {
    fetchFindAllTicket,
    fetchUpdateTicket,
    fetchDeleteTicket,
    fetchFindTicketById
} from "../../store/feature/crmSlice.tsx";
import {useTranslation} from "react-i18next";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";

const TicketPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const tickets = useAppSelector((state) => state.crmSlice.ticketList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const goToSavePage = () => {
        navigate("/ticket/save");
    }

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation();

    //modal
    const [openAddTicketModal, setOpenAddTicketModel] = useState(false);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [ticketStatus, setTicketStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [createdDate, setCreatedDate] = useState<Dayjs | null>(dayjs());
    const [closedDate, setClosedDate] = useState<Dayjs | null>(dayjs());

    useEffect(() => {
        dispatch(fetchFindAllTicket({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isActivating, isUpdating, isDeleting]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);

    };

    const handleOpenUpdateModal = async () => {
        setOpenAddTicketModel(true);
        setIsUpdating(true);

        dispatch(fetchFindTicketById(selectedRowIds[0])).then((data) => {
            setSubject(data.payload.data.subject);
            setDescription(data.payload.data.description);
            setTicketStatus(data.payload.data.ticketStatus);
            setPriority(data.payload.data.priority);
            setCreatedDate(dayjs(data.payload.data.createdDate));
            setClosedDate(dayjs(data.payload.data.closedDate));
        })
    }

    const handleUpdateTicket = async () => {
            dispatch(fetchUpdateTicket({
                id: selectedRowIds[0],
                subject: subject,
                description: description,
                ticketStatus: ticketStatus,
                priority: priority,
                createdDate: createdDate?.toDate() || new Date(),
                closedDate: closedDate?.toDate() || new Date()
            })).then(() => {
                setOpenAddTicketModel(false);
                setIsUpdating(false);
                setSubject('');
                setDescription('');
                setTicketStatus('');
                setPriority('');
                setCreatedDate(dayjs());
                setClosedDate(dayjs());
                Swal.fire({
                    title: t("swal.success"),
                    text: t("crmService.updated_ticket"),
                    icon: "success",
                });

            }).catch ((error) => {
            setOpenAddTicketModel(false);
            setIsUpdating(false);
            Swal.fire({
                title: t("swal.error"),
                text: t("crmService.error-occurred"),
                icon: "error",
            });
        })
    };
    const handleDeleteTicket = async () => {
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
                html: `<input type="checkbox" id="confirm-checkbox" />
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
                    const selectedTicket = tickets.find(
                        (selectedTicket) => selectedTicket.id === id
                    );
                    if (!selectedTicket) continue;

                    const data = await dispatch(fetchDeleteTicket(selectedTicket.id));

                    if (data.payload.message !== "Ticket deleted successfully") {
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
            localStorage.removeItem("token")
        } finally {
            setIsDeleting(false);
        }
    };


    const columns: GridColDef[] = [

        {field: "subject", headerName: t("crmService.subject"), flex: 1.5, headerAlign: "center"},
        {field: "description", headerName: t("crmService.description"), flex: 1.5, headerAlign: "center"},
        {field: "priority", headerName: t("crmService.priority"), flex: 1.5, headerAlign: "center"},
        {field: "ticketStatus", headerName: t("crmService.ticket_status"), headerAlign: "center", flex: 1},
        {field: "createdDate", headerName: t("crmService.created_date"), headerAlign: "center", flex: 1},
        {field: "closedDate", headerName: t("crmService.closed_date"), headerAlign: "center", flex: 1},
        {field: "status", headerName: t("crmService.status"), headerAlign: "center", flex: 1},

    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{height: "auto"}}>

                <TextField
                    label={t("crmService.search-by-subject")}
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
                    rows={tickets}
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
                            onClick={goToSavePage}
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
                            {t("crmService.make-ticket")}
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
                            onClick={handleDeleteTicket}
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
                    <Dialog open={openAddTicketModal} onClose={() => setOpenAddTicketModel(false)} fullWidth
                            maxWidth='lg'>
                        <DialogTitle>{isUpdating ? t('crmService.update') : t('crmService.add_ticket')}</DialogTitle>
                        <DialogContent>
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.subject')}
                                name="subject"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.description')}
                                name="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.priority')}
                                name="priority"
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                required
                                fullWidth
                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.ticket_status')}
                                name="ticketStatus"
                                value={ticketStatus}
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
                                <Button onClick={() => handleUpdateTicket()} color="success" variant="contained"
                                        disabled={subject === '' || description === '' || ticketStatus === '' || priority === '' || createdDate === null || closedDate === null }>{t('crmService.update')}</Button>}


                        </DialogActions>
                    </Dialog>
                </Grid>


            </div>
        </LocalizationProvider>


    );
}
export default TicketPage;