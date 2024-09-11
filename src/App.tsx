import { Suspense } from "react";
import Router from "./routes/Router";
import './util/i18n';
import { useScrollToTop } from "./hooks/use-scroll-to-top";
import  Loader  from "./components/atoms/loader/Loader";

const App = () => {
  useScrollToTop();
  return (
    <Suspense fallback={<Loader />}>
      <Router />
    </Suspense>
  );
};

export default App;
