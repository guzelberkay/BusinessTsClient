import { Suspense, useEffect } from "react";
import { useDispatch } from 'react-redux';
import Router from "./routes/Router";
import './util/i18n';
import { useScrollToTop } from "./hooks/use-scroll-to-top";
import Loader from "./components/atoms/loader/Loader";
import { useLocation } from "react-router-dom";
import { AppDispatch } from './store';
import { fetchCheckSubscription } from './store/feature/subscriptionSlice';
import { fetchUserRoles } from './store/feature/userSlice';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  /**
   * Fetches the user's subscription status and all the user's roles.
   * This is called whenever the location changes (i.e. when the user navigates to a different page),
   * to ensure that the user's data is always up-to-date.
   */
  const fetchData = () => {
    dispatch(fetchCheckSubscription());
    dispatch(fetchUserRoles());
  }

  useEffect(() => {
    fetchData();
  }, [location]);

  useScrollToTop();
  return (
    <Suspense fallback={<Loader />}>
      <Router />
    </Suspense>
  );
};

export default App;
