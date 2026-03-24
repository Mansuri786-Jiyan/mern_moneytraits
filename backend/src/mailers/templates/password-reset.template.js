export const getPasswordResetEmailTemplate = (username, otp) => {
    const currentYear = new Date().getFullYear();
    return `
  <!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <title>Password Reset</title>
     <!-- Google Fonts Link -->
     <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
   </head>
   <body style="margin: 0; padding: 0; font-family: 'Roboto', Arial, sans-serif; background-color: #f7f7f7; font-size: 16px;">
     <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f7f7; padding: 20px;">
       <tr>
         <td>
           <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
             <tr>
               <td style="background-color: #00bc7d; padding: 20px 30px; color: #ffffff; text-align: center;">
                 <h2 style="margin: 0; font-size: 24px; text-transform: capitalize">Password Reset</h2>
               </td>
             </tr>
             <tr>
               <td style="padding: 20px 30px; text-align: center;">
                 <p style="margin: 0 0 20px; font-size: 16px; text-align: left;">Hi <strong>${username}</strong>,</p>
                 <p style="margin: 0 0 20px; font-size: 16px; text-align: left;">Your password reset OTP is:</p>
                 
                 <div style="margin: 30px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00bc7d;">${otp}</span>
                 </div>
                 
                 <p style="margin: 20px 0 0; font-size: 14px; color: #666; text-align: left;">This OTP expires in 10 minutes. If you did not request this, ignore this email.</p>
               </td>
             </tr>
             <tr>
               <td style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #999;">
                 &copy; ${currentYear} Moneytraits. All rights reserved.
               </td>
             </tr>
           </table>
         </td>
       </tr>
     </table>
   </body>
 </html>
    `;
};
