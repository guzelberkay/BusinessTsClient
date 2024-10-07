import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {useTranslation} from "react-i18next";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React, {useState} from "react";
import {Button, Typography} from "@mui/material";
import {
    fetchIncomeByMonths,
    fetchExpenseByMonths
} from "../../store/feature/financeSlice.tsx";
import {Bar, Pie} from 'react-chartjs-2';
import 'chart.js/auto';

const FinancialReportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [incomeData, setIncomeData] = useState<number[]>([]);
    const [expenseData, setExpenseData] = useState<number[]>([]);
    const [monthsLabels, setMonthsLabels] = useState<string[]>([]);
    const [netIncomeData, setNetIncomeData] = useState<number[]>([]);
    const [isCalculated, setIsCalculated] = useState<boolean>(false);

    const months = (startDate: Date, endDate: Date) => {
        const result = [];
        let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        while (currentDate <= endDate) {
            result.push(currentDate.toLocaleString('default', {month: 'short'}));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return result;
    };

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
                        onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.enddate")}
                        value={endDate ? dayjs(endDate) : null}
                        onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
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
                <div style={{display: 'flex', justifyContent: 'space-around', width: '60%', marginTop: 50}}>
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
            )}
        </div>
    );
};

export default FinancialReportPage;