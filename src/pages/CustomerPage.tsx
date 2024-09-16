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
import { AppDispatch, useAppSelector } from "../store";

import {fetchFindAllCustomer, fetchfindByNameCustomer} from "../store/feature/crmSlice.tsx";
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

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('');

    const {t} = useTranslation()

    useEffect(() => {
        dispatch(fetchFindAllCustomer({
            page: 0,
            size: 100,
            searchText: searchText,
        }));
    }, [dispatch, searchText, loading, isActivating]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }

    const handleSearchByName = async () => {
        const result = await dispatch(fetchfindByNameCustomer({
            firstName
        }));
        console.log(result);
        // dispatch(fetchfindByNameCustomer({
        //     firstName: firstName
        // }));
    }

    const handleSomething = () => {
        console.log(selectedRowIds);
    };

    const columns: GridColDef[] = [
        { field: "firstName", headerName: "Ad", flex: 1.5, headerAlign: "center" },
        { field: "lastName", headerName: "Soyad", flex: 1.5, headerAlign: "center" },
        { field: "email", headerName: "Email", flex: 1.5, headerAlign: "center" },
        { field: "phone", headerName: "Telefon", flex: 1.5, headerAlign: "center" },
        { field: "address", headerName: "Adres", flex: 1.5, headerAlign: "center" },
        { field: "status", headerName: "Durum", headerAlign: "center", flex: 1 },
    ]


    return (
        <div style={{ height: "auto"}}>

            <TextField
                label="Ad"
                variant="outlined"
                onChange={(event) =>{setSearchText(event.target.value); handleSearchByName()} }
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
