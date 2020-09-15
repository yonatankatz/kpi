$("#dialog").dialog({
  autoOpen: false,
  modal: true,
});

let actionObj;
let measurementObj = [];

let setDept = async (id, array) => {
  try {
    await api.setDepartment(id, array);
  } catch (e) {
    console.log(e);
    toastr.error("Enable to get Department");
  }
};

let setGoalArray = async (id, array) => {
  try {
    let i = await api.setGoalArray(id, array);
  } catch (e) {
    console.log(e);
    toastr.error("Enable to get goals");
  }
};

let departmentHierarchy = (result, deptId, paddingClass) => {
  result.children.map((item, index) => {
    let listId = document.getElementById(deptId);
    if (api.setDepartment) {
      setDept(item.id, item);
    }
    listId.appendChild(
      departmentList(
        item.id,
        item.name,
        item.id,
        paddingClass,
        item.children.length
      )
    );
    if (item.children && item.children.length) {
      $("#deptColId" + item.id).append(
        '<li class="p-1 position-relative radioButton"></li>'
      );
      departmentHierarchy(item, "deptColId" + item.id, "pl-2");
    }
  });
};

let setDepartment = (result) => {
  $("#department").empty();
  let department = document.querySelector("#addNewDepartment");
  if (result) {
    if (result.id) {
      department.firstElementChild.setAttribute("id", "dep" + result.id);
      department.firstElementChild.setAttribute("value", result.id);
      $("#dep" + result.id).prop("checked", true);
      department.lastElementChild.children[1].textContent = capitalize(
        result.name
      );
      department.lastElementChild.setAttribute("for", "dep" + result.id);
      if (api.setDepartment) {
        setDept(result.id, result);
      }
    } else {
      department.firstElementChild.setAttribute("id", "dep1");
      department.firstElementChild.setAttribute("value", 1);
      $("#dep" + result.id).prop("checked", true);
      department.lastElementChild.children[1].textContent = capitalize(
        "Management"
      );
      department.lastElementChild.setAttribute("for", "dep1");
      let array = {
        id: 1,
        parentId: 0,
        name: "Management",
        children: [],
      };
      if (api.setDepartment) {
        setDept(1, result);
      }
    }
    $("#collapseExample").addClass("show");
    if (result.children && result.children.length) {
      $("#toggleArrow").removeClass("d-none");
      $("#department").append(
        '<li class="p-1 position-relative radioButton"></li>'
      );
      departmentHierarchy(result, "department", "pl-2");
    }
  }

  $(".dir")
    .find("i")
    .click(function (e) {
      let closestLabel = $(this)[0].closest("label");
      let iconTag = $(this)[0]; //.firstElementChild.firstElementChild;
      if (closestLabel.childElementCount == 2) {
        if (iconTag.classList.contains("fa-caret-right")) {
          iconTag.classList.remove("fa-caret-right");
          iconTag.classList.add("fa-caret-down");
        } else {
          iconTag.classList.remove("fa-caret-down");
          iconTag.classList.add("fa-caret-right");
        }
      }

      $(closestLabel)
        .next("ul")
        .slideToggle(500, () => {
          $(this).show();
        });
    });

  goalDetail();

  $("#DeptForm input[type=radio]").on("change", () => {
    if (
      $("input[name=radio]:checked", "#DeptForm").val() != "addNewDepartment"
    ) {
      goalDetail();
    }
  });
};

window.onload = async () => {
  try {
    const department = await api.getDepartments();
    setDepartment(department);
  } catch (error) {
    alert(error.message ? error.message : JSON.stringify(error));
  }
};

let gridViewFunc = (result) => {
  result.map((item, index) => {
    if (api.setGoalArray) {
      setGoalArray("setGoal" + item.goal.goalId, item);
    }
    let actionComplete = 0;
    let totalActions = item.actions.length;
    item.actions.map((item2, index2) => {
      item2.goalId = item.goal.goalId;
      actionObj.push(item2);
      if (item2.done == "done") {
        actionComplete++;
      }
    });

    item.measurements.map((item1, index1) => {
      measurementObj.push(item1);
      let gridViewId = document.querySelector("#gridView");
      let deptIdScroll = parseInt(
        $("input[name=radio]:checked", "#DeptForm").val()
      );

      if (item1.type == "number") {
        if (item1.actual == "done") {
          gridViewId.appendChild(
            gridView(
              item.goal.description,
              item1.description,
              item1.measureId,
              100,
              item.goal.goalId,
              item1.type,
              "",
              "",
              "100% complete",
              "Current rate: " + (100).toFixed(0),
              deptIdScroll
            )
          );
          chartUI("doughnut" + item1.measureId, [100, 0]);
        } else {
          let percentage = (100 * item1.actual) / item1.target;
          gridViewId.appendChild(
            gridView(
              item.goal.description,
              item1.description,
              item1.measureId,
              percentage,
              item.goal.goalId,
              item1.type,
              "",
              "",
              percentage.toFixed(0) + "% Complete",
              "Current rate: " + percentage.toFixed(0),
              deptIdScroll
            )
          );
          chartUI("doughnut" + item1.measureId, [percentage, 100 - percentage]);
        }
      }
      if (item1.type == "flag") {
        if (item1.actual == "done") {
          gridViewId.appendChild(
            gridView(
              item.goal.description,
              item1.description,
              item1.measureId,
              "",
              item.goal.goalId,
              item1.type,
              item1.actual,
              "fa-thumbs-up",
              "100% Complete",
              "Current progress: " + actionComplete + "/" + totalActions,
              deptIdScroll
            )
          );
          chartUI("doughnut" + item1.measureId, [100, 0]);
        } else {
          if (
            milliseconds(new Date(item1.dueDate)) >= milliseconds(new Date())
          ) {
            gridViewId.appendChild(
              gridView(
                item.goal.description,
                item1.description,
                item1.measureId,
                "",
                item.goal.goalId,
                item1.type,
                "",
                "fa-spinner",
                "0% Complete",
                "Current progress: " + actionComplete + "/" + totalActions,
                deptIdScroll
              )
            );
            chartUI("doughnut" + item1.measureId, [0, 100]);
          } else if (
            milliseconds(new Date(item1.dueDate)) < milliseconds(new Date())
          ) {
            gridViewId.appendChild(
              gridView(
                item.goal.description,
                item1.description,
                item1.measureId,
                "",
                item.goal.goalId,
                item1.type,
                "",
                "fa-thumbs-down",
                "0% Complete",
                "Current progress: " + actionComplete + "/" + totalActions,
                deptIdScroll
              )
            );
            chartUI("doughnut" + item1.measureId, [0, 100]);
          } else {
            gridViewId.appendChild(
              gridView(
                item.goal.description,
                item1.description,
                item1.measureId,
                "",
                item.goal.goalId,
                item1.type,
                "",
                "fa-spinner",
                "0% Complete",
                "Current progress: " + actionComplete + "/" + totalActions,
                deptIdScroll
              )
            );
            chartUI("doughnut" + item1.measureId, [0, 100]);
          }
        }
      }
    });
    // if(item.children.length){
    //     gridViewFunc(item.children);
    // }
  });
};

let setGoal = (result) => {
  if (result && result.length) {
    $("#gridView").removeClass("d-none");
    $("#NotFound").addClass("d-none");
    $("#gridView").empty();
    actionObj = [];
    measurementObj = [];
    gridViewFunc(result);
  } else {
    $("#gridView").addClass("d-none");
    $("#NotFound").removeClass("d-none");
  }
};

let goalDetail = async () => {
  try {
    let deptName = document.getElementById(
      "dep" + $("input[name=radio]:checked", "#DeptForm").val()
    );
    $("#viewDept").text(
      "KPI Overview for " + capitalize(deptName.nextElementSibling.textContent)
    );
    const departmentGoals = await api.getDepartmentGoal(
      $("input[name=radio]:checked", "#DeptForm").val()
    );
    setGoal(departmentGoals);
  } catch (e) {
    console.log(e);
    toastr.error("Enable to get Goal");
  }
};

let progressGoalId;
let measurementGoalId;
KPIProgress = (e) => {
  $("#editKPI").modal("show");
  let measureId = e.target.getAttribute("progress-id");
  progressGoalId = e.target.getAttribute("goal-id");
  measurementGoalId = e.target.getAttribute("progress-id");
  measurementObj.map((item, index) => {
    if (item.measureId == measureId) {
      $("#KPIProgressDes").text("KPI : " + item.description);
      if (item.type == "number") {
        $("#typeNumber").removeClass("d-none");
        $("#currentTarget").text(item.target);
        if (item.actual == "done") {
          $("#numberKPI").prop("checked", true);
          $("#typeNumber").addClass("disableDiv");
        } else {
          $("#progress").val(item.actual);
        }
      } else {
        if (item.actual == "done") {
          $("#flagKPI").prop("checked", true);
          let fa = document.createElement("i");
          fa.classList.add("fa", "fa-check", "fontIcon", "font-1_5");
          document.getElementById("flagKPI").nextElementSibling.textContent =
            "";
          document.getElementById("flagKPI").nextElementSibling.appendChild(fa);
          document
            .getElementById("flagKPI")
            .nextElementSibling.classList.add("cursorEvent", "bg-white");
        }
        $("#typeFlag").removeClass("d-none");
      }
    }
  });

  $("#actionDoneList").empty();
  let actionDoneList = document.querySelector("#actionDoneList");
  if (actionObj.length == 0) {
    $("#actionProgressTitle").addClass("d-none");
  } else {
    actionObj.map((item, index) => {
      if (item.goalId == progressGoalId) {
        actionDoneList.append(actionList(item.text, item.actionId, item.done));
        if (item.done == "done") {
          $("#actionProgress" + item.actionId).prop("checked", true);
          let actionBtn = document.getElementById(
            "actionProgress" + item.actionId
          );
          actionBtn.nextElementSibling.classList.add("cursorEvent", "bg-white");
        }
      }
    });
  }
};

$("#enableProgress").click((e) => {
  e.preventDefault();
  $("#progress").prop("disabled", false);
  $("#enableProgress").addClass("bgOnClick");
  $("#progress").addClass("inputFocus");
});

let classFunction = () => {
  $("#typeNumber").addClass("d-none");
  $("#typeFlag").addClass("d-none");
  $("#numberKPI").prop("checked", false);
  $("#flagKPI").prop("checked", false);
  $("#typeNumber").removeClass("disableDiv");
  $("#typeFlag").removeClass("cursorEvent");
  $("#progress").prop("disabled", true);
  $("#enableProgress").removeClass("bgOnClick");
  $("#progress").removeClass("inputFocus");
  $("#actionProgressTitle").removeClass("d-none");
  document.getElementById("flagKPI").nextElementSibling.textContent = "Done";
  document
    .getElementById("flagKPI")
    .nextElementSibling.classList.remove("cursorEvent", "bg-white");
};

$("#progressModal").click(() => {
  classFunction();
});

$("#saveProgress").click((e) => {
  e.preventDefault();

  let edit = (result) => {
    result.actions = [];
    $(".actionProgressList").each((i, obj) => {
      let action = {
        actionId: obj.firstElementChild.firstElementChild.firstElementChild
          .getAttribute("id")
          .replace("actionPr", ""),
        text:
          obj.firstElementChild.firstElementChild.firstElementChild.textContent,
      };
      if (
        document.getElementById(
          obj.lastElementChild.firstElementChild.getAttribute("id")
        ).checked == true
      ) {
        action.done = "done";
      }
      result.actions.push(action);
    });
    result.measurements.map((item, index) => {
      if (item.measureId == measurementGoalId) {
        if (item.type == "number") {
          if (parseInt($("#progress").val()) > parseInt(item.target)) {
            toastr.error("Current progress exceed the current target");
            return;
          } else if (parseInt($("#progress").val()) < 0) {
            toastr.error("Current progress must be positive value");
          } else {
            if (item.target == $("#progress").val()) {
              item.actual = "done";
            } else {
              item.actual = $("#progress").val();
            }
          }
        } else {
          item.measureId = item.measureId;
          item.description = item.description;
          if (item.dueDate) {
            item.dueDate = item.dueDate;
          }
          if ($("#flagKPI").prop("checked") == true) {
            item.actual = "done";
          }
          item.type = "flag";
        }
      }
    });

    let updatedGoal = () => {
      goalDetail();
      $("#editKPI").modal("toggle");
      classFunction();
    };

    let editGoal = async () => {
      try {
        const goalData = await api.editGoal(
          result,
          $("input[name=radio]:checked", "#DeptForm").val(),
          true,
          progressGoalId
        );
        updatedGoal(goalData);
      } catch (e) {
        console.log(e);
        toastr.error("Enable to edit goal");
      }
    };
    editGoal();
  };

  let singleGoal = async () => {
    try {
      const Goal = await api.getSingleGoalData(progressGoalId, true);
      edit(Goal);
    } catch (error) {
      console.log(error);
      toastr.error("Enable to get goal detail");
    }
  };
  singleGoal();
});

$("#addNewGoal").click(() => {
  window.location =
    "newKPI.html?new=" + $("input[name=radio]:checked", "#DeptForm").val();
});
