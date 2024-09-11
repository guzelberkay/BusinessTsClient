//SUBJECT TO CHANGE
import { useEffect } from "react";
import {useTranslation} from "react-i18next";
import {AppDispatch} from "../store/index"
import {useDispatch} from "react-redux";
import { fetchFindAllOrder, fetchFindAllProduct, fetchFindAllProductCategory, fetchFindAllStockMovement, fetchFindAllSupplier, fetchFindAllWareHouse } from "../store/feature/stockSlice";
import { Container, Grid2, Typography, Button
 } from "@mui/material";
function HomePage() {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    //TO TEST DATAS WILL DELETE IT LATER
    useEffect(() => {
      dispatch(fetchFindAllOrder({page: 0, size: 10, searchText: ''})).then((res) => console.log(res.payload.data));
      dispatch(fetchFindAllProduct({page: 0, size: 10, searchText: ''})).then((res) => console.log(res.payload.data));
      dispatch(fetchFindAllProductCategory({page: 0, size: 10, searchText: ''})).then((res) => console.log(res.payload.data));
      dispatch(fetchFindAllWareHouse({page: 0, size: 10, searchText: ''})).then((res) => console.log(res.payload.data));
      dispatch(fetchFindAllSupplier({page: 0, size: 10, searchText: ''})).then((res) => console.log(res.payload.data));
      dispatch(fetchFindAllStockMovement({page: 0, size: 10, searchText: ''})).then((res) => console.log(res.payload.data));

     
    }, []);
  return (
        <Container sx={{height:"100vh",backgroundColor:"red"}}>
          <Grid2 container justifyContent="center">
            <Typography variant="h6">{t('greetings.welcome')} </Typography>
          </Grid2>
          <Grid2 container justifyContent="center">
            <Typography variant="h3">{t('greetings.test')} </Typography>
          </Grid2>
          <Grid2 container justifyContent="center">
            <Typography  variant="h3">
              <Button onClick={() => window.location.href = "http://localhost:3000/test"} variant="contained">test post-Auth</Button>
            </Typography>
          </Grid2>
        </Container>
  )
}

export default HomePage;
