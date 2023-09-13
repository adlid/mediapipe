import { RouteProps } from "react-router-dom";
import { CameraPage, MainPage } from "../../../components";

export enum AppRoutes {
  MAIN = "main",
  MEDIA_PIPE = "camera",
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.MEDIA_PIPE]: "/camera",
};

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
  },
  [AppRoutes.MEDIA_PIPE]: {
    path: RoutePath.camera,
    element: <CameraPage />,
  },
};
