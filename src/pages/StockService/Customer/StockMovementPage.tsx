import React, {useEffect, useState} from "react";
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

import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../../store";
import {
    fetchChangeAutoOrderModeOfProduct, fetchDeleteProductCategory, fetchDeleteStockMovement,
    fetchFindAllBuyOrder,
    fetchFindAllByMinimumStockLevel,
    fetchFindAllProduct, fetchFindAllProductCategory,
    fetchFindAllSellOrder,
    fetchFindAllStockMovement,
    fetchFindAllSupplier, fetchFindAllWareHouse, fetchFindByIdProductCategory, fetchFindByIdStockMovement,
    fetchSaveProductCategory, fetchSaveStockMovement, fetchUpdateProductCategory, fetchUpdateStockMovement
} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {IProduct} from "../../../model/IProduct.tsx";
import {IStockMovement} from "../../../model/IStockMovement.tsx";
import MenuItem from "@mui/material/MenuItem";
import {ISupplier} from "../../../model/ISupplier.tsx";
import {IWareHouse} from "../../../model/IWareHouse.tsx";


const StockMovementPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [stockMovements, setStockMovements] = useState<IStockMovement[]>([]);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //MODAL

    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedProduct,setSelectedProduct] = useState(0);
    const [wareHouses, setWareHouses] = useState<IWareHouse[]>([]);
    const [selectedWarehouse,setSelectedWareHouse] = useState(0);
    const [selectedStockMovementType,setSelectedStockMovementType] = useState('');

    const [openAddStockMovementModal, setOpenAddStockMovementModal] = useState(false);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        dispatch(
            fetchFindAllStockMovement({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setStockMovements(data.payload.data);
        })
    }, [dispatch, searchText, loading, isActivating, isDeleting, isSaving, isUpdating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };

    const handleOpenAddProductCategoryModal = () => {
        setOpenAddStockMovementModal(true);
        setIsUpdating(false)
        dispatch(fetchFindAllProduct({searchText:'',page: 0, size: 1000})).then((res) => {
            setProducts(res.payload.data);
        })
        dispatch(fetchFindAllWareHouse({searchText:'',page: 0, size: 1000})).then((res) => {
            setWareHouses(res.payload.data);
        })
    };

    const handleSaveStockMovement = async () => {
        setIsSaving(true)
        dispatch(fetchSaveStockMovement({
            productId: selectedProduct,
            quantity: quantity,
            warehouseId: selectedWarehouse,
            stockMovementType: selectedStockMovementType
        }))
            .then((data) => {
                if (data.payload.message === "Success") {
                    setSelectedWareHouse(0)
                    setSelectedProduct(0)
                    setQuantity(0)
                    setSelectedStockMovementType('')
                    setOpenAddStockMovementModal(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("stockService.successfullyadded"),
                        icon: "success",
                    });
                    setIsSaving(false)
                } else {
                    setSelectedWareHouse(0)
                    setSelectedProduct(0)
                    setQuantity(0)
                    setSelectedStockMovementType('')
                    setOpenAddStockMovementModal(false);
                    Swal.fire({
                        title: t("swal.error"),
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: t("swal.ok"),
                    });
                    setIsSaving(false)
                }
            })
    };

    const handleOpenUpdateModal = async () => {
        setOpenAddStockMovementModal(true);
        setIsUpdating(true)

        dispatch(fetchFindByIdStockMovement(selectedRowIds[0])).then((data) => {
            setSelectedWareHouse(data.payload.data.warehouseId)
            setSelectedProduct(data.payload.data.productId)
            setQuantity(data.payload.data.quantity)
            setSelectedStockMovementType(data.payload.data.stockMovementType)
        })
    }
    const handleUpdate = async () => {
        dispatch(fetchUpdateStockMovement({ id: selectedRowIds[0], productId: selectedProduct, warehouseId: selectedWarehouse, quantity: quantity, stockMovementType: selectedStockMovementType})).then(() => {
            setSelectedWareHouse(0)
            setSelectedProduct(0)
            setQuantity(0)
            setSelectedStockMovementType('')
            setOpenAddStockMovementModal(false);
            Swal.fire({
                title: t("stockService.updated"),
                text: t("stockService.successfullyupdated"),
                icon: "success",
            });
            setIsUpdating(false)
        })
    }

    const handleDelete = async () => {
        for (let id of selectedRowIds) {
            const selectedStockMovement = stockMovements.find(
                (selectedStockMovement) => selectedStockMovement.id === id
            );
            if (!selectedStockMovement) continue;

            setIsDeleting(true);
            try {
                const result = await Swal.fire({
                    title: t("swal.areyousure"),
                    text: t("stockService.deleting"),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("stockService.yesdeleteit"),
                    cancelButtonText: t("stockService.cancel"),
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteStockMovement(selectedStockMovement.id));

                    if (data.payload.message !=="Success") {
                        await Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                        return;
                    } else {
                        await Swal.fire({
                            title: t("stockService.deleted"),
                            text: t("stockService.successfullydeleted"),
                            icon: "success",
                        });
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
        setIsDeleting(false);
    }

    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const columns: GridColDef[] = [
        {field: "productName", headerName: t("stockService.productname"), flex: 1.5, headerAlign: "center"},
        {field: "wareHouseName", headerName: t("stockService.warehousename"), flex: 1.5, headerAlign: "center"},
        {field: "quantity", headerName: t("stockService.quantity"), flex: 1, headerAlign: "center"},
        {field: "stockMovementType", headerName: t("stockService.stockmovementtype"), flex: 1, headerAlign: "center"},
        {field: "status", headerName: t("stockService.status"), headerAlign: "center", flex: 1},
        {field: "createdAt", headerName: t("stockService.createdat"), headerAlign: "center", flex: 1},
    ];

    const stockMovementTypes = {
        IN: { name: 'IN' },
        OUT: { name: 'OUT' }
    };


    return (
        <div style={{height: "auto"}}>
            {/*//TODO I WILL CHANGE THIS SEARCH METHOD LATER*/}
            <TextField
                label={t("stockService.searchbyname")}
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
                rows={stockMovements}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5},
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

            <Grid container spacing={2} sx={{
                flexGrow: 1,
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                marginTop: '2%',
                marginBottom: '2%'
            }}>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenAddProductCategoryModal}
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
                        {t("stockService.add")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleOpenUpdateModal}
                        variant="contained"
                        color="primary"
                        //startIcon={<DeclineIcon />}
                        disabled={selectedRowIds.length > 1 || selectedRowIds.length === 0}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t("stockService.update")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleDelete}
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
                        {t("stockService.delete")}
                    </Button>
                </Grid>
                <Dialog open={openAddStockMovementModal} onClose={() => setOpenAddStockMovementModal(false)}
                        fullWidth
                        maxWidth='sm'>
                    <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addstockmovement')}</DialogTitle>
                    <DialogContent>
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectproduct')}</InputLabel>
                            <Select
                                value={selectedProduct}
                                onChange={event => setSelectedProduct((Number)(event.target.value))}
                                label="Suppliers"
                            >
                                {Object.values(products).map(product => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectwarehouse')}</InputLabel>
                            <Select
                                value={selectedWarehouse}
                                onChange={event => setSelectedWareHouse((Number)(event.target.value))}
                                label="Ware Houses"
                            >
                                {Object.values(wareHouses).map(warehouse => (
                                    <MenuItem key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <TextField
                            sx={{marginTop: '15px'}}
                            label={t('stockService.quantity')}
                            name="quantity"
                            value={quantity}
                            onChange={e => setQuantity((Number)(e.target.value))}
                            required
                            fullWidth
                        />
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectstockmovementtype')}</InputLabel>
                            <Select
                                value={selectedStockMovementType}
                                onChange={event => setSelectedStockMovementType(event.target.value)}
                                label="StockMovements"
                                disabled={isUpdating}
                            >
                                {Object.values(stockMovementTypes).map(stockMovement => (
                                    <MenuItem key={stockMovement.name} value={stockMovement.name}>
                                        {stockMovement.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenAddStockMovementModal(false), setIsUpdating(false)
                        }} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        {isUpdating ? <Button onClick={() => handleUpdate()} color="success" variant="contained"
                                              disabled={selectedProduct === 0 || selectedWarehouse === 0 || quantity === 0 || selectedStockMovementType === ''}>{t('stockService.update')}</Button>
                            :
                            <Button onClick={() => handleSaveStockMovement()} color="success" variant="contained"
                                    disabled={selectedProduct === 0 || selectedWarehouse === 0 || quantity === 0 || selectedStockMovementType === ''}>{t('stockService.save')}</Button>
                        }

                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default StockMovementPage