import Login from "./views/pages/auth/Login";
// inventory or asset
import Inventory from "./views/pages/inventory/Index";
import InventoryCreate from "./views/pages/inventory/Create.jsx";
import InventoryShow from "./views/pages/inventory/Show.jsx";
import InventoryEdit from "./views/pages/inventory/Edit.jsx";

import AssetRegister from "views/pages/AssetRegister";
import UserProfile from "./views/pages/UserProfile.jsx";
import EoIPages from "./views/pages/EoIPages.jsx";
import EoIPage from "./views/pages/EoIPage.jsx";
import ExchangeRegister from "./views/pages/ExchangeRegister.jsx";
import SubmissionEoI from "./views/pages/SubmissionEoI.jsx";
import RequestEquipment from "./views/pages/RequestEquipment.jsx";
import MyEoI from "./views/pages/myeoi/Index";


import W0 from "./views/pages/wireframe/W0.jsx";
import W1 from "./views/pages/wireframe/W1.jsx";
import W2 from "./views/pages/wireframe/W2.jsx";
import W3 from "./views/pages/wireframe/W3.jsx";
import W4 from "./views/pages/wireframe/W4.jsx";
import W5 from "./views/pages/wireframe/W5.jsx";
import W6 from "./views/pages/wireframe/W6.jsx";
import W7 from "./views/pages/wireframe/W7.jsx";
import W8 from "./views/pages/wireframe/W8.jsx";
import W9 from "./views/pages/wireframe/W9.jsx";
import W10 from "./views/pages/wireframe/W10.jsx";
import W11 from "./views/pages/wireframe/W11.jsx";
import W12 from "./views/pages/wireframe/W12.jsx";
import W13 from "./views/pages/wireframe/W13.jsx";
import W14 from "./views/pages/wireframe/W14.jsx";

import { HiViewGridAdd } from "react-icons/hi";
import { FaCubesStacked, FaHand, FaCartFlatbedSuitcase } from "react-icons/fa6";
import { HiRectangleStack } from "react-icons/hi2";
import { BsMegaphoneFill } from "react-icons/bs";
import { GiWireframeGlobe } from "react-icons/gi";

import Register from "./views/pages/auth/Register";

const routes = [
  {
    path: "/user-profile",
    pathName: "/admin/user-profile",
    name: "My Profile",
    component: <UserProfile />,
    layout: "/admin",
    icon: <HiViewGridAdd />,
    hidden: true,
  },
  {
    path: "/inventory",
    pathName: "/admin/inventory",
    name: "Inventory ",
    component: <Inventory />,
    icon: <HiViewGridAdd size="2.5em" style={{ float: "left" }} />,
    layout: "/admin",
  },
  {
    path: "/inventory/create",
    pathName: "/admin/inventory/create",
    name: "Inventory | Item create",
    component: <InventoryCreate />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },

  {
    path: "/inventory/show/:id",
    pathName: "/admin/inventory/show/:id",
    name: "Inventory | Item Details",
    component: <InventoryShow />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },
  {
    path: "/inventory/edit/:id",
    pathName: "/admin/inventory/edit/:id",
    name: "Inventory | Item Edit",
    component: <InventoryEdit />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },
  {
    path: "/eoi/details/:assetId",
    pathName: "/admin/eoi/details/:assetId?mode=view",
    name: "All EOI | View EOI Detail",
    component: <EoIPage />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },
  {
    path: "/eoi/view/:id",
    pathName: "/admin/eoi/view/:id",
    name: "EoI",
    component: <EoIPage />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },

  {
    path: "/exchange/register",
    pathName: "/admin/exchange/register",
    name: "Exchange Register ",
    component: <ExchangeRegister />,
    layout: "/admin",
    icon: <FaCubesStacked size="2.5em" style={{ float: "left" }} />,
  },
  {
    path: "/exchange/requestequipment",
    pathName: "/admin/exchange/requestequipment",
    name: "RequestEquipment",
    component: <RequestEquipment />,
    layout: "/admin",
    icon: "nc-icon nc-tile-56",
    hidden: true,
  },
  {
    path: "/exchange/eoisubmission/:id",
    pathName: "/admin/exchange/eoisubmission/:id",
    name: "EoI Submission ",
    component: <SubmissionEoI />,
    layout: "/admin",
    icon: "nc-icon nc-tile-56",
    hidden: true,
  },

  {
    path: "/eoi/:id",
    pathName: "/admin/eois/:id",
    name: "Inventory | Item",
    component: <EoIPages />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },
  {
    path: "/assetregister",
    pathName: "/admin/assetregister",
    name: "Add New Item",
    component: <AssetRegister />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },

  {
    path: "/dashboard",
    pathName: "/admin/dashboard",
    name: "Bulk Import",
    component: <W0 />,
    layout: "/admin",
    icon: <HiRectangleStack size="2.5em" style={{ float: "left" }} />,
  },

  {
    path: "/itemsrequests",
    pathName: "/admin/w1",
    name: "Item Requests",
    component: <W1 />,
    layout: "/admin",
    icon: <BsMegaphoneFill size="2.5em" style={{ float: "left" }} />,
  },
  {
    path: "/approvalsrequests",
    pathName: "/admin/w2",
    name: "Approval Requests",
    component: <W2 />,
    layout: "/admin",
    icon: <FaHand size="2.5em" style={{ float: "left" }} />,
  },

  {
    path: "/myeoi",
    pathName: "/admin/myeoi",
    name: "My EoI's",
    component: <MyEoI />,
    layout: "/admin",
    icon: <FaCartFlatbedSuitcase size="2.5em" style={{ float: "left" }} />,
  },
  {
    collapse: true,
    name: "WireFrame Pages",
    icon: <GiWireframeGlobe size="2.5em" style={{ float: "left" }} />,
    state: "wireFramepagesCollapse",
    views: [
      {
        path: "/timeline",
        name: "W-0",
        mini: "T",
        component: <W0></W0>,
        layout: "/admin",
      },
      {
        path: "/w1",
        name: "W-1",
        mini: "W1",
        component: <W1></W1>,
        layout: "/admin",
      },
      {
        path: "/w2",
        name: "W-2",
        mini: "W2",
        component: <W2></W2>,
        layout: "/admin",
      },
      // Add components W3 to W14
      {
        path: "/w3",
        name: "W-3",
        mini: "W3",
        component: <W3></W3>,
        layout: "/admin",
      },
      {
        path: "/w4",
        name: "W-4",
        mini: "W4",
        component: <W4></W4>,
        layout: "/admin",
      },
      {
        path: "/w5",
        name: "W-5",
        mini: "W5",
        component: <W5></W5>,
        layout: "/admin",
      },
      // Add components W6 to W14
      {
        path: "/w6",
        name: "W-6",
        mini: "W6",
        component: <W6></W6>,
        layout: "/admin",
      },
      {
        path: "/w7",
        name: "W-7",
        mini: "W7",
        component: <W7></W7>,
        layout: "/admin",
      },
      // Continue adding components W8 to W14
      {
        path: "/w8",
        name: "W-8",
        mini: "W8",
        component: <W8></W8>,
        layout: "/admin",
      },
      {
        path: "/w9",
        name: "W-9",
        mini: "W9",
        component: <W9></W9>,
        layout: "/admin",
      },
      {
        path: "/w10",
        name: "W-10",
        mini: "W10",
        component: <W10></W10>,
        layout: "/admin",
      },
      {
        path: "/w11",
        name: "W-11",
        mini: "W11",
        component: <W11></W11>,
        layout: "/admin",
      },
      {
        path: "/w12",
        name: "W-12",
        mini: "W12",
        component: <W12></W12>,
        layout: "/admin",
      },
      {
        path: "/w13",
        name: "W-13",
        mini: "W13",
        component: <W13></W13>,
        layout: "/admin",
      },
      {
        path: "/w14",
        name: "W-14",
        mini: "W14",
        component: <W14></W14>,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/login",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    component: <Register />,
    layout: "/auth",
  },
];

export default routes;
