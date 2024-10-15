import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {useTranslation} from "react-i18next";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {Button, Typography} from "@mui/material";
import {
    fetchIncomeByMonths,
    fetchExpenseByMonths, fetchFindExpenseByDate, fetchFindIncomeByDate
} from "../../store/feature/financeSlice.tsx";
import {Bar, Pie} from 'react-chartjs-2';
import 'chart.js/auto';
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const FinancialReportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    //startDate değişkeni: tipi Date başlangıç değeri ise 2 ocak 2024
    const [startDate, setStartDate] = useState<Date>(new Date(2024, 0, 2));
    //endDate değişkeni: tipi Date başlangıç değeri ise 31 aralık 2024
    const [endDate, setEndDate] = useState<Date>(new Date(2024, 11, 31));
    //const [endDate, setEndDate] = useState<Date | null>(null);
    const [incomeData, setIncomeData] = useState<number[]>([]);
    const [expenseData, setExpenseData] = useState<number[]>([]);
    const [monthsLabels, setMonthsLabels] = useState<string[]>([]);
    const [netIncomeData, setNetIncomeData] = useState<number[]>([]);
    const [isCalculated, setIsCalculated] = useState<boolean>(false);
    const incomes = useAppSelector((state) => state.financeSlice.incomeList);
    const expenses = useAppSelector((state) => state.financeSlice.expenseList);

    const months = (startDate: Date, endDate: Date) => {
        const result = [];
        let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        while (currentDate <= endDate) {
            result.push(currentDate.toLocaleString('default', {month: 'short'}));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return result;
    };

    const incomeColumns: GridColDef[] = [
        {field: 'source', headerName: 'Source', flex: 1.5, headerAlign: "center"},
        {field: 'amount', headerName: 'Amount (₺)', flex: 1.5, headerAlign: "center", type: 'number'},
        {field: 'incomeDate', headerName: 'Income Date', flex: 1.5, headerAlign: "center"},
    ];

    const expenseColumns: GridColDef[] = [
        {field: "amount", headerName: t("financeService.amounttl"), flex: 1.5, headerAlign: "center", type: "number"},
        {field: "description", headerName: t("financeService.description"), flex: 1.5, headerAlign: "center"},
        {field: "expenseDate", headerName: t("financeService.date"), flex: 1.5, headerAlign: "center"},
        {field: "departmentName", headerName: t("financeService.department"), flex: 1.5, headerAlign: "center"},
        {field: "expenseCategory", headerName: t("financeService.category"), flex: 1.5, headerAlign: "center"},
    ];

    useEffect(() => {
            dispatch(fetchFindIncomeByDate({startDate, endDate}));
            dispatch(fetchFindExpenseByDate({startDate, endDate}));
    }, [dispatch]);

    const handleSearch = async () => {
        if (startDate && endDate) {
            const incomeResult = await dispatch(fetchIncomeByMonths({
                startDate,
                endDate
            })).unwrap();

            const expenseResult = await dispatch(fetchExpenseByMonths({
                startDate,
                endDate
            })).unwrap();

            const monthsArray = months(startDate, endDate);
            const incomeArray = new Array(monthsArray.length).fill(0);
            const expenseArray = new Array(monthsArray.length).fill(0);
            const netIncomeArray = new Array(monthsArray.length).fill(0);

            if (incomeResult.code === 200) {
                incomeResult.data.forEach((value: number, index: number) => {
                    if (index < incomeArray.length) {
                        incomeArray[index] = value;
                    }
                });
            }

            if (expenseResult.code === 200) {
                expenseResult.data.forEach((value: number, index: number) => {
                    if (index < expenseArray.length) {
                        expenseArray[index] = value;
                    }
                });
            }

            // Calculate net income
            incomeArray.forEach((income, index) => {
                netIncomeArray[index] = income - expenseArray[index];
            });

            setIncomeData(incomeArray);
            setExpenseData(expenseArray);
            setNetIncomeData(netIncomeArray);
            setMonthsLabels(monthsArray);
            setIsCalculated(true);
        }
    };

    const totalIncome = incomeData.reduce((acc, cur) => acc + cur, 0);
    const totalExpenses = expenseData.reduce((acc, cur) => acc + cur, 0);

    const incomeVsExpenseData = {
        labels: [t('financeService.totalIncome'), t('financeService.totalExpenses')],
        datasets: [
            {
                data: [totalIncome, totalExpenses],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }
        ]
    };

    const expenseBreakdownData = {
        labels: ['Operations', 'Salaries', 'Marketing'], // Example categories
        datasets: [
            {
                data: [300000, 500000, 200000],  // Example values
                backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }
        ]
    };

    const data = {
        labels: monthsLabels,
        datasets: [
            {
                label: t("financeService.grossIncome"),
                data: incomeData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barPercentage: 0.6,
                categoryPercentage: 0.7
            },
            {
                label: t("financeService.expense"),
                data: expenseData,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                barPercentage: 0.6,
                categoryPercentage: 0.7
            },
            {
                label: t("financeService.netIncome"),
                data: netIncomeData,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                barPercentage: 0.6,
                categoryPercentage: 0.7
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10000
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'}}>
            {/* Date Pickers and Button */}
            <div style={{display: 'flex', gap: '10px'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.startdate")}
                        value={startDate ? dayjs(startDate) : null}
                        onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : new Date(2024, 0, 2))}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.enddate")}
                        value={endDate ? dayjs(endDate) : null}
                        onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : new Date(2024, 11, 31))}
                        shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                    />
                </LocalizationProvider>
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    {t('financeService.getreport')}
                </Button>
            </div>

            {monthsLabels.length > 0 && (
                <div style={{width: '60%'}}>
                    <Bar data={data} options={options}/>
                </div>
            )}

            {isCalculated && (
                <div style={{display: 'column', justifyContent: 'space-around', width: '80%', marginTop: 50}}>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <div>
                            <Typography variant="h6" align="center">
                                {t('financeService.incomeVsExpense')}
                            </Typography>
                            <Pie data={incomeVsExpenseData} style={{maxHeight: '250px'}}/>
                        </div>
                        <div>
                            <Typography variant="h6" align="center">
                                {t('financeService.expenseBreakdown')}
                            </Typography>
                            <Pie data={expenseBreakdownData} style={{maxHeight: '250px'}}/>
                        </div>
                    </div>
                    <div style={{height: "auto"}}>
                        <div style={{marginTop: 75, marginBottom: 50}}>
                            <DataGrid
                                rows={expenses}
                                columns={expenseColumns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {page: 1, pageSize: 5},
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
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
                            />
                        </div>
                        <DataGrid
                            rows={incomes}
                            columns={incomeColumns}
                            initialState={{
                                pagination: {
                                    paginationModel: {page: 1, pageSize: 5},
                                },
                            }}
                            pageSizeOptions={[5, 10]}
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
                        />
                    </div>
                </div>
            )}

            {incomes.length > 0 && expenses.length > 0 && (
                <div></div>
            )}
        </div>
    );
};

export default FinancialReportPage;