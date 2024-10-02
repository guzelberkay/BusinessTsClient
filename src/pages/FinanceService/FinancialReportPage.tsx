import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Button } from "@mui/material";
import {
    fetchIncomeByMonths,
    fetchExpenseByMonths
} from "../../store/feature/financeSlice.tsx";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const FinancialReportPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [incomeData, setIncomeData] = useState<number[]>([]);
    const [expenseData, setExpenseData] = useState<number[]>([]);
    const [monthsLabels, setMonthsLabels] = useState<string[]>([]);

    const months = (startDate: Date, endDate: Date) => {
        const result = [];
        let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        while (currentDate <= endDate) {
            result.push(currentDate.toLocaleString('default', { month: 'short' }));
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

            setIncomeData(incomeArray);
            console.log("incomeArray", incomeArray);
            setExpenseData(expenseArray);
            setMonthsLabels(monthsArray);
        }
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
                barPercentage: 0.3
            },
            {
                label: t("financeService.expense"),
                data: expenseData,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                barPercentage: 0.3
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 200000
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
        <div style={{ height: "auto" }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.startdate")}
                        value={startDate ? dayjs(startDate) : null}
                        sx={{ width: '100%' }}
                        onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.enddate")}
                        value={endDate ? dayjs(endDate) : null}
                        sx={{ width: '100%' }}
                        onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
                        shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                    />
                </LocalizationProvider>
            </div>
            <Button variant="contained" color="primary" onClick={handleSearch}>
                {t('financeService.getreport')}
            </Button>
            {monthsLabels.length > 0 && (
                <Bar data={data} options={options} />
            )}
        </div>
    );
};

export default FinancialReportPage;