import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from '@mui/x-data-grid';
import {useDispatch} from 'react-redux';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
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
import Swal from "sweetalert2";

const BudgetPage: React.FC = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const [budgetList, setBudgetList] = useState<IBudget[]>([]);
    const budgets = useAppSelector((state) => state.financeSlice.budgetList);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const {t} = useTranslation();
    const [openSaveBudgetModal, setOpenSaveBudgetModal] = useState(false);
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState(0);
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const columns: GridColDef[] = [
        {field: 'department', headerName: 'Department', flex: 1.5, headerAlign: "center"},
        {field: 'year', headerName: 'Year', flex: 1.5, headerAlign: "center"},
        {field: 'amount', headerName: 'Amount', flex: 1.5, headerAlign: "center", type: 'number'},
        {
            field: 'spentAmount',
            headerName: 'Spent Amount',
            flex: 1.5,
            headerAlign: "center",
            type: 'number',
            renderCell: (params) => {
                const isExceeding = params.row.spentAmount > params.row.amount;
                return (
                    <div style={{
                        backgroundColor: isExceeding ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)',
                        color: isExceeding ? 'red' : 'green',
                        padding: '5px',
                        borderRadius: '4px',
                        textAlign: 'center',
                    }}>
                        {params.row.spentAmount}
                    </div>
                );
            },
        },
        {field: 'description', headerName: 'Description', flex: 1.5, headerAlign: "center"},
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
        });
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
    };

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
    };

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
        setOpenSaveBudgetModal(false);
    };

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
    };

    const handleDeleteBudget = async () => {
        for (let id of selectedRowIds) {
            const selectedBudget = budgets.find(
                (selectedBudget) => selectedBudget.id === id
            );
            if (!selectedBudget) continue;

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
                        fetchBudgetData();
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
    };

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
                        disabled={loading || selectedRowIds.length === 0}
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
            </Grid>
            <Dialog open={openSaveBudgetModal} onClose={() => setOpenSaveBudgetModal(false)}>
                <DialogTitle>
                    {isUpdating ? t("financeService.updatebudget") : t("financeService.savebudget")}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t("financeService.department")}
                                variant="outlined"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t("financeService.year")}
                                variant="outlined"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t("financeService.amount")}
                                variant="outlined"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t("financeService.description")}
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSaveBudgetModal(false)}>{t("swal.cancel")}</Button>
                    <Button onClick={isUpdating ? handleUpdateBudget : handleSaveBudget}>
                        {isUpdating ? t("financeService.update") : t("financeService.save")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BudgetPage;