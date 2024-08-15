import Login from "views/pages/Login.js";
import AssetRegister from "views/pages/AssetRegister";
import Inventory from "views/pages/Inventory.js";
import UserProfile from "views/pages/UserProfile.js";
import EoIPages from "views/pages/EoIPages";
import EoIPage from "views/pages/EoIPage";
import ExchangeRegister from "views/pages/ExchangeRegister";
import SubmissionEoI from "views/pages/SubmissionEoI";
import W0 from "views/pages/W0";
import W1 from "views/pages/W1";
import W2 from "views/pages/W2";
import W3 from "views/pages/W3";
import W4 from "views/pages/W4";
import W5 from "views/pages/W5";
import W6 from "views/pages/W6";
import W7 from "views/pages/W7";
import W8 from "views/pages/W8";
import W9 from "views/pages/W9";
import W10 from "views/pages/W10";
import W11 from "views/pages/W11";
import W12 from "views/pages/W12";
import W13 from "views/pages/W13";
import W14 from "views/pages/W14";
const routes = [
  {
    path: "/user-profile",
    pathName: "/admin/user-profile",
    name: "My Profile",
    component: <UserProfile />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },
  {
    path: "/assetregister/:id",
    pathName: "/admin/assetregister/:id",
    name: "Inventory | Item",
    component: <AssetRegister />,
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
    name: "Inventory | Item",
    component: <EoIPage />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    hidden: true,
  },
  {
    path: "/inventory",
    pathName: "/admin/inventory",
    name: "Inventory ",
    component: <Inventory/>,
    icon: "nc-icon nc-tile-56",
    layout: "/admin",

  },
  {
    path: "/exchange/register",
    pathName: "/admin/exchange/register/:id",
    name: "Exchange Register ",
    component: <ExchangeRegister/>,
    layout: "/admin",
    icon: "nc-icon nc-tile-56",
  },
  {
    path: "/exchange/eoisubmission/:id",
    pathName: "/admin/exchange/eoisubmission/:id",
    name: "EoI Submission ",
    component: <SubmissionEoI/>,
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
    icon: "nc-icon nc-book-bookmark",
  },

  {
    path: "/itemsrequests",
    pathName: "/admin/w1",
    name: "Item Requests",
    component: <W1 />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
  },
  {
    path: "/approvalsrequests",
    pathName: "/admin/w2",
    name: "Approval Requests",
    component: <W2 />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
  },

  {
    path: "/myeoi",
    pathName: "/admin/dashboard",
    name: "My EoI's",
    component: <W4 />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
  },
  {
    collapse: true,
    name: "WireFrame Pages",
    icon: "nc-icon nc-book-bookmark",
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
];

export default routes;
