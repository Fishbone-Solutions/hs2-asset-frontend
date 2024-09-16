import Login from "./views/pages/auth/Login";
// inventory or asset
import Inventory from "./views/pages/inventory/Index";
import InventoryCreate from "./views/pages/inventory/Create.jsx";
import InventoryShow from "./views/pages/inventory/Show.jsx";
import InventoryEdit from "./views/pages/inventory/Edit.jsx";

//inventory eoi
import InventoryEoi from "./views/pages/inventory/eoi/Index";
import InventoryEoiDetails from "./views/pages/inventory/eoi/Show";
import InventoryEoiEdit from "./views/pages/inventory/eoi/Edit";

//exchange

import Exchange from "./views/pages/exchange/Index";
import ExchangeShow from "./views/pages/exchange/Show";
import ExchangeEoiCreate from "./views/pages/exchange/eoi/Create";

import UserProfile from "./views/pages/UserProfile.jsx";
// import EoIPage from "./views/pages/EoIPage.jsx";
import RequestEquipment from "./views/pages/RequestEquipment.jsx";

// myeoi
import MyEoI from "./views/pages/myeoi/Index";
import MyEoIShow from "./views/pages/myeoi/Show.jsx";
import MyEoIEdit from "./views/pages/myeoi/Edit.jsx";

//approval
import Approval from "./views/pages/approval/Index";
import ApprovalShow from "./views/pages/approval/Show";

// import Bulk Imports
import BulkImport from "views/pages/BulkImport";

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
import Breadcrumb from "components/Common/Breadcrumb";
import breadcrumbConfig from "variables/breadcrumbsConfig";
import { CgProfile } from "react-icons/cg";

const routes = [
  {
    path: "/user-profile",
    pathName: "/admin/user-profile",
    name: "My Profile",
    component: <UserProfile />,
    layout: "/admin",
    icon: <CgProfile />,
    breadcrumbIcon: (
      <CgProfile size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.profile} />,
    hidden: true,
  },
  {
    path: "/inventory",
    pathName: "/admin/inventory",
    name: "Inventory",
    component: <Inventory />,
    icon: <HiViewGridAdd size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <HiViewGridAdd size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.inventory} />,
    layout: "/admin",
  },
  {
    path: "/inventory/create",
    pathName: "/admin/inventory/create",
    name: "Inventory | Item create",
    component: <InventoryCreate />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    breadcrumbIcon: (
      <HiViewGridAdd size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: (
      <Breadcrumb items={breadcrumbConfig.inventoryCreate} />
    ),
    hidden: true,
  },

  {
    path: "/inventory/show/:id",
    pathName: "/admin/inventory/show/:id",
    name: "Inventory | Item Details",
    component: <InventoryShow />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    breadcrumbIcon: (
      <HiViewGridAdd size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.inventoryShow} />,
    hidden: true,
  },
  {
    path: "/inventory/edit/:id",
    pathName: "/admin/inventory/edit/:id",
    name: "Inventory | Item Edit",
    component: <InventoryEdit />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    breadcrumbIcon: (
      <HiViewGridAdd size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.inventoryEdit} />,
    hidden: true,
  },

  {
    path: "/eois/inventory/:id",
    pathName: "/admin/eois/inventory/:id",
    name: "Inventory | Item",
    component: <InventoryEoi />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    breadcrumbIcon: (
      <HiViewGridAdd size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.inventoryEoi} />,
    hidden: true,
  },
  {
    path: "/inventory/:inventoryId/eois/show/:eoiId",
    pathName: "/admin/inventory/:inventoryId/eois/show/:eoiId",
    name: "Inventory | EOI | Details",
    component: <InventoryEoiDetails />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    breadcrumbIcon: (
      <HiViewGridAdd size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: ({ match }) => {
      const { inventoryId } = match.dynamicParams;
      return (
        <Breadcrumb items={breadcrumbConfig.inventoryEoiDetails(inventoryId)} />
      );
    },
    hidden: true,
  },
  {
    path: "/inventory/:inventoryId/eois/edit/:eoiId",
    pathName: "/admin/inventory/:inventoryId/eois/edit/:eoiId",
    name: "Inventory | EOI | Edit",
    component: <InventoryEoiEdit />,
    layout: "/admin",
    icon: "nc-icon nc-book-bookmark",
    breadcrumbIcon: (
      <HiViewGridAdd size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: ({ match }) => {
      const { inventoryId } = match.dynamicParams;
      return (
        <Breadcrumb items={breadcrumbConfig.inventoryEoiEdit(inventoryId)} />
      );
    },
    hidden: true,
  },

  {
    path: "/exchange",
    pathName: "/admin/exchange",
    name: "Exchange Register ",
    component: <Exchange />,
    layout: "/admin",
    icon: <FaCubesStacked size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <FaCubesStacked size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.exchange} />,
  },
  {
    path: "/exchange/show/:id",
    pathName: "/admin/exchange/show/:id",
    name: "Exchange Register ",
    component: <ExchangeShow />,
    layout: "/admin",
    icon: <FaCubesStacked size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <FaCubesStacked size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.exchangeShow} />,
    hidden: true,
  },
  {
    path: "/exchange/eoi-submission/:id",
    pathName: "/admin/exchange/eoi-submission/:id",
    name: "EoI Submission ",
    component: <ExchangeEoiCreate />,
    layout: "/admin",
    icon: "nc-icon nc-tile-56",
    breadcrumbIcon: (
      <FaCubesStacked size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: (
      <Breadcrumb items={breadcrumbConfig.exchangeEoiSubmission} />
    ),
    hidden: true,
  },

  {
    path: "/exchange/requestequipment",
    pathName: "/admin/exchange/requestequipment",
    name: "RequestEquipment",
    component: <RequestEquipment />,
    layout: "/admin",
    icon: "nc-icon nc-tile-56",
    breadcrumbIcon: (
      <FaCubesStacked size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: (
      <Breadcrumb items={breadcrumbConfig.exchangeRequestEquipment} />
    ),
    hidden: true,
  },
  {
    path: "/bulkimport",
    pathName: "/admin/bulkimport",
    name: "Bulk Import",
    component: <BulkImport />,
    layout: "/admin",
    icon: <HiRectangleStack size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <HiRectangleStack size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.bulkImport} />,
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
    path: "/approvals/requests",
    pathName: "/admin/approvals/requests",
    name: "Approval Requests",
    component: <Approval />,
    layout: "/admin",
    icon: <FaHand size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <FaHand size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: (
      <Breadcrumb items={breadcrumbConfig.approvalRequests} />
    ),
  },
  {
    path: "/approval/request/show/:eoiId/:inventoryId/:requestId",
    pathName: "/admin/approval/request/show/:eoiId/:inventoryId/:requestId",
    name: "View Details",
    component: <ApprovalShow />,
    layout: "/admin",
    icon: <FaHand size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <FaHand size="2em" color="white" style={{ float: "left" }} />
    ),
    breadcrumbComponent: (
      <Breadcrumb items={breadcrumbConfig.showApprovalRequests} />
    ),
    hidden: true,
  },
  {
    path: "/myeoi",
    pathName: "/admin/myeoi",
    name: "My EoI",
    component: <MyEoI />,
    layout: "/admin",
    icon: <FaCartFlatbedSuitcase size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <FaCartFlatbedSuitcase
        size="2em"
        color="white"
        style={{ float: "left" }}
      />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.myEoi} />,
  },
  {
    path: "/myeoi/:inventoryId/show/:eoiId",
    pathName: "/admin/myeoi/:inventoryId/show/:eoiId",
    name: "My EoI | View EoI ",
    component: <MyEoIShow />,
    layout: "/admin",
    icon: <FaCartFlatbedSuitcase size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <FaCartFlatbedSuitcase
        size="2em"
        color="white"
        style={{ float: "left" }}
      />
    ),
    breadcrumbComponent: ({ match }) => {
      const { inventoryId } = match.dynamicParams;
      const { eoiId } = match.dynamicParams;
      return (
        <Breadcrumb items={breadcrumbConfig.myEoiShow(inventoryId, eoiId)} />
      );
    },
    hidden: true,
  },
  {
    path: "/myeoi/:inventoryId/eois/edit/:eoiId",
    pathName: "/admin/myeoi/:inventoryId/eois/edit/:eoiId",
    name: "My EoI | Item Edit",
    component: <MyEoIEdit />,
    layout: "/admin",
    icon: <FaCartFlatbedSuitcase size="2.5em" style={{ float: "left" }} />,
    breadcrumbIcon: (
      <FaCartFlatbedSuitcase
        size="2em"
        color="white"
        style={{ float: "left" }}
      />
    ),
    breadcrumbComponent: <Breadcrumb items={breadcrumbConfig.myEoiEdit} />,
    hidden: true,
  },

  {
    hidden: true,
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
