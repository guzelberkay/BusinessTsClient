import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import RestApis from "../../config/RestApis";

interface IFile {
    uuid: string;
    extension: string; 
}
  
interface IFileState {
    files: IFile[];
    isLoading: boolean;
    error: string | null;
}
  
const initialFileState: IFileState = {
    files: [],
    isLoading: false,
    error: null,
};
  
export const EContentType = {
    IMAGE_JPEG: { mimeType: "image/jpeg", extension: "jpg" },
    IMAGE_PNG: { mimeType: "image/png", extension: "png" },
    APPLICATION_PDF: { mimeType: "application/pdf", extension: "pdf" },
    EXCEL_XLSX: { mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extension: "xlsx" }
};


const getExtensionByMimeType = (mimeType: string): string => {
    switch (mimeType) {
        case EContentType.IMAGE_JPEG.mimeType:
            return EContentType.IMAGE_JPEG.extension;
        case EContentType.IMAGE_PNG.mimeType:
            return EContentType.IMAGE_PNG.extension;
        case EContentType.APPLICATION_PDF.mimeType:
            return EContentType.APPLICATION_PDF.extension;
        case EContentType.EXCEL_XLSX.mimeType:
            return EContentType.EXCEL_XLSX.extension;
        default:
            return ''; 
    }
    
};

export const uploadFile = createAsyncThunk(
    'files/uploadFile',
    async (file: File, { rejectWithValue }) => {
        const formData = new FormData();
        const mimeType = file.type; // MIME türünü al
        const extension = getExtensionByMimeType(mimeType);

        
        formData.append('file', file);
        formData.append('contentType', mimeType);
        formData.append('token', localStorage.getItem('token') || '');

        try {
            const response = await axios.post(`${RestApis.file_service}/save`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
            });
            return { uuid: response.data.data.uuid, extension }; 
        } catch (error) {
            return rejectWithValue('Dosya yüklenirken bir hata oluştu.');
        }
    }
);


export const deleteFile = createAsyncThunk(
    'files/deleteFile',
    async ({ uuid, bucketName }: { uuid: string; bucketName: string }, { rejectWithValue }) => {
        try {
       
            const response = await axios.delete(`${RestApis.file_service}/delete`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                data: {
                    uuid,
                    bucketName
                },
            });

            return response.data.data; 
        } catch (error) {
            return rejectWithValue('Dosya silinirken bir hata oluştu.');
        }
    }
);



export const updateFile = createAsyncThunk(
    'files/updateFile',
    async ({ uuid, file, contentType }: { uuid: string; file: File; contentType: string }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('uuid', uuid); 
            formData.append('file', file); 
            formData.append('contentType', contentType); 

            const response = await axios.post(`${RestApis.file_service}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            const mimeType = response.data.data.mimeType;
            const extension = getExtensionByMimeType(mimeType); 
            return { uuid, extension }; 
        } catch (error) {
            return rejectWithValue('Dosya güncellenirken bir hata oluştu.');
        }
    }
);



export const fetchFile = createAsyncThunk(
    'files/fetchFile',
    async (uuid: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${RestApis.file_service}/get/${uuid}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                responseType: 'blob', 
            });
            return response.data; 
        } catch (error) {
            return rejectWithValue( 'Dosya alınırken bir hata oluştu.');
        }
    }
);




const fileSlice = createSlice({
    name: 'files',
    initialState: initialFileState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files.push({ uuid: action.payload.uuid, extension: action.payload.extension }); 
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files = state.files.filter(file => file.uuid !== action.payload);
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string; 
            })
            .addCase(updateFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateFile.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.files.findIndex(file => file.uuid === action.payload.uuid);
                if (index !== -1) {
                    state.files[index].extension = action.payload.extension; 
                }
            })
            .addCase(updateFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string; 
            })
            .addCase(fetchFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFile.fulfilled, (state, action) => {
                state.isLoading = false;
               
            })
            .addCase(fetchFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string; 
            });
    },
});


export const { resetError } = fileSlice.actions;
export default fileSlice.reducer;
