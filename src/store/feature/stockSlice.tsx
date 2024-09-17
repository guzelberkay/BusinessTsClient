import RestApis from "../../config/RestApis";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {IProductCategory} from "../../model/IProductCategory";
import {IResponse} from "../../model/IResponse";
import {IOrder} from "../../model/IOrder";
import {IProduct} from "../../model/IProduct";
import {IStockMovement} from "../../model/IStockMovement";
import {ISupplier} from "../../model/ISupplier";
import {IWareHouse} from "../../model/IWareHouse";



interface IStockState  {
    productCategoryList:IProductCategory[]
    orderList:IOrder[]
    productList:IProduct[]
    stockMovementList:IStockMovement[]
    supplierList:ISupplier[]
    wareHouseList:IWareHouse[]
}

const initialStockState:IStockState = {
    productCategoryList: [],
    orderList:[],
    productList:[],
    stockMovementList:[],
    supplierList:[],
    wareHouseList:[]

}


interface IfetchSaveProductCategory{
    name:string ;
}


//#region Product Category
export const fetchSaveProductCategory = createAsyncThunk(
    'stock/fetchSaveProductCategory',
    async (payload:IfetchSaveProductCategory) => {
        const usersName = { name: payload.name };

        const result = await axios.post(
            RestApis.stock_service_product_category+"/save",
            usersName,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchDeleteProductCategory = createAsyncThunk(
    'stock/fetchDeleteProductCategory',
    async (id:number) => {

        const result = await axios.delete(
            RestApis.stock_service_product_category+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);


interface IfetchUpdateProductCategory{
    id:number;
    name:string ;
}
export const fetchUpdateProductCategory = createAsyncThunk(
    'stock/fetchUpdateProductCategory',
    async (payload:IfetchUpdateProductCategory) => {
        const values = { id: payload.id,name: payload.name };

        const result = await axios.put(
            RestApis.stock_service_product_category+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllProductCategory{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllProductCategory = createAsyncThunk(
    'stock/fetchFindAllProductCategory',
    async (payload:IfetchFindAllProductCategory) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_product_category+"/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchFindByIdProductCategory = createAsyncThunk(
    'stock/fetchFindByIdProductCategory',
    async (id:number) => {
     

        const result = await axios.post(
            RestApis.stock_service_product_category+"/find-by-id?id="+id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

//#endregion Product Category

//#region Order
interface IfetchSaveSellOrder{
    customerId:number;
    productId:number;
    quantity:number;
}

export const fetchSaveSellOrder = createAsyncThunk(
    'stock/fetchSaveSellOrder',
    async (payload:IfetchSaveSellOrder) => {
        const values = { customerId: payload.customerId,productId: payload.productId,quantity: payload.quantity };

        const result = await axios.post(
            RestApis.stock_service_order+"/save-sell-order",
            values,
            {
                headers: {
                    "Content-Type": "application/json",
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchBuySellOrder{
    supplierId:number;
    productId:number;
    quantity:number;
}

export const fetchBuySellOrder = createAsyncThunk(
    'stock/fetchBuySellOrder',
    async (payload:IfetchBuySellOrder) => {
        const values = {supplierId: payload.supplierId,productId: payload.productId,quantity: payload.quantity };

        const result = await axios.post(
            RestApis.stock_service_order+"/save-buy-order",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchDeleteOrder = createAsyncThunk(
    'stock/fetchDeleteOrder',
    async (id:number) => {

        const result = await axios.delete(
            RestApis.stock_service_order+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);


interface IfetchUpdateOrder{
    id:number;
    quantity:number;
}
export const fetchUpdateOrder = createAsyncThunk(
    'stock/fetchUpdateOrder',
    async (payload:IfetchUpdateOrder) => {
        const values = { id: payload.id,quantity: payload.quantity };

        const result = await axios.put(
            RestApis.stock_service_order+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllOrder{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllBuyOrder = createAsyncThunk(
    'stock/fetchFindAllBuyOrder',
    async (payload:IfetchFindAllOrder) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_order+"/find-all-buy-orders",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllOrder{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllSellOrder = createAsyncThunk(
    'stock/fetchFindAllBuyOrder',
    async (payload:IfetchFindAllOrder) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_order+"/find-all-sell-orders",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchFindByIdOrder = createAsyncThunk(
    'stock/fetchFindByIdOrder',
    async (id:number) => {
     

        const result = await axios.post(
            RestApis.stock_service_order+"/find-by-id?id="+id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

//#endregion

//#region Product
interface IfetchSaveProduct{
    supplierId:number;
    wareHouseId:number;
    productCategoryId:number;
    name:string;
    description:string;
    price:number;
    stockCount:number;
    minimumStockLevel:number;
}

export const fetchSaveProduct = createAsyncThunk(
    'stock/fetchSaveProduct',
    async (payload:IfetchSaveProduct) => {
        const values = {   supplierId: payload.supplierId,wareHouseId: payload.wareHouseId,productCategoryId: payload.productCategoryId,name: payload.name,description: payload.description,price: payload.price,stockCount: payload.stockCount,minimumStockLevel: payload.minimumStockLevel };

        const result = await axios.post(
            RestApis.stock_service_product+"/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchDeleteProduct = createAsyncThunk(
    'stock/fetchDeleteProduct',
    async (id:number) => {

        const result = await axios.delete(
            RestApis.stock_service_product+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchUpdateProduct{
    id:number;
    productCategoryId:number;
    name:string;
    description:string;
    price:number;
    stockCount:number;
    minimumStockLevel:number;
}
export const fetchUpdateProduct = createAsyncThunk(
    'stock/fetchUpdateProduct',
    async (payload:IfetchUpdateProduct) => {
        const values = {   id: payload.id,productCategoryId: payload.productCategoryId,name: payload.name,description: payload.description,price: payload.price,stockCount: payload.stockCount,minimumStockLevel: payload.minimumStockLevel };

        const result = await axios.put(
            RestApis.stock_service_product+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllProduct{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllProduct = createAsyncThunk(
    'stock/fetchFindAllProduct',
    async (payload:IfetchFindAllProduct) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_product+"/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllByMinimumStockLevel{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllByMinimumStockLevel = createAsyncThunk(
    'stock/fetchFindAllByMinimumStockLevel',
    async (payload:IfetchFindAllByMinimumStockLevel) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_product+"/find-all-by-minimum-stock-level",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);


export const fetchFindByIdProduct = createAsyncThunk(
    'stock/fetchFindByIdProduct',
    async (id:number) => {
     

        const result = await axios.post(
            RestApis.stock_service_product+"/find-by-id?id="+id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchChangeAutoOrderModeOfProduct = createAsyncThunk(
    'stock/fetchChangeAutoOrderModeOfProduct',
    async (id:number) => {


        const result = await axios.post(
            RestApis.stock_service_product+"/change-auto-order-mode/"+id,
            "null",
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);
//#endregion

//#region Stock Movement

interface IfetchSaveStockMovement{
    productId:number;
    warehouseId:number;
    quantity:number;
    stockMovementType:string;
}

export const fetchSaveStockMovement = createAsyncThunk(
    'stock/fetchSaveStockMovement',
    async (payload:IfetchSaveStockMovement) => {
        const values = { productId: payload.productId,warehouseId: payload.warehouseId,quantity: payload.quantity,stockMovementType: payload.stockMovementType };

        const result = await axios.post(
            RestApis.stock_service_stock_movement+"/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchDeleteStockMovement = createAsyncThunk(
    'stock/fetchDeleteStockMovement',
    async (id:number) => {

        const result = await axios.delete(
            RestApis.stock_service_stock_movement+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchUpdateStockMovement{
    id:number;
    productId:number;
    warehouseId:number;
    quantity:number;
    stockMovementType:string;
}
export const fetchUpdateStockMovement = createAsyncThunk(
    'stock/fetchUpdateStockMovement',
    async (payload:IfetchUpdateStockMovement) => {
        const values = {   id: payload.id,productId: payload.productId,warehouseId: payload.warehouseId,quantity: payload.quantity,stockMovementType: payload.stockMovementType };

        const result = await axios.put(
            RestApis.stock_service_stock_movement+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllStockMovement{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllStockMovement = createAsyncThunk(
    'stock/fetchFindAllStockMovement',
    async (payload:IfetchFindAllStockMovement) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_stock_movement+"/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchFindByIdStockMovement = createAsyncThunk(
    'stock/fetchFindByIdStockMovement',
    async (id:number) => {
     

        const result = await axios.post(
            RestApis.stock_service_stock_movement+"/find-by-id?id="+id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);


//#endregion

//#region Supplier

interface IfetchSaveSupplier{
    name:string;
    contanctInfo:string;
    address:string;
    notes:string;
}

export const fetchSaveSupplier = createAsyncThunk(
    'stock/fetchSaveSupplier',
    async (payload:IfetchSaveSupplier) => {
        const values = { name: payload.name,contanctInfo: payload.contanctInfo,address: payload.address,notes: payload.notes };

        const result = await axios.post(
            RestApis.stock_service_supplier+"/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchDeleteSupplier = createAsyncThunk(
    'stock/fetchDeleteSupplier',
    async (id:number) => {

        const result = await axios.delete(
            RestApis.stock_service_supplier+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchUpdateSupplier{
    id:number;
    name:string;
    contanctInfo:string;
    address:string;
    notes:string;
}
export const fetchUpdateSupplier = createAsyncThunk(
    'stock/fetchUpdateSupplier',
    async (payload:IfetchUpdateSupplier) => {
        const values = {   id: payload.id,name: payload.name,contanctInfo: payload.contanctInfo,address: payload.address,notes: payload.notes };

        const result = await axios.put(
            RestApis.stock_service_supplier+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllSupplier{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllSupplier = createAsyncThunk(
    'stock/fetchFindAllSupplier',
    async (payload:IfetchFindAllSupplier) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_supplier+"/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchFindByIdSupplier = createAsyncThunk(
    'stock/fetchFindByIdSupplier',
    async (id:number) => {
     

        const result = await axios.post(
            RestApis.stock_service_supplier+"/find-by-id?id="+id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchApproveOrder = createAsyncThunk(
    'stock/fetchApproveOrder',
    async (id:number) => {


        const result = await axios.post(
            RestApis.stock_service_supplier+"/approve-order?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);
//#endregion

//#region Ware House
interface IfetchSaveWareHouse{
    name:string;
    location:string;
}

export const fetchSaveWareHouse = createAsyncThunk(
    'stock/fetchSaveWareHouse',
    async (payload:IfetchSaveWareHouse) => {
        const values = { name: payload.name,location: payload.location };

        const result = await axios.post(
            RestApis.stock_service_ware_house+"/save",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchDeleteWareHouse = createAsyncThunk(
    'stock/fetchDeleteWareHouse',
    async (id:number) => {

        const result = await axios.delete(
            RestApis.stock_service_ware_house+"/delete?id="+id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchUpdateWareHouse{
    id:number;
    name:string;
    location:string;
}
export const fetchUpdateWareHouse = createAsyncThunk(
    'stock/fetchUpdateWareHouse',
    async (payload:IfetchUpdateWareHouse) => {
        const values = {   id: payload.id,name: payload.name,location: payload.location };

        const result = await axios.put(
            RestApis.stock_service_ware_house+"/update",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

interface IfetchFindAllWareHouse{

    searchText:string;
    page:number;
    size:number;
}
export const fetchFindAllWareHouse = createAsyncThunk(
    'stock/fetchFindAllWareHouse',
    async (payload:IfetchFindAllWareHouse) => {
        const values = { searchText: payload.searchText,page: payload.page,size: payload.size };

        const result = await axios.post(
            RestApis.stock_service_ware_house+"/find-all",
            values,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);

export const fetchFindByIdWareHouse = createAsyncThunk(
    'stock/fetchFindByIdWareHouse',
    async (id:number) => {
     

        const result = await axios.post(
            RestApis.stock_service_ware_house+"/find-by-id?id="+id,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${payload.token}` // Token eklemek gerekiyorsa
                }
            }
        );
        return result.data;

    }
);
//#endregion

const stockSlice = createSlice({
    name: 'stock',
    initialState: initialStockState,
    reducers: {closeModal: () => {

        },},
    extraReducers: (build)=>{
        build.addCase(fetchFindAllProductCategory.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.productCategoryList = action.payload.data;
        });
        build.addCase(fetchFindAllProduct.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.productList = action.payload.data;
        });
        build.addCase(fetchFindAllStockMovement.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.stockMovementList = action.payload.data;
        });
        build.addCase(fetchFindAllSupplier.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.supplierList = action.payload.data;
        });
        build.addCase(fetchFindAllWareHouse.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.wareHouseList = action.payload.data;
        });

    }
});




export default stockSlice.reducer;
export const {} = stockSlice.actions