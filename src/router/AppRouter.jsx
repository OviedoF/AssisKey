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
import PersonalData from "../pages/PersonalData";
import Configuration from "../pages/Configuration";
import Operar from "../pages/Operar";
import Incidencias from "../pages/incidencias/Incidencias";
import Crear from "../pages/incidencias/Crear";
import Terms from "../pages/Terms";
import Recovery from "../pages/Recovery";
import TakeSelfie from "../pages/TakeSelfie";

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
      <Route exact path={routes.personalData} element={<PersonalData />} />
      <Route exact path={routes.configuration} element={<Configuration />} />
      <Route exact path={routes.operar} element={<Operar />} />
      <Route exact path={routes.incidencias} element={<Incidencias />} />
      <Route exact path={routes.crearIncidencia} element={<Crear />} />
      <Route exact path={routes.terms} element={<Terms />} />
      <Route exact path={routes.recovery} element={<Recovery />} />
      <Route exact path={routes.takeSelfie} element={<TakeSelfie />} />
    </Routes>
  );
};

export default AppRouter;
