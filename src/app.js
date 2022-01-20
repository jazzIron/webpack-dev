import "./app.css";
import result from "./result";
import form from "./form";
//import nyancat from "./nyancat.jpg";

let resultEl;
let formEl;

document.addEventListener("DOMContentLoaded", async () => {
  formEl = document.createElement("div");
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  resultEl = document.createElement("div");
  resultEl.innerHTML = await result.render();
  document.body.appendChild(resultEl);
});

if (module.hot) {
  // 변경된 모듈만 변경할 수 있음
  console.log("핫 모듈 켜짐 ");
  module.hot.accept("./result", async () => {
    console.log("result module 변경됨");
    resultEl.innerHTML = await result.render();
  });

  module.hot.accept("./form", () => {
    formEl.render();
  });
}
