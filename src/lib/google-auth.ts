export const onGoogleScriptLoad = (decodeJwtResponse) => {
  try {
    const handleCredentialResponse = (response) => {
      // decodeJwtResponse() is a custom function defined by you
      // to decode the credential response.
      const responsePayload = decodeJwtResponse(response.credential);
      console.log("ID: " + responsePayload.sub);
      document.cookie = `auth=${response.credential}`;
      window.location.reload();
    };
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_SIGNIN_API_KEY,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("googleSignIn"),
      {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
      }, // customization attributes
    );
  } catch {}
};

export const decodeJwtResponse = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
};

export const getUser = (): User => {
  const cookies = document.cookie.split(";").reduce((res, c) => {
    const [key, val] = c.trim().split("=");
    res[key] = val;
    return res;
  }, {});
  const auth = cookies["auth"];
  let user = null;
  if (auth) {
    user = decodeJwtResponse(auth);
  }
  return user;
};

import { PUBLIC_ADMIN_MAIL } from '$env/static/public';

export const isAuthorized = (user: User): boolean => {
  // matches env ADMIN_MAIL
  console.log(user.email, PUBLIC_ADMIN_MAIL, user.email === PUBLIC_ADMIN_MAIL);
  return user !== null && user.email === PUBLIC_ADMIN_MAIL;
};

export interface User {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}
