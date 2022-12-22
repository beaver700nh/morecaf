import { v4 as uuidv4 } from "https://jspm.dev/uuid";

$.fn.useTemplate = function (elem) {
  const dest = elem ?? $(this).parent();
  const copy = $($(this).html());

  dest.append(copy);

  return copy;
}

function main() {
  pp_emphasize_underscores();
  pp_bind_popup_closers();
  pp_add_root_node();
  pp_bind_node_selectors();
  pp_bind_moreca_calculation();
}

function pp_emphasize_underscores() {
  $(".emphasized").each(
    function () {
      let orig = $(this).text();
      let cool = orig.replaceAll(/_(.)/g, "<u>$1</u>");
      $(this).html(cool);
    }
  );
}

function pp_bind_popup_closers() {
  $(".popup-ok").click(
    function () {
      $(this).closest(".popup").addClass("hidden");

      let origin = $(this).data("origin");
      let data = popup_form_collect_data($(this));
      $(`#${origin}`).trigger("node-setup", data);
    }
  );
}

function popup_form_collect_data(elem) {
  let collected = {};

  elem.siblings(".form-data").each(
    function () {
      collected[$(this).attr("name")] = $(this).val();
    }
  );

  return collected;
}

function pp_add_root_node() {
  add_node("ROOT", $("#content"));
}

function add_node(content, location) {
  let elem = $("#_node").useTemplate(location.children(".node-container"));
  elem.find(".node-content").text(content);
  elem.attr("id", uuidv4());
  elem.click(new_node);
  elem.contextmenu(select_node);
  elem.on(
    "node-setup",
    function (event, data) {
      $(this).children(".node-content").text(data.name);
      event.stopPropagation()
    }
  );

  return elem;
}

function new_node(event) {
  let node = add_node("New Node", $(this));
  ask_node_info(node.attr("id"));
  event.stopPropagation();
}

function ask_node_info(origin) {
  $("#new-node").find(".popup-ok").data("origin", origin);
  $("#new-node").removeClass("hidden");
}

function select_node(event) {
  let destination = $("#output").data("polling");
  let dest_elem = $(`#${destination}`);
  dest_elem.removeClass("unknown");
  dest_elem.text($(this).children(".node-content")[0].innerHTML);
  dest_elem.data("id", $(this).attr("id"));

  $("#output").data("polling", "");
  $("#output").removeClass("polling");

  event.preventDefault();
  event.stopPropagation();

  $("#moreca").trigger("selected");
}

function pp_bind_node_selectors() {
  $("#output").find("span.unknown").click(
    function () {
      if ($(this).attr("id") === "moreca") {
        return;
      }

      $("#output").data("polling", $(this).attr("id"));
      $("#output").addClass("polling");
    }
  );
}

function pp_bind_moreca_calculation() {
  $("#moreca").on(
    "selected",
    function () {
      if ($("#org1").hasClass("unknown") || $("#org2").hasClass("unknown")) {
        return;
      }

      let id1 = $("#org1").data("id");
      let id2 = $("#org2").data("id");
      let moreca = calculate_moreca($(`#${id1}`), $(`#${id2}`));
      let name = $(`#${moreca}`).children(".node-content").text();

      $(this).text(name);
      $(this).removeClass("unknown");
    }
  );
}

function calculate_moreca(org1, org2) {
  let parents1 = org1.parents(".node");
  let parents2 = org2.parents(".node");
  let moreca;

  parents1.each(
    function () {
      let p1 = $(this);
      parents2.each(
        function () {
          let p2 = $(this);

          let p1id = p1.attr("id");
          let p2id = p2.attr("id");

          console.log(p1id, p1.children(".node-content").text());
          console.log(p2id, p2.children(".node-content").text());
          console.log("=")

          if (p1id === p2id) {
            moreca = p1id;
            return false;
          }
        }
      );
      if (moreca) {
        return false;
      }
    }
  );

  return moreca;
}

$(document).ready(main);
