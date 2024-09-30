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
import { AppDispatch, useAppSelector } from "../../store";

import {fetchFindAllCustomer} from "../../store/feature/crmSlice.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";





const CustomerPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    //const token = useAppSelector((state) => state.auth.token);
    const customers = useAppSelector((state) => state.crmSlice.customerList);
    const [loading, setLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);



    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation()

    useEffect(() => {
        dispatch(fetchFindAllCustomer({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isActivating,isUpdating,isDeleting]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }




    const columns: GridColDef[] = [
        { field: "firstName", headerName: t("crmService.firstName"), flex: 1.5, headerAlign: "center" },
        { field: "lastName", headerName: t("crmService.lastName"), flex: 1.5, headerAlign: "center" },
        { field: "email", headerName: t("crmService.email"), flex: 1.5, headerAlign: "center" },
        { field: "phone", headerName: t("crmService.phone"), flex: 1.5, headerAlign: "center" },
        { field: "address", headerName: t("crmService.address"), flex: 1.5, headerAlign: "center" },
        { field: "status", headerName: t("crmService.status"), headerAlign: "center", flex: 1 },
    ]


    return (
        <div style={{ height: "auto"}}>

            <TextField
                label={t("crmService.searchbyname")}
                variant="outlined"
                onChange={(event) =>{setSearchText(event.target.value);} }
                value={searchText}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                fullWidth
                inputProps={{ maxLength: 50 }}
            />

            <DataGrid
                slots={{
                    toolbar: GridToolbar,
                }}
                rows={customers}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 1, pageSize: 5 },
                    }
                }}
                // getRowClassName={(params)=>
                //     params.row.isExpenditureApproved
                //         ? "approved-row"
                //         : "unapproved-row"
                // }
                pageSizeOptions={[5,10]}
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
                    // "& .approved-row": {
                    //     backgroundColor: "rgba(77, 148, 255,1)",
                        
                    // },
                    // "& .unapproved-row": {
                    //     backgroundColor: "rgba(242, 242, 242,1)",
                    // },
            
                }}
                rowSelectionModel={selectedRowIds}
            />




        </div>
    );  
}
export default CustomerPage;
