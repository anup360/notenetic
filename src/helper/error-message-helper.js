import { NotificationManager } from "react-notifications";

export const renderErrors = (error) => {
   return NotificationManager.error(error, "", "1000000", () => {});
}