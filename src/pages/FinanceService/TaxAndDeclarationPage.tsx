import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useTranslation } from "react-i18next";
import React from 'react';
import {
    MenuItem,
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
    fetchCalculateTotalExpenseByDate,
    fetchCalculateTotalIncomeByDate,
    fetchCreateDeclaration
} from "../../store/feature/financeSlice.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TaxAndDeclarationPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const [taxType, setTaxType] = useState<string>('');
    const [grossIncome, setGrossIncome] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [netIncome, setNetIncome] = useState<number>(0);
    const [totalTax, setTotalTax] = useState<number>(0);
    const [netIncomeAfterTax, setNetIncomeAfterTax] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isCalculated, setIsCalculated] = useState<boolean>(false);

    const handleSearch = async () => {
        if (startDate && endDate) {
            const incomeResult = await dispatch(fetchCalculateTotalIncomeByDate({
                startDate,
                endDate
            })).unwrap();

            const expenseResult = await dispatch(fetchCalculateTotalExpenseByDate({
                startDate,
                endDate
            })).unwrap();

            const totalIncome = incomeResult.data ? parseFloat(incomeResult.data) : 0;
            const totalExpense = expenseResult.data ? parseFloat(expenseResult.data) : 0;

            setGrossIncome(totalIncome);
            setExpense(totalExpense);
            setNetIncome(totalIncome - totalExpense);

            const result = await dispatch(fetchCreateDeclaration({
                taxType,
                netIncome: totalIncome - totalExpense
            })).unwrap();

            const tax = result.data ? parseFloat(result.data) : 0;
            setTotalTax(tax);
            console.log("netIncome", netIncome);
            console.log("tax", tax);
            setNetIncomeAfterTax(netIncome - tax);
            console.log("netIncomeAfterTax", netIncomeAfterTax);
            setIsCalculated(true);
        }
    };

    const handleDownloadPDF = () => {
        const input = document.getElementById('resultTable');
        if (input) {
            html2canvas(input).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 10, 10, 180, canvas.height * 180 / canvas.width);
                pdf.save("declaration-results.pdf");
            });
        }
    };

    return (
        <div style={{ height: "auto" }}>
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '1.5rem',
                        textAlign: 'center'
                    }}>
                    {t("financeService.createdeclaration")}
                </Typography>
            </Box>
            <div style={{ display: 'flex', gap: '10px' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.startdate")}
                        value={startDate ? dayjs(startDate) : null}
                        sx={{ width: '100%' }}
                        onChange={(newValue) =>
                            setStartDate(newValue ? newValue.toDate() : null)}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t("financeService.enddate")}
                        value={endDate ? dayjs(endDate) : null}
                        sx={{ width: '100%' }}
                        onChange={(newValue) =>
                            setEndDate(newValue ? newValue.toDate() : null)}
                        shouldDisableDate={startDate ? (date) => date.isBefore(startDate) : undefined}
                    />
                </LocalizationProvider>
            </div>

            <RadioGroup
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
                row
            >
                <FormControlLabel value="kdv" control={<Radio />} label={t("financeService.vat")} />
                <FormControlLabel value="corporate" control={<Radio />} label={t("financeService.corporate")} />
                <FormControlLabel value="income" control={<Radio />} label={t("financeService.income")} />
            </RadioGroup>

            <Button variant="contained" color="primary" onClick={handleSearch}>
                {t('financeService.createdeclaration')}
            </Button>

            {isCalculated && (
                <>
                    <TableContainer component={Paper} sx={{ marginTop: '20px' }} id="resultTable">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("financeService.grossincome")}</TableCell>
                                    <TableCell>{t("financeService.expense")}</TableCell>
                                    <TableCell>{t("financeService.totaltax")}</TableCell>
                                    <TableCell>{t("financeService.netincomeaftertax")}</TableCell>
                                    <TableCell>{t("financeService.taxtype")}</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{grossIncome} TL</TableCell>
                                    <TableCell>{expense} TL</TableCell>
                                    <TableCell>{totalTax} TL</TableCell>
                                    <TableCell>{netIncomeAfterTax} TL</TableCell>
                                    <TableCell>{taxType === 'kdv' ? t("financeService.vat") : taxType === 'corporate' ? t("financeService.corporate") : t("financeService.income")}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" color="secondary" sx={{ marginTop: '10px' }} onClick={handleDownloadPDF}>
                        {t("financeService.downloadpdf")}
                    </Button>

                    <Box sx={{ marginTop: '20px' }}>
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>
                            {t("financeService.incomedistributionchart")}
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: t("financeService.expense"), value: expense },
                                        { name: t("financeService.netincomeaftertax"), value: netIncomeAfterTax },
                                        { name: t("financeService.totaltax"), value: totalTax },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[
                                        { name: t("financeService.expense"), value: expense },
                                        { name: t("financeService.netincomeaftertax"), value: netIncomeAfterTax },
                                        { name: t("financeService.totaltax"), value: totalTax },
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name: string) => [`${value} TL`, name]}
                                    labelFormatter={(name) => `${name}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </>
            )}
        </div>
    );
};

export default TaxAndDeclarationPage;