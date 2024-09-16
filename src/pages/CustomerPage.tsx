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

import {fetchFindAllCustomer} from "../store/feature/crmSlice.tsx";



const columns: GridColDef[] = [
    { field: "firstName", headerName: "Name", flex: 1.5, headerAlign: "center" },
    { field: "lastName", headerName: "LastName", flex: 1.5, headerAlign: "center" },
    { field: "email", headerName: "Email", flex: 1.5, headerAlign: "center" },
    { field: "phone", headerName: "Phone", flex: 1.5, headerAlign: "center" },
    { field: "address", headerName: "Address", flex: 1.5, headerAlign: "center" },
    { field: "status", headerName: "Status", headerAlign: "center", flex: 1 },
]

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

    const handleSomething = () => {
        console.log(selectedRowIds);
    };


    return (
        <div style={{ height: "auto", width: "inherit" }}>

            <TextField
                fullWidth
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: "1%", marginTop: "1%" }}
                variant="outlined"
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
                getRowClassName={(params)=>
                    params.row.isExpenditureApproved
                        ? "approved-row"
                        : "unapproved-row"
                }
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
                    "& .approved-row": {
                        backgroundColor: "rgba(77, 148, 255,1)",
                        
                    },
                    "& .unapproved-row": {
                        backgroundColor: "rgba(242, 242, 242,1)",
                    },
            
                }}
                rowSelectionModel={selectedRowIds}
            />




        </div>
    );  
}
export default CustomerPage;
