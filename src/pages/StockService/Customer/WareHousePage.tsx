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
    fetchChangeAutoOrderModeOfProduct, fetchFindAllBuyOrder,
    fetchFindAllByMinimumStockLevel,
    fetchFindAllProduct, fetchFindAllSellOrder, fetchFindAllSupplier, fetchFindAllWareHouse
} from "../../../store/feature/stockSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {IProduct} from "../../../model/IProduct.tsx";





const WareHousePage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');


    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const [wareHouses,setWareHouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()


    useEffect(() => {
        dispatch(
            fetchFindAllWareHouse({
                page: 0,
                size: 100,
                searchText: searchText,
            })
        ).then(data => {
            setWareHouses(data.payload.data);
        })
    }, [dispatch, searchText, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    };



    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const columns: GridColDef[] = [
        { field: "name", headerName: t("authentication.name"), flex: 1.5, headerAlign: "center" },
        { field: "location", headerName: t("stockService.location"), flex: 1.5, headerAlign: "center" },
        { field: "status", headerName: t("stockService.status"), headerAlign: "center", flex: 1 },
    ];


    return (
        <div style={{ height: "auto"}}>
            {/*//TODO I WILL CHANGE THIS SEARCH METHOD LATER*/}
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
                rows={wareHouses}
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
                {/*<Grid item xs={12} sm={6} md={3} lg={2}>
                    <Button
                        onClick={handleSomething}
                        variant="contained"
                        color="success"
                        disabled={isActivating || selectedRowIds.length === 0}
                        //startIcon={<ApproveIcon />}
                        sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        Approve
                    </Button>
                </Grid>*/}
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


export default WareHousePage