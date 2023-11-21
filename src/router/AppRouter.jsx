import { Route, Routes } from "react-router-native";
import routes from "./routes";
import Init from "../pages/Init";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Historial from "../pages/Historial";
import Map from "../pages/Map";
import Account from "../pages/Account";
import Camera from "../pages/Camera";
import Security from "../pages/Security";
import QRToScan from "../pages/QRToScan";
import ChoseEnterprise from "../pages/ChoseEnterprise";

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path={routes.init} element={<Init />} />
      <Route exact path={routes.login} element={<Login />} />
      <Route exact path={routes.home} element={<Home />} />
      <Route exact path={routes.historial} element={<Historial />} />
      <Route exact path={routes.map} element={<Map />} />
      <Route exact path={routes.account} element={<Account />} />
      <Route exact path={routes.camera} element={<Camera />} />
      <Route exact path={routes.security} element={<Security />} />
      <Route exact path={routes.qr} element={<QRToScan />} />
      <Route exact path={routes.chooseEnterprise} element={<ChoseEnterprise />} />
    </Routes>
  );
};

export default AppRouter;
