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
    fetchFindAllOpportunity, fetchSaveSalesActivity
} from "../../store/feature/crmSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";

const CustomerPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const opportunities = useAppSelector((state) => state.crmSlice.opportunityList);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //modal
    const [openAddSalesActivityModal, setOpenAddSalesActivityModel] = useState(false);
    const [type, setType] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const navigate = useNavigate();

    const goToSalesActivityPage = () => {
        navigate("/sales-activity");
    }


    useEffect(() => {
        dispatch(fetchFindAllOpportunity({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isSaving, isUpdating, isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleOpenSalesActivityModal = () => {
        setOpenAddSalesActivityModel(true);
    }

    const handleSaveSalesActivity = () => {
        if (selectedRowIds.length === 0) return;
        setIsSaving(true);

        for (const id of selectedRowIds) {
            const selectedOpportunity = opportunities.find(
                (selectedOpportunity) => selectedOpportunity.id === id
            );
            if (!selectedOpportunity) continue;
            setSelectedRowIds([]);

            dispatch(fetchSaveSalesActivity({
                type: type,
                notes: notes,
                date: date?.toDate() || new Date(),
                opportunityId: selectedOpportunity.id
            })).then((data) => {
                if (data.payload.message === "Success") {
                    setType('');
                    setDate(dayjs());
                    setNotes('');
                    setOpenAddSalesActivityModel(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("crmService.added_opportunity"),
                        icon: "success",
                    }).then(
                        goToSalesActivityPage
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
                setOpenAddSalesActivityModel(false);
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
        {field: "name", headerName: t("crmService.name"), flex: 1.5, headerAlign: "center"},
        {field: "description", headerName: t("crmService.description"), flex: 1.5, headerAlign: "center"},
        {field: "value", headerName: t("crmService.value"), flex: 1.5, headerAlign: "center"},
        {field: "stage", headerName: t("crmService.stage"), flex: 1.5, headerAlign: "center"},
        {field: "probability", headerName: t("crmService.probability"), flex: 1.5, headerAlign: "center"},

    ]


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{height: "auto"}}>

                <Typography variant="h6" align="center" style={{marginBottom: '1%'}}>
                    {("Satış Aktivitesi oluşturmak istediğiniz fırsatları seçin")}
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
                    rows={opportunities}
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
                            onClick={handleOpenSalesActivityModal}
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
                    <Dialog open={openAddSalesActivityModal} onClose={() => setOpenAddSalesActivityModel(false)}
                            fullWidth
                            maxWidth='lg'>
                        <DialogTitle>{isUpdating ? t('crmService.update') : t('crmService.add_sales_activity')}</DialogTitle>
                        <DialogContent>
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.type')}
                                name="type"
                                onChange={e => setType(e.target.value)}
                                required
                                fullWidth
                            />
                            <DatePicker
                                label={t('crmService.date')}
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                sx={{marginTop: '15px'}}

                            />
                            <TextField
                                sx={{marginTop: '15px'}}
                                label={t('crmService.notes')}
                                name="notes"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                required
                                fullWidth
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                setOpenAddSalesActivityModel(false);
                                setIsUpdating(false);
                                setType('');
                                setDate(dayjs());
                                setNotes('');


                            }} color="error" variant="contained">{t('crmService.cancel')}</Button>
                            {
                                <Button onClick={() => handleSaveSalesActivity()} color="success" variant="contained"
                                        disabled={type === '' || date === null || notes === ''}>{t('crmService.save')}</Button>}


                        </DialogActions>
                    </Dialog>

                </Grid>
            </div>
        </LocalizationProvider>
    );
}
export default CustomerPage;
