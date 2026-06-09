/**
 * Application Configuration
 * 
 * To receive emails from the contact forms, you need a Web3Forms Access Key:
 * 1. Visit https://web3forms.com/
 * 2. Enter your email to instantly receive an Access Key (no account dashboard required).
 * 3. Either:
 *    a) Create a `.env` file in the root directory and add:
 *       VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here
 *    b) Or replace the fallback key below with your Access Key.
 */
export const config = {
  // If you don't use a .env file, replace the empty string below with your Web3Forms Access Key
  web3formsAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "e900f91f-1e33-46b5-bd93-0043b102ceff",
};
