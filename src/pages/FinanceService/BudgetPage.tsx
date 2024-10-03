import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from '@mui/x-data-grid';
import {useDispatch} from 'react-redux';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    Select,
    TextField
} from '@mui/material';
import {AppDispatch, useAppSelector} from "../../store";
import {
    fetchDeleteBudget,
    fetchFindAllBudget,
    fetchFindByIdBudget,
    fetchSaveBudget, fetchUpdateBudget
} from "../../store/feature/financeSlice.tsx";
import {IBudget} from "../../model/IBudget.tsx";
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import {fetchFindAllProduct, fetchSaveProduct} from "../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";

const BudgetPage: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [budgetList, setBudgetList] = useState<IBudget[]>([]);
    const budgets = useAppSelector((state) => state.financeSlice.budgetList);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const {t} = useTranslation()
    const [openSaveBudgetModal, setOpenSaveBudgetModal] = useState(false);
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState(0);
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };


    const columns: GridColDef[] = [
        {field: 'department', headerName: 'Department', width: 150},
        {field: 'year', headerName: 'Year', width: 120},
        {field: 'amount', headerName: 'Amount', width: 150, type: 'number'},
        {field: 'description', headerName: 'Description', width: 200},
    ];

    useEffect(() => {
        dispatch(
            fetchFindAllBudget({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            setBudgetList(data.payload.data);
        })
    }, [dispatch, searchText]);

    const fetchBudgetData = () => {
        dispatch(fetchFindAllBudget({
            searchText: searchText,
            page: 0,
            size: 100
        })).then((data) => {
            setBudgetList(data.payload.data);
        });
    };

    const handleOpenSaveBudgetModal = () => {
        setOpenSaveBudgetModal(true);
    }

    const handleOpenUpdateBudgetModal = async () => {
        const selectedId = selectedRowIds[0];
        setOpenSaveBudgetModal(true);
        setIsUpdating(true);
        dispatch(fetchFindByIdBudget(selectedId)).then(data => {
            setDepartment(data.payload.data.department);
            setYear(data.payload.data.year);
            setAmount(data.payload.data.amount);
            setDescription(data.payload.data.description);

        });
    }

    const handleSaveBudget = () => {
        setLoading(true);
        dispatch(fetchSaveBudget({department, year, amount, description})).then(() => {
            setDepartment('');
            setYear(0);
            setAmount(0);
            setDescription('');
            setLoading(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("financeService.budgetsuccesfullyadded"),
                icon: "success",
            });
            fetchBudgetData();
        });
        setOpenSaveBudgetModal(false)
    }

    const handleUpdateBudget = () => {
        dispatch(fetchUpdateBudget(
            {
                id: selectedRowIds[0],
                department,
                year,
                amount,
                description
            })
        ).then(() => {
            setDepartment('');
            setYear(0);
            setAmount(0);
            setDescription('');
            setIsUpdating(false);
            setOpenSaveBudgetModal(false);
            Swal.fire({
                title: t("financeService.updated"),
                text: t("financeService.budgetsuccesfullyupdated"),
                icon: "success",
            });
            fetchBudgetData();
        });
    }

    const handleDeleteBudget = async () => {
        for (let id of selectedRowIds) {
            const selectedBudget = budgets.find(
                (selectedBudget) => selectedBudget.id === id
            );
            if (!selectedBudget) continue;

            setIsDeleting(true);

            try {
                const result = await Swal.fire({
                    title: t("swal.areyousure"),
                    text: t("financeService.deleteproduct"),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("financeService.yesdeleteit"),
                    cancelButtonText: t("financeService.cancel"),
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteBudget(selectedBudget.id));

                    if (data.payload.message !== "Success") {
                        await Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: t("financeService.deleted"),
                            text: t("financeService.budgetdeleted"),
                            icon: "success",
                        });
                        await dispatch(fetchFindAllProduct({
                            page: 0,
                            size: 100,
                            searchText: searchText,
                        }));
                        fetchBudgetData();
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
        setIsDeleting(false);
    }

    return (
        <div style={{height: "auto"}}>
            <TextField
                label={t("financeService.searchbydepartment")}
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "1%", marginTop: "1%"}}
                fullWidth
                inputProps={{maxLength: 50}}
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,

                }}
                rows={budgetList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
                    },
                }}
                //getRowClassName={(params) =>
                //    params.row.minimumStockLevel < params.row.stockCount
                //        ? "approved-row"
                //        : "unapproved-row"}
                //
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
                        onClick={handleOpenSaveBudgetModal}
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
                        {t("financeService.add")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenUpdateBudgetModal}
                        variant="contained"
                        color="info"
                        disabled={loading || selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        //startIcon={<DeclineIcon />}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("financeService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDeleteBudget}
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
                        {t("financeService.delete")}
                    </Button>
                </Grid>
                <Dialog open={openSaveBudgetModal} onClose={() => setOpenSaveBudgetModal(false)} fullWidth
                        maxWidth='sm'>
                    <DialogContent>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('financeService.department')}
                            name="department"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('financeService.year')}
                            name="year"
                            value={year}
                            onChange={e => setYear((Number)(e.target.value))}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('financeService.amount')}
                            name="amount"
                            value={amount}
                            onChange={e => setAmount((Number)(e.target.value))}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('financeService.description')}
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenSaveBudgetModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('financeService.cancel')}</Button>
                        {
                            isUpdating ?
                                <Button onClick={() => handleUpdateBudget()} color="success" variant="contained"
                                        disabled={department === '' || year === 0 || amount === 0 || description === ''}>{t('financeService.update')}</Button>
                                :
                                <Button onClick={() => handleSaveBudget()} color="success" variant="contained"
                                        disabled={department === '' || year === 0 || amount === 0 || description === ''}>{t('financeService.save')}</Button>
                        }
                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
};

export default BudgetPage;