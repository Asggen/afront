import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import auth from "../Api/login.service";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await auth.getCurrentUser();
        if (mounted && res?.data?.user) setStatus("authed");
        else if (mounted) setStatus("unauth");
      } catch (e) {
        if (mounted) setStatus("unauth");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") return null;
  if (status === "unauth")
    return <Navigate to="/login" state={{ from: location }} replace />;
  // If children are provided, render them; otherwise render nested routes via Outlet
  return children ? children : <Outlet />;
}