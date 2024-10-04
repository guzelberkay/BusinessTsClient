import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {useTranslation} from "react-i18next";
import {IInvoice} from "../../model/IInvoice.tsx";
import React, {useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowSelectionModel, GridToolbar} from "@mui/x-data-grid";
import {fetchFindAllBudget, fetchFindAllInvoice} from "../../store/feature/financeSlice.tsx";
import {TextField} from "@mui/material";

const InvoicePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [invoiceList, setInvoiceList] = useState<IInvoice[]>([]);
    const invoices = useAppSelector((state) => state.financeSlice.invoiceList);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const columns: GridColDef[] = [
        {field: 'buyerTcNo', headerName: 'T.C No', flex: 1.5, headerAlign: "center"},
        {field: 'buyerEmail', headerName: 'Email', flex: 1.5, headerAlign: "center"},
        {field: 'buyerPhone', headerName: 'Phone', flex: 1.5, headerAlign: "center"},
        {field: 'productId', headerName: 'Product ID', flex: 1.5, headerAlign: "center", type: 'number'},
        {field: 'productName', headerName: 'Product Name', flex: 1.5, headerAlign: "center"},
        {field: 'quantity', headerName: 'Quantity', flex: 1.5, headerAlign: "center", type: 'number'},
        {field: 'price', headerName: 'Price', flex: 1.5, headerAlign: "center", type: 'number'},
        {field: 'totalAmount', headerName: 'Total Amount', flex: 1.5, headerAlign: "center", type: 'number'},
        {field: 'invoiceDate', headerName: 'Date', flex: 1.5, headerAlign: "center"},
    ];

    useEffect(() => {
        dispatch(
            fetchFindAllInvoice({
                searchText: searchText,
                page: 0,
                size: 100
            })
        ).then(data => {
            setInvoiceList(data.payload.data);
        })
    }, [dispatch, searchText]);

    const fetchInvoiceData = () => {
        dispatch(fetchFindAllInvoice({
            searchText: searchText,
            page: 0,
            size: 100
        })).then((data) => {
            setInvoiceList(data.payload.data);
        });
    };

    return (
        <div style={{height: "auto"}}>
            <TextField
                label={t("financeService.searchbyproductname")}
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
                rows={invoiceList}
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
        </div>
    )
};

export default InvoicePage;