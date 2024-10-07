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

import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";

import {
    fetchFindAllCustomerForOpportunity, fetchSaveOpportunity, fetchFindOpportunityById, fetchDeleteOpportunity, fetchUpdateOpportunity
} from "../../store/feature/crmSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";


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
    const [openAddOpportunityModal, setOpenAddOpportunityModel] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState(0);
    const [stage, setStage] = useState('');
    const [probability, setProbability] = useState(0);
    const navigate = useNavigate();

    const goToOpportunityPage = () => {
        navigate("/opportunity");
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

    const handleOpenOpportunityModal = () => {
        setOpenAddOpportunityModel(true);
    }

    const handleSaveOpportunity = () => {
        if (selectedRowIds.length === 0) return;
        setIsSaving(true);

        for (const id of selectedRowIds) {
            const selectedCustomer = customers.find(
                (selectedCustomer) => selectedCustomer.id === id
            );
            if (!selectedCustomer) continue;
            setSelectedRowIds([]);

            dispatch(fetchSaveOpportunity({
                name: name,
                description: description,
                value: value,
                stage: stage,
                probability: probability,
                customerId: selectedCustomer.id
            })).then((data) => {
                if (data.payload.message === "Opportunity saved successfully") {
                    setName('');
                    setDescription('');
                    setValue(0);
                    setStage('');
                    setProbability(0);
                    setOpenAddOpportunityModel(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("crmService.added_opportunity"),
                        icon: "success",
                    }).then(
                        goToOpportunityPage
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
                setOpenAddOpportunityModel(false);
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
        <div style={{height: "auto"}}>

            <Typography variant="h6" align="center" style={{ marginBottom: '1%' }}>
                {("Fırsat oluşturmak istediğiniz müşterileri seçin")}
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
                        onClick={handleOpenOpportunityModal}
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
                <Dialog open={openAddOpportunityModal} onClose={() => setOpenAddOpportunityModel(false)} fullWidth
                        maxWidth='lg'>
                    <DialogTitle>{isUpdating ? t('crmService.update') : t('crmService.add_opportunity')}</DialogTitle>
                    <DialogContent>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.name')}
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
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
                            label={t('crmService.value')}
                            name="value"
                            value={value}
                            onChange={e => setValue(parseInt(e.target.value))}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.stage')}
                            name="stage"
                            value={stage}
                            onChange={e => setStage(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('crmService.probability')}
                            name="probability"
                            value={probability}
                            onChange={e => setProbability(parseInt(e.target.value))}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddOpportunityModel(false);
                            setIsUpdating(false);
                            setName('');
                            setDescription('');
                            setValue(0);
                            setStage('');
                            setProbability(0);
                        }} color="error" variant="contained">{t('crmService.cancel')}</Button>
                        {
                            <Button onClick={() => handleSaveOpportunity()} color="success" variant="contained"
                                    disabled={name === '' || description === '' || value === 0 || stage === '' || probability === 0}>{t('crmService.save')}</Button>}


                    </DialogActions>
                </Dialog>

            </Grid>
        </div>
    );
}
export default CustomerPage;
