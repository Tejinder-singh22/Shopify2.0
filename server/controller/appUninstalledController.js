import updateAppStatus from "../Dao/updateAppStatus.js";
/**
 * Controller contains logic for Uninstallation of application (Webhook), hits on app uninstallation;
 * @param  [type] $currentShop       [string]
 * @return [type]                    [void]
 */
export default function appUninstalledController(currentShop) {
  if (currentShop != null) {
    updateAppStatus(currentShop);
  } else {
    console.log("Cant able to update status for undefined current shop");
  }
}
