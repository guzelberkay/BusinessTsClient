//SUBJECT TO CHANGE
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {AppDispatch} from "../store/index"
import {useDispatch} from "react-redux";
import {
    fetchFindAllProduct,
    fetchFindAllProductCategory,
    fetchFindAllStockMovement,
    fetchFindAllSupplier,
    fetchFindAllWareHouse
} from "../store/feature/stockSlice";
import {
    Container, Grid2, Typography, Button, Grid
} from "@mui/material";

function HomePage() {
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    //TO TEST DATAS WILL DELETE IT LATER
    useEffect(() => {
        dispatch(fetchFindAllProduct({page: 0, size: 10, searchText: ''})).then((res) => console.log(res.payload.data));
        dispatch(fetchFindAllProductCategory({
            page: 0,
            size: 10,
            searchText: ''
        })).then((res) => console.log(res.payload.data));
        dispatch(fetchFindAllWareHouse({
            page: 0,
            size: 10,
            searchText: ''
        })).then((res) => console.log(res.payload.data));
        dispatch(fetchFindAllSupplier({
            page: 0,
            size: 10,
            searchText: ''
        })).then((res) => console.log(res.payload.data));
        dispatch(fetchFindAllStockMovement({
            page: 0,
            size: 10,
            searchText: ''
        })).then((res) => console.log(res.payload.data));


    }, []);
    return (
        <Container  sx={{height: "100vh", backgroundColor: "red"}}>
            <Grid2 container justifyContent="center">
                <Typography variant="h6">{t('greetings.welcome')} </Typography>
            </Grid2>
            <Grid2 container justifyContent="center">
                <Typography variant="h3">{t('greetings.test')} </Typography>
            </Grid2>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/test"} variant="contained">test
                            post-Auth</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/product"} variant="contained">StockService -
                            Product Page</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/products-by-min-stock-level"} variant="contained">StockService -
                            Products By Min Stock Level Page</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/buy-orders"} variant="contained">StockService -
                           Buy Order Page</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/sell-orders"} variant="contained">StockService -
                            Sell Order Page</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/suppliers"} variant="contained">StockService -
                            Supplier Page</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/ware-houses"} variant="contained">StockService -
                            Ware House Page</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/product-categories"} variant="contained">StockService -
                            Product Categories Page</Button>
                    </Typography>
                </Grid>
                <Grid item xs={12}  sx={{textAlign: "center"}}>
                    <Typography variant="h3">
                        <Button onClick={() => window.location.href = "http://localhost:3000/stock-movements"} variant="contained">StockService -
                            Stock Movement Page</Button>
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

export default HomePage;
