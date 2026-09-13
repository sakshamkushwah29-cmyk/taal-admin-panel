

export const ROUTE_PATH = {
  AUTH: {
    LOGIN: "/",
    FORGOT_PASSWORD: "/forget-password",
    RESET_PASSWORD: "/reset-password/:resetToken",
    PROFILE: "/profile",
  },
  ADMIN: {
    DASHBOARD: "/admin", 
    ORDERS: "/admin/orders",
    SETTING: "/admin/settings",
    USERS: "/admin/users",
    SPECIAL_OFFERS: "/admin/special-offers",
    NOTIFICATIONS: "/admin/notifications",
  },
  EVENT_MANAGER: {
    DASHBOARD: "/event-manager",
    ORDERS: "/event-manager/orders",
    SETTING: "/event-manager/settings",
    USERS: "/event-manager/users",
    SPECIAL_OFFERS: "/event-manager/special-offers",
    NOTIFICATIONS: "/event-manager/notifications",
  },
  GATEKEEPER: {
    DASHBOARD: "/gatekeeper",
    ORDERS: "/gatekeeper/orders",
    SETTING: "/gatekeeper/settings",
    USERS: "/gatekeeper/users",
    SPECIAL_OFFERS: "/gatekeeper/special-offers",
    NOTIFICATIONS: "/gatekeeper/notifications",
  },
};

export default ROUTE_PATH;
