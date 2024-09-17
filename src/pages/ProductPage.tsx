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
import  {AppDispatch, useAppSelector} from "../store";
import {
    fetchChangeAutoOrderModeOfProduct,
    fetchFindAllProduct, fetchFindAllProductCategory,
    fetchFindAllSupplier, fetchFindAllWareHouse, fetchSaveProduct
} from "../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import {ISupplier} from "../model/ISupplier.tsx";
import {IWareHouse} from "../model/IWareHouse.tsx";
import {IProductCategory} from "../model/IProductCategory.tsx";





const ProductPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const products = useAppSelector((state) => state.stockSlice.productList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);



    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    //MODAL
    const [openAddProductModal, setOpenAddProductModel] = useState(false);
    const [warehouses, setWarehouses] = useState<ISupplier[]>({} as ISupplier[]);
    const [selectedSupplier,setSelectedSupplier] = useState<ISupplier>({} as ISupplier);
    const [wareHouses, setWareHouses] = useState<IWareHouse[]>({} as IWareHouse[]);
    const [selectedWarehouse,setSelectedWareHouse] = useState<IWareHouse>({} as IWareHouse);
    const [productCategories, setProductCategories] = useState<IProductCategory[]>({} as IProductCategory[]);
    const [selectedProductCategory,setSelectedProductCategory] = useState<IProductCategory>({} as IProductCategory);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stockCount, setStockCount] = useState(0);
    const [minimumStockLevel, setMinimumStockLevel] = useState(0);

    useEffect(() => {
        dispatch(
            fetchFindAllProduct({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        )
    }, [dispatch, searchText, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };



    const handleOpenAddProductModal = () => {
        setOpenAddProductModel(true);
        dispatch(fetchFindAllSupplier({searchText:'',page: 0, size: 100})).then((res) => {
            setWarehouses(res.payload.data);
        })
        dispatch(fetchFindAllWareHouse({searchText:'',page: 0, size: 100})).then((res) => {
            setWareHouses(res.payload.data);
        })
        dispatch(fetchFindAllProductCategory({searchText:'',page: 0, size: 100})).then((res) => {
            setProductCategories(res.payload.data);
        })
    };

    const handleSaveProduct = async () => {
        setLoading(true);
        dispatch(fetchSaveProduct({productCategoryId:selectedProductCategory as any,supplierId:selectedSupplier as any,wareHouseId:selectedWarehouse as any,name,description,price,stockCount,minimumStockLevel})).then(() => {
            setName('');
            setDescription('');
            setPrice(0);
            setStockCount(0);
            setMinimumStockLevel(0);
            setSelectedProductCategory({} as IProductCategory);
            setSelectedSupplier({} as ISupplier);
            setSelectedWareHouse({} as IWareHouse);
            setLoading(false);
            setOpenAddProductModel(false);
            Swal.fire({
                title: t("swal.success"),
                text: t("stockService.productsuccesfullyadded"),
                icon: "success",
            });
        })

        setOpenAddProductModel(false)
    }

    const columns: GridColDef[] = [
        { field: "name", headerName: t("authentication.name"), flex: 1.5, headerAlign: "center" },
        { field: "description", headerName: t("stockService.description"), flex: 1.5, headerAlign: "center" },
        {
            field: "price", headerName: t("stockService.price"), flex: 1, headerAlign: "center",
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

        { field: "stockCount", headerName: t("stockService.stockcount"), flex: 1, headerAlign: "center" },
        { field: "minimumStockLevel", headerName: t("stockService.minstockcount"), headerAlign: "center", flex: 1.5 },
        { field: "isAutoOrderEnabled", headerName: t("stockService.autoorder"), headerAlign: "center", flex: 1 },
        { field: "status", headerName: t("stockService.status"), headerAlign: "center", flex: 1 },


    ];

    const handleChangeAutoOrderMode = async () => {
        for (let id of selectedRowIds) {
            const selectedProduct = products.find(
                (selectedProduct) => selectedProduct.id === id
            );
            if (!selectedProduct) continue;

            setLoading(true);
            try {
                const result = await Swal.fire({
                    title: t("swal.areyousure"),
                    text: t("swal.changeorderstatus"),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t("swal.yeschangeit"),
                });

                if (result.isConfirmed) {
                    const data = await dispatch(fetchChangeAutoOrderModeOfProduct(selectedProduct.id));

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
                            title: t("swal.changed"),
                            text: t("swal.productautoordermodechanged"),
                            icon: "success",
                        });
                        await dispatch(fetchFindAllProduct({
                            page: 0,
                            size: 100,
                            searchText: searchText,
                        }));
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        setSelectedRowIds([]);
        setLoading(false);
    };
    {console.log(selectedSupplier)}
    {console.log(selectedWarehouse)}
    {console.log(selectedProductCategory)}
    return (
        <div style={{ height: "auto"}}>
            <TextField
                label={t("stockService.searchbyname")}
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
                rows={products}
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
                        {t("stockService.addproduct")}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
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
                </Grid>
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


                <Dialog open={openAddProductModal} onClose={() => setOpenAddProductModel(false)} fullWidth maxWidth='sm'>
                    <DialogTitle>{t("stockService.addproduct")}</DialogTitle>
                    <DialogContent>
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectsupplier')}</InputLabel>
                            <Select
                                value={selectedSupplier}
                                onChange={event => setSelectedSupplier(event.target.value as ISupplier)}
                                label="Suppliers"
                            >
                                {Object.values(warehouses).map(supplier => (
                                    <MenuItem key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectwarehouse')}</InputLabel>
                            <Select
                                value={selectedWarehouse}
                                onChange={event => setSelectedWareHouse(event.target.value as IWareHouse)}
                                label="Ware Houses"
                            >
                                {Object.values(wareHouses).map(warehouse => (
                                    <MenuItem key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ width: '100%' , marginTop:'15px' }}>
                            <InputLabel>{t('stockService.pleaseselectcategory')}</InputLabel>
                            <Select
                                value={selectedProductCategory}
                                onChange={event => setSelectedProductCategory(event.target.value as IProductCategory)}
                                label="Product Categories"
                            >
                                {Object.values(productCategories).map(productCategory => (
                                    <MenuItem key={productCategory.id} value={productCategory.id}>
                                        {productCategory.name}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <TextField
                            sx={{marginTop:'15px'}}
                            label={t('stockService.productname')}
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop:'15px'}}
                            label={t('stockService.description')}
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop:'15px'}}
                            label={t('stockService.price')}
                            name="price"
                            value={price}
                            onChange={e => setPrice((Number)(e.target.value))}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop:'15px'}}
                            label={t('stockService.stockcount')}
                            name="stockCount"
                            value={stockCount}
                            onChange={e => setStockCount((Number)(e.target.value))}
                            required
                            fullWidth
                        />
                        <TextField
                            sx={{marginTop:'15px'}}
                            label={t('stockService.minstocklevel')}
                            name="minStockLevel"
                            value={minimumStockLevel}
                            onChange={e => setMinimumStockLevel((Number)(e.target.value))}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddProductModel(false)} color="error" variant="contained">{t('stockService.cancel')}</Button>
                        <Button onClick={() => handleSaveProduct()} color="success" variant="contained" disabled={selectedSupplier === null || selectedWarehouse === null || selectedProductCategory === null || name === '' || description === '' || price === 0 || stockCount === 0 || minimumStockLevel === 0}>{t('stockService.save')}</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}


export default ProductPage