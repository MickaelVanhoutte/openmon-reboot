import { d as bind_props, c as pop, p as push } from "../../chunks/index.js";
import { e as escape_html } from "../../chunks/escaping.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  if (data.user) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Logged in as ${escape_html(data.user.email)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div id="googleSignIn"></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
