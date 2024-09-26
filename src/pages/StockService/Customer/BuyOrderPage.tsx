import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    Grid, InputLabel, Select,
    TextField

} from "@mui/material";

import { useDispatch } from "react-redux";
import  {AppDispatch, useAppSelector} from "../../../store";
import {
    fetchFindAllBuyOrder,
    fetchFindAllProduct,
    fetchFindAllProductCategory,
    fetchFindAllSupplier,
    fetchFindAllWareHouse, fetchSaveBuyOrder,
    fetchSaveProduct, fetchSaveSellOrder,

} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {IProduct} from "../../../model/IProduct.tsx";
import {ISupplier} from "../../../model/ISupplier.tsx";
import MenuItem from "@mui/material/MenuItem";
import {IWareHouse} from "../../../model/IWareHouse.tsx";
import {IProductCategory} from "../../../model/IProductCategory.tsx";





const BuyOrderPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [buyOrders,setBuyOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //MODAL
    const [openAddBuyOrderModal, setOpenAddBuyOrderModal] = useState(false);
    const [products, setProducts] = useState<IProduct[]>({} as IProduct[]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>({} as ISupplier[]);
    const [selectedSupplier,setSelectedSupplier] = useState<ISupplier>({} as ISupplier);
    const [wareHouses, setWareHouses] = useState<IWareHouse[]>({} as IWareHouse[]);
    const [selectedProduct,setSelectedProduct] = useState<IProduct>({} as IProduct);
    const [quantity, setQuantity] = useState(0);


    useEffect(() => {
        dispatch(
            fetchFindAllBuyOrder({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setBuyOrders(data.payload.data);
        })
    }, [dispatch, searchText, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };




    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const handleOpenAddProductModal = () => {
        setOpenAddBuyOrderModal(true);
        dispatch(fetchFindAllSupplier({searchText:'',page: 0, size: 1000})).then((res) => {
            setSuppliers(res.payload.data);
        })
        dispatch(fetchFindAllProduct({searchText:'',page: 0, size: 1000})).then((res) => {
            setProducts(res.payload.data);
        })
    };

    const handleSaveBuyOrder = async () => {
        setLoading(true);
        dispatch(fetchSaveBuyOrder({ productId: selectedProduct as any, quantity: quantity, supplierId: selectedSupplier as any})).then(() => {

            setSelectedSupplier({} as ISupplier);
            setSelectedProduct({} as IProduct);
            setLoading(false);
            setOpenAddBuyOrderModal(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("stockService.buyordersuccessfullyadded"),
                icon: "success",
            });
        })

        setOpenAddBuyOrderModal(false)
    }

    const columns: GridColDef[] = [
        { field: "supplierName", headerName: t("stockService.suppliername"), flex: 1.5, headerAlign: "center" },
        { field: "email", headerName: "Email", flex: 1.75, headerAlign: "center" },
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
                        onClick={handleOpenAddProductModal}
                        variant="contained"
                        color="success"
                        //startIcon={<ApproveIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {t("stockService.add")}
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
                <Dialog open={openAddBuyOrderModal} onClose={() => setOpenAddBuyOrderModal(false)} fullWidth maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addbuyorder')}</DialogTitle>
                    <DialogContent>
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectsupplier')}</InputLabel>
                            <Select
                                value={selectedSupplier}
                                onChange={event => setSelectedSupplier(event.target.value as ISupplier)}
                                label="Suppliers"
                            >
                                {Object.values(suppliers).map(supplier => (
                                    <MenuItem key={supplier.id} value={supplier.id}>
                                        {supplier.name + ' ' + supplier.surname + ' - ' + supplier.email}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectproduct')}</InputLabel>
                            <Select
                                value={selectedProduct}
                                onChange={event => setSelectedProduct(event.target.value as IProduct)}
                                label="Products"
                            >
                                {Object.values(products).map(product => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <TextField
                            sx={{marginTop:'15px'}}
                            label={t('stockService.quantity')}
                            name="quantity"
                            value={quantity}
                            onChange={e => setQuantity((Number)(e.target.value))}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddBuyOrderModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        {isUpdating ? <Button onClick={() => handleSaveBuyOrder()} color="success" variant="contained" disabled={selectedSupplier === null || selectedProduct === null || quantity === 0 }>{t('stockService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveBuyOrder()} color="success" variant="contained" disabled={selectedSupplier === null || selectedProduct === null || quantity === 0}>{t('stockService.save')}</Button>
                        }

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default BuyOrderPage