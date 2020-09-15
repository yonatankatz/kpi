/** Capitalize First letter of string */

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Convert milliseconds in to date*/

const milliseconds = (date) => {
  let MyDate = new Date(date);
  return (
    MyDate.getFullYear() +
    "-" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + MyDate.getDate()).slice(-2)
  );
};

let edit_button = (editEvent, id) => {
  let editButton = document.createElement("button");
  editButton.classList.add("buttonBg");
  let editImg = document.createElement("img");
  editImg.setAttribute("src", "assets/image/pencil icon.svg");
  editImg.addEventListener("click", editEvent);
  editImg.setAttribute("id", id);
  editButton.appendChild(editImg);
  return editButton;
};

let remove_button = (removeEvent, id) => {
  let removeButton = document.createElement("button");
  removeButton.classList.add("buttonBg");
  let deleteImg = document.createElement("img");
  deleteImg.setAttribute("src", "assets/image/trash icon.svg");
  deleteImg.addEventListener("click", removeEvent);
  deleteImg.setAttribute("id", id);
  removeButton.appendChild(deleteImg);
  return removeButton;
};

let goalMeasurement = (
  description,
  DesId,
  editId,
  deleteId,
  type,
  date,
  className,
  id,
  editEvent,
  removeEvent,
  number,
  actual
) => {
  let date1, classDate;
  if (date != "" && date != undefined) {
    date1 = "Due " + milliseconds(date);
  } else {
    classDate = "d-none";
  }
  let div = document.createElement("div");
  div.classList.add(
    "d-md-flex",
    "p-2",
    "border_light",
    "rounded_5",
    "border_left",
    "mb-3",
    "align_center",
    className,
    "w-100",
    actual == "done" ? "disableDiv" : "a"
  );
  let div1 = document.createElement("div");
  div1.classList.add("mr-auto", "w-65");
  let p = document.createElement("p");
  p.classList.add("mb-0", "word_wrap");
  p.setAttribute("id", DesId);
  let textDes = document.createTextNode(description);
  p.appendChild(textDes);
  div1.appendChild(p);
  let div2 = document.createElement("div");
  div2.classList.add("d-flex", "content-end");
  // if(type == 'flag' && date != ''){
  let span = document.createElement("span");
  span.classList.add(
    "bg_orange_light",
    "text-white",
    "rounded-pill",
    "p-1",
    "text-center",
    "width-10",
    classDate
  );
  span.setAttribute("id", "date" + id);
  span.setAttribute("type", "flag");
  let dateElem = document.createTextNode(date1);
  span.appendChild(dateElem);
  div2.appendChild(span);
  // }
  // if (type == 'number'){
  let spanNum = document.createElement("span");
  spanNum.classList.add("d-none");
  spanNum.setAttribute("id", "number" + id);
  spanNum.setAttribute("type", "number");
  let numElem = document.createTextNode(number == undefined ? "" : number);
  spanNum.appendChild(numElem);
  div2.appendChild(spanNum);
  // }
  div2.appendChild(edit_button(editEvent, editId));
  div2.appendChild(remove_button(removeEvent, deleteId));
  div.appendChild(div1);
  div.appendChild(div2);
  return div;
};

let actionArray = (Id, text, classPresent) => {
  action = {
    actionId: Id,
    text: text,
  };
  if (classPresent == true) {
    action.done = "done";
  }
  return action;
};

let measurementArray = (id, description, type, target, date, classPresent) => {
  let kpi_data = {
    measureId: id,
    description: description,
    dueDate: date,
  };

  if (type == "number") {
    kpi_data.target = target;
    if (classPresent == true) {
      kpi_data.actual = "done";
    } else {
      kpi_data.actual = 0;
    }
    $("#selectMetric option:selected").val("number");
    kpi_data.type = $("#selectMetric option:selected").val();
  } else {
    // if(date != '') {
    //     kpi_data.dueDate = date
    // }
    if (classPresent == true) {
      kpi_data.actual = "done";
    }
    $("#selectMetric option:selected").val("flag");
    kpi_data.type = $("#selectMetric option:selected").val();
  }
  return kpi_data;
};

let departmentList = (id, name, deptId, paddingClass, child) => {
  let list = document.createElement("li");
  list.classList.add(
    "py-2",
    "pr-2",
    "position-relative",
    "radioButton",
    paddingClass,
    "dir",
    "mr-2",
    "width-11_9"
  );
  list.setAttribute("id", deptId);
  // list.setAttribute('data-toggle', 'collapse');
  // list.setAttribute('data-target', '#deptColId'+id)
  let input = document.createElement("input");
  input.setAttribute("type", "radio");
  input.setAttribute("id", "dep" + id);
  input.setAttribute("name", "radio");
  input.setAttribute("value", id);
  // input.setAttribute('checked', 'checked');
  list.appendChild(input);
  let label = document.createElement("label");
  label.setAttribute("for", "dep" + id);
  label.classList.add(
    "px-2",
    "d-flex",
    "align_center",
    "mb-0",
    "rounded_5",
    "border-0",
    "text-left",
    "height-2_5",
    "bgDropdown",
    "deptHover"
  );
  let p = document.createElement("span");
  p.classList.add("overflow-hidden", "height_1_4", "textBreak");
  let labelText = document.createTextNode(capitalize(name));
  p.appendChild(labelText);
  if (child > 0) {
    let span = document.createElement("span");
    // span.classList.add('cursor-pointer');
    let icon = document.createElement("i");
    icon.setAttribute("id", "test");
    icon.classList.add("fa", "width-1", "fa-caret-down");
    span.appendChild(icon);
    label.appendChild(span);
  }
  label.appendChild(p);
  list.appendChild(label);
  let ul = document.createElement("ul");
  // ul.classList.add('collapse');
  ul.classList.add("childLi", "pl-5");
  ul.setAttribute("id", "deptColId" + id);
  list.appendChild(ul);
  return list;
};

let gridView = (
  goalDesc,
  description,
  measureId,
  percentage,
  id,
  type,
  actual,
  icon,
  completed,
  rate,
  deptId
) => {
  let div = document.createElement("div");
  div.classList.add("col-md-12", "py-4", "col-lg-6");
  let div1 = document.createElement("div");
  div1.classList.add("p-2", "bg-dark", "border_top");
  let p = document.createElement("p");
  p.classList.add("text-center", "text-white", "mb-0", "cursor_pointer");
  p.setAttribute("goal-id", id);
  // p.addEventListener('click', scrollToId);
  let a = document.createElement("a");
  a.setAttribute("href", "dashboard.html?" + id + "/" + deptId);
  a.classList.add("text-white", "text-decoration-none");
  let text = document.createTextNode("Goal: " + goalDesc);
  a.appendChild(text);
  p.appendChild(a);
  div1.appendChild(p);
  let div2 = document.createElement("div");
  div2.classList.add(
    "p-3",
    "bg-white",
    "border_bottom",
    "test",
    "position-relative"
  );
  div2.addEventListener("click", KPIProgress);
  div2.setAttribute("progress-id", measureId);
  div2.setAttribute("goal-id", id);
  let p1 = document.createElement("p");
  p1.classList.add("text-center", "overflow-hidden", "height_1_4");
  // p1.setAttribute('progress-id', measureId);
  // p1.setAttribute('goal-id', id);
  let text1 = document.createTextNode(description);
  p1.appendChild(text1);
  div2.appendChild(p1);
  let percentageDiv = document.createElement("div");
  percentageDiv.classList.add("chartPercentage");
  percentageDiv.setAttribute("progress-id", measureId);
  percentageDiv.setAttribute("goal-id", id);
  let pPercentage = document.createElement("p");
  // pPercentage.classList.add('font-0_8');
  pPercentage.setAttribute("progress-id", measureId);
  pPercentage.setAttribute("goal-id", id);
  pPercentage.classList.add("mb-sm-4", "mb-5", "font-1_5");
  if (type == "number") {
    let percentageValue = document.createTextNode(percentage.toFixed(0) + "%");
    pPercentage.appendChild(percentageValue);
    percentageDiv.appendChild(pPercentage);
  } else {
    let percentageValue = document.createElement("i");
    percentageValue.classList.add("fa", icon, "font_icon");
    percentageValue.setAttribute("progress-id", measureId);
    percentageValue.setAttribute("goal-id", id);
    pPercentage.appendChild(percentageValue);
    percentageDiv.appendChild(pPercentage);
  }
  div2.appendChild(percentageDiv);
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "doughnut" + measureId);
  canvas.classList.add("canvasStyle");
  // canvas.setAttribute('progress-id', measureId);
  // canvas.setAttribute('goal-id', id);
  div2.appendChild(canvas);
  let p3 = document.createElement("p");
  p3.classList.add("text-center");
  let text2 = document.createTextNode(completed);
  p3.appendChild(text2);
  div2.appendChild(p3);
  let p4 = document.createElement("p");
  p4.classList.add("text-center");
  let text3 = document.createTextNode(rate);
  p4.appendChild(text3);
  div2.appendChild(p4);
  div.appendChild(div1);
  div.appendChild(div2);
  return div;
};

let listView = (
  goalId,
  goalDes,
  editGoal,
  removeGoal,
  editId,
  removeId,
  noBorder,
  pl0,
  border0
) => {
  // let li = document.createElement('li');
  // li.classList.add('no-border', 'pt-2', 'border-0', 'pl-0');
  // let goalName = document.createTextNode('GOAL #'+(index+1));
  // li.appendChild(goalName);
  let li1 = document.createElement("li");
  li1.classList.add(noBorder, pl0, border0);
  let div = document.createElement("div");
  div.classList.add(
    "d-md-flex",
    "p-3",
    "border_light",
    "rounded_5",
    "bg-white",
    "w-100",
    "align_center"
  );
  div.setAttribute("id", "goal-id" + goalId);
  let div1 = document.createElement("div");
  div1.classList.add(
    "mr-auto",
    "img_center",
    "bg-transparent",
    "cursor_pointer",
    "w-75",
    "p-2"
  );
  // div1.setAttribute('type', 'button');
  div1.setAttribute("data-toggle", "collapse");
  div1.setAttribute("data-target", ".collapseList" + goalId);
  let img = document.createElement("img");
  img.setAttribute("src", "assets/image/arrow right.svg");
  div1.appendChild(img);
  let span = document.createElement("span");
  span.classList.add("pl-2", "line_height", "word_wrap", "overflow-hidden");
  span.setAttribute("id", "KPI" + goalId);
  let goalDescription = document.createTextNode(capitalize(goalDes));
  span.appendChild(goalDescription);
  div1.appendChild(span);
  div.appendChild(div1);
  let div2 = document.createElement("div");
  div2.classList.add("d-flex", "content-end");
  div2.appendChild(edit_button(editGoal, editId));
  div2.appendChild(remove_button(removeGoal, removeId));
  div.appendChild(div2);
  li1.appendChild(div);
  let ul = document.createElement("ul");
  ul.setAttribute("id", "collapseList" + goalId);
  ul.classList.add("pl-3");
  li1.appendChild(ul);
  return li1;
};

let listMeasurementGoal = (goalId, description, type, date, compBtn) => {
  let li = document.createElement("li");
  li.classList.add("collapse", "collapseList" + goalId);
  let div = document.createElement("div");
  div.classList.add(
    "d-md-flex",
    "p-1",
    "p-sm-3",
    "border_light",
    "rounded_5",
    "border_left",
    "bg-white",
    "align_center",
    "position-relative"
  );
  let div1 = document.createElement("div");
  div1.classList.add("mr-auto", "w-75", "p-2");
  let p = document.createElement("span");
  p.classList.add("mb-0", "p-2", "line_height", "word_wrap", "overflow-hidden");
  let textDes = document.createTextNode(description);
  p.appendChild(textDes);
  div1.appendChild(p);
  let div2 = document.createElement("div");
  div2.classList.add("d-flex", "content-end", "p-2");
  if (compBtn == "done") {
    let fa = document.createElement("i");
    fa.classList.add("fa", "fa-check", "fontIcon");
    div2.appendChild(fa);
  } else {
    if (date != undefined && date != "") {
      let p1 = document.createElement("span");
      p1.classList.add(
        "bg_orange_light",
        "text-white",
        "rounded-pill",
        "p-2",
        "text-center",
        "width-10",
        "mb-0",
        "font_light"
      );
      let dateElem = document.createTextNode("Due " + milliseconds(date));
      p1.appendChild(dateElem);
      div2.appendChild(p1);
    }
  }
  div.appendChild(div1);
  div.appendChild(div2);
  li.appendChild(div);
  return li;
};

let deleteConfirmationFunction = (successMessage, caption) => {
  // swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!'
  // }).then((result) => {
  //     if (result.value) {
  //         successMessage();
  //     }
  // });

  // e.preventDefault();

  $("#dialog").dialog({
    title: "Delete [ " + caption + " ]",
    buttons: {
      Confirm: () => {
        successMessage();
      },
      Cancel: function () {
        $(this).dialog("close");
      },
    },
  });

  $("#dialog").dialog("open");
};

let findNested = (obj, parent, value, i) => {
  if (obj.goal.goalId === value) {
    parent.splice(i, 1);
  }
  if (obj && obj.children && obj.children.length > 0) {
    for (let j = 0; j < obj.children.length; j++) {
      findNested(obj.children[j], obj.children, value, j);
    }
  }
};

let removeDeptNested = (obj, parent, value, i) => {
  if (obj.id === value) {
    parent.splice(i, 1);
  }
  if (obj && obj.children && obj.children.length > 0) {
    for (let j = 0; j < obj.children.length; j++) {
      removeDeptNested(obj.children[j], obj.children, value, j);
    }
  }
};

let actionList = (text, id, done) => {
  let div = document.createElement("div");
  div.classList.add(
    "row",
    "mb-3",
    "d-flex",
    "align_center",
    "actionProgressList"
  );
  let div1 = document.createElement("div");
  div1.classList.add("col-md-9", "pb-2", "pb-md-0");
  let div1_1 = document.createElement("div");
  div1_1.classList.add("p-2", "border_light", "rounded_5", "align_center");
  let p = document.createElement("p");
  p.classList.add("mb-0");
  p.setAttribute("id", "actionPr" + id);
  let textNode = document.createTextNode(text);
  p.appendChild(textNode);
  div1_1.appendChild(p);
  div1.appendChild(div1_1);
  let div2 = document.createElement("div");
  div2.classList.add(
    "col-md-3",
    "d-flex",
    "justify-content-end",
    "justify-content-md-center",
    "actionCheckbox"
  );
  let input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("name", "actionCheckbox");
  input.setAttribute("id", "actionProgress" + id);
  let label = document.createElement("label");
  label.setAttribute("for", "actionProgress" + id);
  label.classList.add(
    "bg_white",
    "border-0",
    "width-6",
    "height-2_5",
    "rounded_5",
    "buttonAdd",
    "align_center",
    "p-2",
    "text-center",
    "mb-0"
  );
  if (done == "done") {
    let fa = document.createElement("i");
    fa.classList.add("fa", "fa-check", "fontIcon", "font-1_5");
    label.appendChild(fa);
  } else {
    let labelText = document.createTextNode("Done");
    label.appendChild(labelText);
  }
  div2.appendChild(input);
  div2.appendChild(label);
  div.appendChild(div1);
  div.appendChild(div2);
  return div;
};

let arrayCon = (result, array) => {
  result.map((value, index) => {
    array.push(value);
    if (value.children && value.children.length) {
      arrayCon(value.children, array);
    }
  });
};

let departmentArray = (id, parentID, name) => {
  let dept = {
    id: id,
    parentId: parentID,
    name: name,
    children: [],
  };
  return dept;
};

$(document).keypress(function (event) {
  if (event.which == "13") {
    event.preventDefault();
  }
});

let deleteStorage_goal = (id, deptId) => {
  var changedLog = {};
  var set = {};
  var deleted = [];
  let temp1 = utils.storage.get(deptId);
  for (let i = 0; i < temp1.length; i++) {
    findNested(temp1[i], temp1, parseInt(id) + 0, i);
  }

  let parentDept = utils.storage.get("department" + deptId).parentId;
  if (parseInt(parentDept) != 0) {
    let parentDeptList = utils.storage.get("department" + parentDept).id;
    let parentGoalList = utils.storage.get(parentDeptList);
    for (let i = 0; i < parentGoalList.length; i++) {
      findNested(parentGoalList[i], parentGoalList, parseInt(id) + 0, i);
    }
    utils.storage.set(parentDeptList, parentGoalList);
    set[parentDeptList] = parentGoalList;
  }

  let arr = [];
  arrayCon(utils.storage.get(deptId), arr);
  arr.map((item, index) => {
    if (item.departmentId != parseInt(deptId)) {
      let tempAry = utils.storage.get(parseInt(item.departmentId));
      for (let i = 0; i < tempAry.length; i++) {
        findNested(tempAry[i], tempAry, parseInt(id) + 0, i);
      }
      utils.storage.set(parseInt(item.departmentId), tempAry);
      set[item.departmentId] = tempAry;
    }
  });
  utils.storage.set(deptId, temp1);
  set[deptId] = temp1;
  if (temp1.length == 0) {
    utils.storage.remove(deptId);
    deleted.push(deptId);
    $("#listView").addClass("d-none");
    $("#NotFound").removeClass("d-none");
  }
  changedLog["set"] = set;
  changedLog["deleted"] = deleted;
  return changedLog;
};

let addDeptArray = (result, id) => {
  result.children.map((item, index) => {
    if (item.id == parseInt(split[1])) {
      item.children.push(JSON.parse(localStorage.getItem("department" + id)));
      return;
    }
    if (item.children && item.children.length) {
      addDeptArray(item, id);
    }
  });
};

let addDepartmentFunc = (name, deptID, selectDeptId) => {
  var changedLog = {};
  var set = {};
  const depArr = departmentArray(deptID, selectDeptId, name);
  utils.storage.set("department" + deptID, depArr);
  changedLog["department" + deptID] = depArr;
  let array = utils.storage.get("department" + selectDeptId);
  array.children.push(departmentArray(deptID, selectDeptId, name));
  utils.storage.set("department" + selectDeptId, array);
  changedLog["department" + selectDeptId] = array;
  let deptArray = utils.storage.get("departmentList");
  if (array.parentId == 0) {
    deptArray.children.push(departmentArray(deptID, selectDeptId, name));
  } else {
    addDeptArray(deptArray, deptID);
  }
  utils.storage.set("departmentList", deptArray);
  set["departmentList"] = deptArray;
  changedLog["set"] = set;
  return changedLog;
};

let editDeptArray = (result, matchId, deptName) => {
  result.children.map((item, index) => {
    if (item.id == matchId) {
      item.name = deptName;
    }
    if (item.children && item.children.length) {
      editDeptArray(item, matchId, deptName);
    }
  });
};

let editDepartmentFunc = (name, id, editDeptId, edit) => {
  var set = {};
  if (edit == true) {
    let list = utils.storage.get("department" + split[1]);
    if (list.parentId == 0) {
      let company = utils.storage.get("departmentList");
      company.name = $("#departmentRenameInput").val();
      utils.storage.set("departmentList", company);
      set["departmentList"] = company;
      utils.storage.set("department" + split[1], company);
      set["department" + split[1]] = company;
    } else {
      list.name = $("#departmentRenameInput").val();
      utils.storage.set("department" + split[1], list);
      set["department" + split[1]] = list;
      let dept = utils.storage.get("departmentList");
      editDeptArray(dept, parseInt(list.id), $("#departmentRenameInput").val());
      utils.storage.set("departmentList", dept);
      set["departmentList"] = dept;
    }
  } else {
    const depArray = departmentArray(editDeptId, parseInt(id), name);
    utils.storage.set("department" + editDeptId, depArray);
    set["department" + editDeptId] = depArray;
    let newDeptName = utils.storage.get("department" + parseInt(id));
    newDeptName.children.map((item, index) => {
      if (item.id == parseInt(editDeptId)) {
        item.name = name;
      }
    });
    utils.storage.set("department" + id, newDeptName);
    set["department" + id] = newDeptName;
    let dept = utils.storage.get("departmentList");
    editDeptArray(dept, parseInt(editDeptId), name);
    utils.storage.set("departmentList", dept);
    set["departmentList"] = dept;
  }
  return { set: set };
};

let deleteDepartmentFunc = (id, selectDeptId) => {
  var set = {};
  var deleted = [];
  let deptDelId = id;
  let delDept = utils.storage.get("department" + selectDeptId);
  for (let i = 0; i < delDept.children.length; i++) {
    removeDeptNested(delDept.children[i], delDept.children, deptDelId, i);
  }
  utils.storage.set("department" + selectDeptId, delDept);
  let dept = utils.storage.get("departmentList");
  for (let i = 0; i < dept.children.length; i++) {
    removeDeptNested(dept.children[i], dept.children, deptDelId, i);
  }
  utils.storage.set("departmentList", dept);
  return { set: set, deleted: deleted };
};

let addNewGoalFunc = (array, deptId, goalId) => {
  var set = {};
  var deleted = [];

  if (utils.storage.get(deptId)) {
    if (goalId == "parentGoal") {
      var arr1 = utils.storage.get(deptId);
      if (!arr1) {
        arr1 = [];
      }
      arr1.push(array);
      utils.storage.set(deptId, arr1);
      set[deptId] = arr1;
      window.location = "dashboard.html";
    } else {
      let goalDetail = array;
      let ary = utils.storage.get(
        utils.storage.get("department" + deptId).parentId
      );
      if (!ary) {
        ary = [];
      }
      ary.map((item, index) => {
        if (item.goal.goalId == parseInt(goalId)) {
          if (item.children) {
            item.children.push(goalDetail);
          } else {
            item["children"].push(goalDetail);
          }
        }
      });
      const parentId = utils.storage.get("department" + deptId).parentId;
      utils.storage.set(parentId, ary);
      set[parentId] = ary;
      let arr1 = utils.storage.get(deptId);
      arr1.push(goalDetail);
      utils.storage.set(deptId, arr1);
      set[deptId] = arr1;
    }
  } else {
    let array1 = [];
    let detail = array;
    array1.push(detail);
    utils.storage.set(deptId, array1);
    set[deptId] = array1;
    if (
      utils.storage.get(utils.storage.get("department" + deptId).parentId) &&
      goalId != "parentGoal"
    ) {
      let ary = utils.storage.get(
        utils.storage.get("department" + deptId).parentId
      );
      ary.map((item, index) => {
        if (item.goal.goalId == parseInt(goalId)) {
          if (item.children) {
            item.children.push(detail);
          } else {
            item["children"].push(detail);
          }
        }
      });
      const parentId = utils.storage.get("department" + deptId).parentId;
      utils.storage.set(parentId, ary);
      set[parentId] = ary;
    }
  }
  return { set: set };
};

let editGoalFunc = (deptId, edit, result, goalId) => {
  const set = {};
  const deleted = [];
  if (edit == true) {
    utils.storage.set("setGoal" + goalId, result);
    set["setGoal" + goalId] = result;
    let array = utils.storage.get(deptId);
    for (let i = 0; i < array.length; i++) {
      findNested(array[i], array, parseInt(goalId) + 0, i);
    }

    array.push(result);
    utils.storage.set(deptId, array);
    set[deptId] = array;
    let parentDept = utils.storage.get("department" + deptId).parentId;
    if (parentDept != 0) {
      let parentDeptList = utils.storage.get("department" + parentDept).id;
      let parentGoalList = utils.storage.get(parentDeptList);
      parentGoalList.map((item, index) => {
        if (goalId == item.goal.goalId) {
          item.measurements = [];
          item.actions = [];
          item.measurements = result.measurements;
          item.actions = result.actions;
        }
        if (item.children) {
          item.children.map((item1, index) => {
            if (goalId == item1.goal.goalId) {
              item1.measurements = [];
              item1.actions = [];
              item1.measurements = result.measurements;
              item1.actions = result.actions;
            }
          });
        }
      });
      utils.storage.set(parentDeptList, parentGoalList);
      set[parentDeptList] = parentGoalList;
    }
  } else {
    let departmentGoalList = utils.storage.get(deptId);
    editGoalArray(departmentGoalList);
    let parentDept = utils.storage.get("department" + deptId).parentId;
    if (parentDept != 0) {
      let parentDeptList = utils.storage.get("department" + parentDept).id;
      let parentGoalList = utils.storage.get(parentDeptList);
      if (parentGoalList != null) {
        editGoalArray(parentGoalList);
        utils.storage.set(parentDeptList, parentGoalList);
        set[parentDeptList] = parentGoalList;
      }
    }
    let arr = [];
    arrayCon(departmentGoalList, arr);
    arr.map((item, index) => {
      if (item.departmentId != parseInt(deptId)) {
        let tempAry = utils.storage.get(parseInt(item.departmentId));
        if (tempAry) {
          editGoalArray(tempAry);
          utils.storage.set(parseInt(item.departmentId), tempAry);
        }
      }
    });
    utils.storage.set(parseInt(deptId), departmentGoalList);
    set[deptId] = departmentGoalList;
    utils.storage.remove("editGoalDetail");
    deleted.push("editGoalDetail");
  }
  return { set: set, deleted: deleted };
};

let editGoalArray = (result) => {
  result.map((item, index) => {
    if (parseInt($("#goalDes").attr("goalId")) == item.goal.goalId) {
      item.goal.description = $("#goalDes").val();
      item.actions = [];
      item.measurements = [];
      item.measurements = KPIUpdatedList();
      item.actions = actionUpdatedList();
    }
    if (item.children && item.children.length) {
      editGoalArray(item.children);
    }
  });
};
