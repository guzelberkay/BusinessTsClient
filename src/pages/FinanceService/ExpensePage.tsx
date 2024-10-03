import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {useTranslation} from "react-i18next";
import {GridColDef, DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";
import {
    fetchDeleteBudget, fetchDeleteExpense,
    fetchFindAllExpense,
    fetchFindByIdExpense,
    fetchFindExpenseByDate,
    fetchGetAllExpenseCategories,
    fetchSaveExpense,
    fetchUpdateExpense,
} from "../../store/feature/financeSlice";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {IIncome} from "../../model/IIncome";
import {IExpenseCategory} from "../../model/IExpenseCategory";

const ExpensePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const expenses = useAppSelector((state) => state.financeSlice.expenseList);
    const [expenseList, setExpenseList] = useState<IIncome[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [expenseDate, setExpenseDate] = useState<Date>(new Date());
    const [openSaveExpenseModal, setOpenSaveExpenseModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [expenseCategory, setExpenseCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [expenseCategories, setExpenseCategories] = useState<IExpenseCategory[]>([]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const columns: GridColDef[] = [
        {field: "amount", headerName: t("financeService.amount"), width: 120, type: "number"},
        {field: "description", headerName: t("financeService.description"), width: 150},
        {field: "expenseDate", headerName: t("financeService.date"), width: 150},
    ];

    useEffect(() => {
        dispatch(
            fetchFindAllExpense({
                searchText: searchText,
                page: 0,
                size: 100,
            })
        );
    }, [dispatch, searchText]);

    const fetchExpenseData = () => {
        dispatch(
            fetchFindAllExpense({
                searchText: searchText,
                page: 0,
                size: 100,
            })
        );
    };

    const handleOpenSaveExpenseModal = () => {
        setOpenSaveExpenseModal(true);
        dispatch(fetchGetAllExpenseCategories()).then((data) => {
            setExpenseCategories(data.payload.data);
        });
    };

    const handleOpenUpdateExpenseModal = () => {
        const selectedId = selectedRowIds[0];
        if (selectedId) {
            setOpenSaveExpenseModal(true);
            setIsUpdating(true);
            dispatch(fetchGetAllExpenseCategories()).then((data) => {
                setExpenseCategories(data.payload.data);
            });
            dispatch(fetchFindByIdExpense(selectedId)).then((data) => {
                setExpenseCategory(data.payload.data.expenseCategory);
                setExpenseDate(new Date(data.payload.data.expenseDate));
                setAmount(data.payload.data.amount);
                setDescription(data.payload.data.description);
            });
        }
    };

    const handleSaveExpense = () => {
        setLoading(true);
        dispatch(fetchSaveExpense({expenseCategory, expenseDate, amount, description})).then(() => {
            setAmount(0);
            setExpenseDate(new Date());
            setDescription("");
            setExpenseCategory("");
            setLoading(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("financeService.incomesuccesfullyadded"),
                icon: "success",
            });
            fetchExpenseData();
        });
        setOpenSaveExpenseModal(false);
    };

    const handleUpdateExpense = () => {
        setLoading(true);
        const selectedId = selectedRowIds[0];
        console.log("selectedId", selectedId);

        dispatch(fetchUpdateExpense({
            id: selectedId,
            expenseDate,
            amount,
            description,
            expenseCategory,
        })).then(() => {
            setAmount(0);
            setExpenseDate(new Date());
            setDescription("");
            setLoading(false);
            Swal.fire({
                title: t("financeService.updated"),
                text: t("financeService.incomesuccesfullyupdated"),
                icon: "success",
            });
            fetchExpenseData();
        });
        setOpenSaveExpenseModal(false);
    };

    const handleDeleteExpense = async () => {
        for (let id of selectedRowIds) {
            const selectedExpense = expenses.find(
                (selectedExpense) => selectedExpense.id === id
            );
            if (!selectedExpense) continue;

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
                    const data = await dispatch(fetchDeleteExpense(selectedExpense.id));

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
                        fetchExpenseData();
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
    };

    const handleSearch = () => {
        if (startDate && endDate) {
            dispatch(fetchFindExpenseByDate({
                startDate,
                endDate,
            }));
        }
    };

    return (
        <div style={{height: "auto"}}>
            <div style={{display: "flex", gap: "10px"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.startdate")}
                        value={startDate ? dayjs(startDate) : null}
                        sx={{width: "100%"}}
                        onChange={(newValue) =>
                            setStartDate(newValue ? newValue.toDate() : null)
                        }
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.enddate")}
                        value={endDate ? dayjs(endDate) : null}
                        sx={{width: "100%"}}
                        onChange={(newValue) =>
                            setEndDate(newValue ? newValue.toDate() : null)
                        }
                        shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                    />
                </LocalizationProvider>
                <Button variant="contained" onClick={handleSearch}>
                    {t("Search")}
                </Button>
            </div>
            <TextField
                label={t("financeService.searchbydescription")}
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{marginBottom: "1%", marginTop: "1%"}}
                fullWidth
                inputProps={{maxLength: 50}}
            />
            <DataGrid
                rows={expenses}
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
                    variant="contained"
                    color="success"
                    onClick={handleOpenSaveExpenseModal}
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
                    variant="contained"
                    color="warning"
                    onClick={handleOpenUpdateExpenseModal}
                    disabled={selectedRowIds.length != 1 || loading}
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
                    variant="contained"
                    color="error"
                    onClick={handleDeleteExpense}
                    disabled={isDeleting || selectedRowIds.length === 0}
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
            <Dialog open={openSaveExpenseModal} onClose={() => setOpenSaveExpenseModal(false)}>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel id="expense-category-label">{t("financeService.category")}</InputLabel>
                        <Select
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                            labelId={t("financeService.description")}
                        >
                            {Object.values(expenseCategories).map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.expenseCategory}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label={t("financeService.amount")}
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <TextField
                        label={t("financeService.description")}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t("financeService.expensedate")}
                            value={dayjs(expenseDate)}
                            onChange={(newValue) => setExpenseDate(newValue?.toDate() || new Date())}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSaveExpenseModal(false)}>{t("financeService.cancel")}</Button>
                    <Button onClick={isUpdating ? handleUpdateExpense : handleSaveExpense}>
                        {isUpdating ? t("financeService.update") : t("financeService.save")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
        </div>
    );
};

export default ExpensePage;