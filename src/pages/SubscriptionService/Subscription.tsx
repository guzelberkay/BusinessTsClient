import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { AppDispatch, RootState } from '../../store';
import { fetchFindAllPlans, fetchSaveSubscription } from '../../store/feature/subscriptionSlice';
import { useTranslation } from 'react-i18next';
import { fetchUserRoles } from '../../store/feature/userSlice';

const Subscription: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const plans = useSelector((state: RootState) => state.subscription.planList);
  const userRoles = useSelector((state: RootState) => state.userSlice.userRoleList);

  useEffect(() => {
    dispatch(fetchFindAllPlans());
    dispatch(fetchUserRoles());
  }, [dispatch]);

  const handleSubscription = (planId: number) => {
    console.log(planId);
    dispatch(fetchSaveSubscription({ planId, subscriptionType: 'MONTHLY' }))
      .then(() => {
        dispatch(fetchUserRoles());
        dispatch(fetchFindAllPlans());
      });
  };

  const checkSubscriptions = (planName: string) => {
    return userRoles.includes(planName.toUpperCase());
  };

  return (
    <Grid container spacing={3} padding={3}>
      {plans.map((plan) => (
        <Grid item xs={12} sm={6} md={4} key={plan.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {t(`plans.name.${plan.name}`)}
              </Typography>
              <Typography variant="h6" color="text.primary" sx={{ marginTop: 2 }}>
                ${plan.price}/month
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                disabled={checkSubscriptions(plan.name)}
                onClick={() => handleSubscription(plan.id)}
              >
                {checkSubscriptions(plan.name) ? t('Subscribed') : t('Subscribe')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Subscription;
