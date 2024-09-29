import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button,
    Grid,
    TextField

} from "@mui/material";

import { useDispatch } from "react-redux";
import  {AppDispatch, useAppSelector} from "../../../store";
import {
    fetchApproveOrder,
    fetchChangeAutoOrderModeOfProduct, fetchDeleteOrder, fetchFindAllBuyOrder,
    fetchFindAllByMinimumStockLevel, fetchFindAllOrdersOfSupplier,
    fetchFindAllProduct
} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {IProduct} from "../../../model/IProduct.tsx";
import {IOrder} from "../../../model/IOrder.tsx";





const BuyOrderPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [buyOrders,setBuyOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        dispatch(
            fetchFindAllOrdersOfSupplier({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setBuyOrders(data.payload.data);
        })
    }, [dispatch, searchText, loading, isActivating,isApproving]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleApprove = async () => {
        for (let id of selectedRowIds) {
            const selectedBuyOrder = buyOrders.find(
                (selectedBuyOrder) => selectedBuyOrder.id === id
            );
            if (!selectedBuyOrder) continue;

            setIsApproving(true);
            try {
                const result = await Swal.fire({
                    title: t("swal.areyousure"),
                    text: t("stockService.approving"),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("stockService.approveit"),
                    cancelButtonText: t("stockService.cancel"),
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchApproveOrder(selectedBuyOrder.id));

                    if (data.payload.code !=="Success") {
                        await Swal.fire({
                            title: t("swal.success"),
                            text: data.payload.message,
                            icon: "success",
                            confirmButtonText: t("swal.ok"),
                        });

                    } else {
                        await Swal.fire({
                            title: t("stockService.approved"),
                            text: t("stockService.successfullyapproved"),
                            icon: "success",
                        });
                        setIsApproving(false)
                        return

                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
        setIsApproving(false);
    }


    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const columns: GridColDef[] = [
        { field: "productName", headerName: t("stockService.productName"), flex: 1.5, headerAlign: "center" },
        {
            field: "unitPrice", headerName: t("stockService.unitprice"), flex: 1, headerAlign: "center",
            renderCell: (params) => {
                // Check if the value is valid
                const value = params.value;
                if (typeof value === 'number' && !isNaN(value)) {
                    // Format the number as currency
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(value);
                }
                return '$0.00'; // Return default value if not a valid number
            },
        },
        { field: "quantity", headerName: t("stockService.quantity"), flex: 1, headerAlign: "center" },
        { field: "total", headerName: t("stockService.total"), flex: 1, headerAlign: "center",
            renderCell: (params) => {
                // Check if the value is valid
                const value = params.value;
                if (typeof value === 'number' && !isNaN(value)) {
                    // Format the number as currency
                    return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(value);
                }
                return '$0.00'; // Return default value if not a valid number
            }, },
        { field: "createdAt", headerName: t("stockService.createdat"), headerAlign: "center", flex: 1.5 },
        { field: "status", headerName: t("stockService.status"), headerAlign: "center", flex: 1 },


    ];


    return (
        <div style={{ height: "auto"}}>
            {/*//TODO I WILL CHANGE THIS SEARCH METHOD LATER*/}
            <TextField
                label={t("stockService.searchbyproductname")}
                variant="outlined"
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />
            <DataGrid
                slots={{
                    toolbar: GridToolbar,

                }}
                rows={buyOrders}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                // getRowClassName={(params) =>
                //     params.row.isExpenditureApproved
                //         ? "approved-row" // Eğer onaylandıysa, yeşil arka plan
                //         : "unapproved-row" // Onaylanmadıysa, kırmızı arka plan
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
                    }/*,
                    "& .approved-row": {
                        backgroundColor: "#e0f2e9", // Onaylananlar için yeşil arka plan
                    },
                    "& .unapproved-row": {
                        backgroundColor: "#ffe0e0", // Onaylanmayanlar için kırmızı arka plan
                    },*/

                }}
                rowSelectionModel={selectedRowIds}
            />

            <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'stretch', marginTop: '2%', marginBottom: '2%' }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        color="success"
                        disabled={isApproving || selectedRowIds.length === 0}
                        //startIcon={<ApproveIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {t("stockService.approve")}
                    </Button>
                </Grid>
                {/*<Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleChangeAutoOrderMode}
                        variant="contained"
                        color="info"
                        disabled={loading || selectedRowIds.length === 0}
                        //startIcon={<DeclineIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {t("stockService.changeautoordermode")}
                    </Button>
                </Grid>*/}
                {/*<Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleSomething}
                        variant="contained"
                        color="warning"
                        disabled={isActivating || selectedRowIds.length === 0}
                        //startIcon={<CancelIcon/>}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Cancel
                    </Button>
                </Grid>*/}
            </Grid>
        </div>
    );
}


export default BuyOrderPage